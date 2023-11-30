const db = require('../models/db');
const S3 = require('../services/S3');

const itemsPerPage = 6;
const q =
  `
SELECT 
DISTINCT p.id AS id, p.category, p.title, p.description, p.price, p.texture, p.wash, p.place, p.note, p.story, p.main_image,
(SELECT JSON_ARRAYAGG(JSON_OBJECT('code', c.code, 'name', c.name)) FROM color c WHERE c.id IN (SELECT v.color_id FROM variant v WHERE v.product_id = p.id)) AS colors,
(SELECT JSON_ARRAYAGG(ds.size) FROM (SELECT DISTINCT v.product_id, v.size FROM variant v WHERE v.product_id = p.id) AS ds) AS sizes,
(SELECT JSON_ARRAYAGG(JSON_OBJECT('color_code', dv.color_code, 'size', dv.size, 'stock', dv.stock)) FROM (SELECT DISTINCT v.product_id, c.code AS color_code, v.size, v.stock FROM variant v INNER JOIN color c ON v.color_id = c.id) AS dv WHERE dv.product_id = p.id) AS variants,
p.main_image AS main_image,
(SELECT JSON_ARRAYAGG(i.url) FROM images i WHERE i.product_id = p.id) AS images
FROM product p 
LEFT JOIN variant v ON p.id = v.product_id
LEFT JOIN color c ON v.color_id = c.id
LEFT JOIN images i ON p.id = i.product_id
`

const queryTotalPageNumber = async (category) => {
  let qGetTotalCount = `SELECT COUNT(DISTINCT p.id) AS total_count FROM product p`;
  if (category) {
    if (category == "men" || category == "women" || category == "accessories") {
      qGetTotalCount += ` WHERE category = '${category}'`
    } else {
      qGetTotalCount += ` WHERE p.title LIKE '%${category}%'`
    }
  }
  const [totalCountRows] = await db.query(qGetTotalCount);
  const totalCount = totalCountRows[0].total_count;
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  return totalPages;
}

const queryAllProducts = async (pageNumber) => {
  const totalPages = await queryTotalPageNumber();
  const isLastPage = pageNumber >= totalPages - 1;
  try {
    const [rows] = await db.query(q + ` LIMIT ${itemsPerPage} OFFSET ${pageNumber * itemsPerPage}`);
    const resBody = {
      data: rows,
      ...(isLastPage ? {} : { next_paging: pageNumber + 1 })
    };
    return resBody;
  } catch (err) {
    throw new Error('Error fetching data:', err);
  }
}

// Define a common function to handle category requests
const queryProductsByCategory = async (category, pageNumber) => {
  // Check if the current page is the last page
  const totalPages = await queryTotalPageNumber(category);
  const isLastPage = pageNumber >= totalPages - 1;
  let qCategory = q + ` WHERE category = "${category}" LIMIT ${itemsPerPage} OFFSET ${pageNumber * itemsPerPage}`;
  try {
    const [rows] = await db.query(qCategory);
    const resBody = {
      data: rows,
      ...(isLastPage ? {} : { next_paging: pageNumber + 1 })
    };
    return resBody;
  } catch (err) {
    throw new Error('Error fetching data:', err);
  }
}


const queryProductsByKeyword = async (keyword, pageNumber) => {
  const totalPages = await queryTotalPageNumber(keyword);
  const isLastPage = pageNumber >= totalPages - 1;
  let qKeywordSearch = q + ` WHERE p.title LIKE '%${keyword}%' LIMIT ${itemsPerPage} OFFSET ${pageNumber * itemsPerPage}`;
  try {
    const [rows, fields] = await db.query(qKeywordSearch);
    const resBody = {
      data: rows,
      ...(isLastPage ? {} : { next_paging: pageNumber + 1 })
    };
    return resBody;
  } catch (err) {
    throw new Error('Error fetching data:', err);
  }
}

const queryProductById = async (id) => {
  let qIdSearch = q + ` WHERE p.id = ${id}`
  try {
    const [rows, fields] = await db.query(qIdSearch);
    if (rows.length) {
      return rows[0];
    } else {
      return null;
    }
  } catch (err) {
    throw new Error('Error fetching data:', err);
  }
}


const insertProduct = async (connection, productInfo) => {
  try {
    const insertQuery = 'INSERT INTO product (category, title, description, price, texture, wash, place, note, story, main_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [productInsertResult] = await connection.execute(insertQuery, productInfo);
    const productId = productInsertResult.insertId;
    return productId;
  } catch (err) {
    console.log(err);
    throw new Error('Error inserting product:', err);
  }
}

const insertVariants = (connection, variantObjs, productId, colorObjs) => {
  try {
    return variantObjs.map(async variant => {
      const colorId = colorObjs.find(color => color.code === variant.color_code).id;
      return connection.execute('INSERT INTO variant (size, stock, product_id, color_id) VALUES (?, ?, ?, ?)', [variant.size, variant.stock, productId, colorId]);
    });
  } catch (err) {
    throw new Error("fail to insert variants:", err);
  }
}

const queryColorsIds = (connection, colorObjs) => {
  try {
    return colorObjs.map(async color => {
      const [result] = await connection.execute('SELECT id FROM color WHERE code = ?', [color.code]);
      if (result.length === 0) {
        const [result] = await connection.execute('INSERT INTO color (name, code) VALUES (?, ?)', [color.name, color.code]);
        return { id: result.insertId, code: color.code };
      }
      return { id: result[0].id, code: color.code };
    });
  } catch (err) {
    throw new Error('Error fetching color:', err);
  }
}

const insertImages = (connection, imageUrlsArray, productId) => {
  try {
    return imageUrlsArray.map(async imageUrl => {
      const [rows] = await connection.execute('INSERT INTO images (product_id, url) VALUES (?, ?)', [productId, imageUrl]);
      return rows;
    });
  } catch (err) {
    throw new Error('Fail to insert images:', err);
  }
}

// Function to insert data into the orders and order_items tables within a transaction
const insertOrderAndItems = async (productInfo, mainImage, images) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    if (!mainImage) mainImage = [];
    if (!images) images = [];
    const allImages = [...mainImage, ...images]
    let allImageUrls;
    if (allImages.length !== 0) {
      allImageUrls = await S3.uploadImagesToS3(allImages)
      productInfo.main_image = mainImage.length !== 0 ? allImageUrls[0] : null;
    }

    let productData = [
      productInfo.category,
      productInfo.title,
      productInfo.description,
      productInfo.price,
      productInfo.texture,
      productInfo.wash,
      productInfo.place,
      productInfo.note,
      productInfo.story,
      productInfo.main_image,
    ];

    const [productId, ...colorObjs] = await Promise.all([
      insertProduct(connection, productData),
      ...queryColorsIds(connection, productInfo.colors)
    ]);

    const fileUrls = allImageUrls.slice(1)

    await Promise.all([
      insertVariants(connection, productInfo.variants, productId, colorObjs),
      insertImages(connection, fileUrls, productId)
    ])

    await connection.commit();

  } catch (err) {
    if (connection) {
      connection.rollback();
    }
    throw err;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}


const searchVariantSql = `
SELECT v.id AS variant_id
FROM variant v
INNER JOIN color c ON v.color_id = c.id
WHERE c.code = ? 
  AND v.size = ? 
  AND v.product_id = ?;
`;

const queryVariantId = async (colorCode, size, productId) => {
  const [rows] = await db.execute(searchVariantSql, [colorCode, size, productId]);
  if (rows.length !== 1)
    throw new Error('No matching variant found for item: ', item.name);
  return rows[0].variant_id;
}


const checkInventoryAvailability = async (itemsList) => {
  try {
    const variantIds = itemsList.map(item => item.variantId);

    const [variantInventories] = await db.query(
      'SELECT id, stock FROM variant WHERE id IN (?)',
      [variantIds]
    );

    return new Map(variantInventories.map(variant => [variant.id, variant.stock]));;

  } catch (err) {
    throw new Error('Error updating inventory: ' + err.message);
  }
}

const updateInventory = async (itemsList) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const updateQuery = `UPDATE variant SET stock = stock - ? WHERE id = ?`;
    const updateInventoryPromises = itemsList.map(async (item) => {
      try {
        return await connection.execute(updateQuery, [item.qty, item.variantId]);
      } catch (error) {
        throw new Error(`Errorx updating inventory for item: ${item.id}: ${error.message}`);
      }
    });

    await Promise.all(updateInventoryPromises);
    await connection.commit();
    return true;
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.log(err)
    throw new Error('Error updating inventory: ' + err.message);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}


exports.queryAllProducts = queryAllProducts
exports.queryProductsByCategory = queryProductsByCategory
exports.queryProductsByKeyword = queryProductsByKeyword
exports.queryProductById = queryProductById
exports.queryTotalPageNumber = queryTotalPageNumber
exports.insertOrderAndItems = insertOrderAndItems
exports.queryVariantId = queryVariantId
exports.checkInventoryAvailability = checkInventoryAvailability
exports.updateInventory = updateInventory


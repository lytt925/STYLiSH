
const Products = require('../services/ProductsTable.js');

const getProductsAll = async (req, res) => {
  const pageNumber = parseInt(req.query.paging) || 0;
  try {
    const result = await Products.queryAllProducts(pageNumber);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getProductsForWomen = async (req, res) => {
  const pageNumber = parseInt(req.query.paging) || 0;
  try {
    const result = await Products.queryProductsByCategory("women", pageNumber);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getProductsForMen = async (req, res) => {
  const pageNumber = parseInt(req.query.paging) || 0;
  try {
    const result = await Products.queryProductsByCategory("men", pageNumber);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
const getProductsForAccessories = async (req, res) => {
  const pageNumber = parseInt(req.query.paging) || 0;
  try {
    const result = await Products.queryProductsByCategory("accessories", pageNumber);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

const searchProductByKeyword = async (req, res) => {
  const pageNumber = parseInt(req.query.paging) || 0;
  const keyword = req.query.keyword;
  try {
    const result = await Products.queryProductsByKeyword(keyword, pageNumber);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

const getProductDetail = async (req, res) => {
  const id = req.query.id;
  const result = await Products.queryProductById(id)
  if (result) {
    const resBody = {
      data: result
    }
    res.status(200).json(resBody);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
}

const createProduct = async (req, res) => {
  try {
    if (!req.files.main_image) {
      return res.status(400).json({ error: "Main image is required" });
    }
    await Products.insertOrderAndItems(req.body.productInfo, req.files.main_image, req.files.images);
    res.status(200).json({ message: "Product created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

exports.getProductsAll = getProductsAll;
exports.getProductsForWomen = getProductsForWomen;
exports.getProductsForMen = getProductsForMen;
exports.getProductsForAccessories = getProductsForAccessories;
exports.searchProductByKeyword = searchProductByKeyword;
exports.getProductDetail = getProductDetail;
exports.createProduct = createProduct;


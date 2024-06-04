const db = require('../models/db')
const Prodocts = require('./ProductsTable')

// to record a order information into the orders table.
const insertOrderInfo = async (connection, orderInfo) => {
  const insertOrderSql = `
    INSERT INTO orders (
        user_id, 
        shipping, 
        payment, 
        subtotal, 
        freight, 
        total, 
        recipient_name, 
        recipient_phone, 
        recipient_email, 
        recipient_address, 
        recipient_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
  const [result] = await connection.execute(insertOrderSql, orderInfo);
  return result.insertId;
}

// to record the order items in an order
const insertOrderItems = async (connection, itemsList, orderId) => {
  const insertSql = `INSERT INTO order_items (order_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?)`;

  // Create an array of promises for inserting order items
  const orderItemPromises = itemsList.map(async (item) => {
    const { id: productId, variantId, qty } = item;
    try {
      return connection.execute(insertSql, [orderId, productId, variantId, qty]);
    } catch (error) {
      console.log(error)
      throw new Error(`Error inserting item: ${item.name}: ${error.message}`);
    }
  });

  try {
    return Promise.all(orderItemPromises);
  } catch (err) {
    throw err;
  }
}


const insertOrderInfoAndItems = async (orderInfo, itemsList) => {
  try {
    let connection = await db.getConnection();
    await connection.beginTransaction();
    const orderId = await insertOrderInfo(connection, orderInfo)
    await insertOrderItems(connection, itemsList, orderId);
    await connection.commit();
    console.log("commit successfully")
    return orderId;
  } catch (error) {
    if (connection) {
      await connection.rollback(); // Rollback the transaction if an error occurs
    }
    console.log(error)
    return false;
  } finally {
    if (connection) {
      connection.release(); // Release the connection when done
    }
  }
}

const updateOrderPaid = async (orderId) => {
  try {
    const updatePaidSql = `UPDATE orders SET is_paid = 1 WHERE id = ?`
    const [rows] = await db.execute(updatePaidSql, [orderId])
    return true
  } catch (error) {
    console.log(error)
    throw new Error(`Error updating order paid: ${error.message}`);
  }
}

exports.insertOrderInfoAndItems = insertOrderInfoAndItems
exports.updateOrderPaid = updateOrderPaid

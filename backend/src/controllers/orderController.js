const Orders = require('../services/OrdersTable.js')
const Prodocts = require('../services/ProductsTable.js')
const TayPay = require('../services/TapPay.js')

const checkoutOrder = async (req, res) => {
  try {
    const userId = req.tokenPayload.id // from jwtAuthentication middleware
    const reqOrder = req.body.order
    const orderInfo = [
      userId, reqOrder.shipping, reqOrder.payment,
      reqOrder.subtotal, reqOrder.freight, reqOrder.total,
      reqOrder.recipient.name,
      reqOrder.recipient.phone,
      reqOrder.recipient.email,
      reqOrder.recipient.address,
      reqOrder.recipient.time
    ]
    const orderItemList = reqOrder.list
    for (const item of orderItemList) {
      const { id: productId, color: { code: colorCode }, size } = item;
      item.variantId = await Prodocts.queryVariantId(colorCode, size, productId);
    }

    const stockMap = await Prodocts.checkInventoryAvailability(orderItemList)
    orderItemList.forEach(item => (
      item.stock = stockMap.get(item.variantId),
      item.availability = item.qty <= stockMap.get(item.variantId)
    ));

    const notAvailableItems = orderItemList.filter(item => !item.availability);
    if (notAvailableItems.length > 0) {
      return res.status(400).send({ message: "Some items are not available", data: notAvailableItems })
    }

    const orderId = await Orders.insertOrderInfoAndItems(orderInfo, orderItemList)
    if (!orderId) {
      throw new Error("Transaction Failed")
    }

    const tapPayResp = await TayPay.payByPrime(req.body)
    if (tapPayResp.status === 0) {

      await Orders.updateOrderPaid(orderId)
      await Prodocts.updateInventory(orderItemList)
      return res.status(200).json({ data: { number: orderId } })

    } else {
      return res.status(400).json({ error: "Failed to pay" })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

exports.checkoutOrder = checkoutOrder

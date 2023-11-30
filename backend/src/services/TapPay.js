const axios = require('axios')
const db = require('../models/db')


async function payByPrime(reqBody) {
  // this should send to TapPay server
  const partner_key = process.env.PARTNER_KEY
  const merchant_id = process.env.MERCHANT_ID
  const prime = reqBody.prime
  const amount = reqBody.order.total
  const cardholder = {
    name: reqBody.order.recipient.name,
    phone_number: reqBody.order.recipient.phone,
    email: reqBody.order.recipient.email,
    address: reqBody.order.recipient.address
  }
  const details = `${reqBody.order.shipping}_${reqBody.order.payment}_${reqBody.order.recipient.email}`
  const requestData = {
    partner_key,
    prime,
    amount,
    merchant_id,
    details,
    cardholder
  };

  const apiUrl = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime";
  const headers = {
    "content-type": "application/json",
    "x-api-key": partner_key,
  };
  const { data } = await axios.post(apiUrl, requestData, { headers })
  // console.log("payByPrime response: ", data)
  return data
}

exports.payByPrime = payByPrime
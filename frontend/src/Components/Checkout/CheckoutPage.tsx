import { useState } from "react"
import styled from "styled-components"
import CartItemList from "./CartItemList/CartItemList"
import { OrderInfo } from "./OrderInfo"
import { CheckoutInfo } from "./CheckoutInfo"

const CheckoutPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 1160px);
  margin: 24px 0;
  padding: 0 24px;
  font-size: 16px;
  @media (max-width: 960px){
    font-size: 14px;
  }
`

const CheckoutPage = () => {
  const [errors, setErrors] = useState([true, true, true, true, true])
  const [recipientData, setRecipientData] = useState({
    "name": null,
    "phone": null,
    "email": null,
    "address": null,
    "time": null,
  })


  return (
    <CheckoutPageWrapper>
      <CartItemList />
      <OrderInfo recipientData={recipientData} setRecipientData={setRecipientData} errors={errors} setErrors={setErrors} />
      <CheckoutInfo recipientData={recipientData} errors={errors} />
    </CheckoutPageWrapper >
  )
}

export default CheckoutPage
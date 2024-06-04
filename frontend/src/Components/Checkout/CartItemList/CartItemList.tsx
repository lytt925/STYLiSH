import { useState } from 'react'
import styled from 'styled-components'
import DropdownMenu from "./Dropdown"
import { useShoppingCart } from "../../../Hooks/useShoppingCart"
import RemoveButtonImg from "../../../assets/img/cart-remove.png"
import RemoveButtonHover from "../../../assets/img/cart-remove-hover.png"

const ShoppingCartWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 40px 30px;
    gap: 30px;
    border: 1px solid rgba(151, 151, 151, 1);
    margin-bottom: 50px;
    @media (max-width: 960px) {
        padding: 20px 0px;
        border-right: none;
        border-left: none;
    }
`

const CartItemWrapper = styled.div`
  display: flex;
  @media (max-width: 960px) {
    flex-direction: column;
    gap: 20px;
  }
`
const CartItemInfo = styled.div`
 display: flex;
 flex: 1;
 position: relative;
`

const CartItemImage = styled.img`
 max-width: 114px;
`

const CartItemDetail = styled.div`
  font-size: 1em;
  white-space: pre-wrap;
  margin-left: 1em;
`

const Title = styled.div`
  position: absolute;
  top: -80px;
  @media (max-width: 960px) {
    position: static;
    margin-bottom: 1.25em;
  }
`
const CheckoutInfo = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  margin: 0 1em;
`

const DescriptionTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  position: relative;
  @media (max-width: 960px) {
    flex-direction: column;
    min-width: 0;
  }
`

const RemoveButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  @media (max-width: 960px) {
    display: none;
  }
`

const FloatRemoveButtonWrapper = styled.div`
  display: none;
  @media (max-width: 960px) {
    display: block;
    position: absolute;
    right: 0;
  }
`

const ShoppingCartTitle = styled.div`
  width: 100%;
  font-size: 16px;
  margin-bottom: 16px;
  font-weight: 700;
  @media (max-width: 960px) {
    margin-bottom: 10px;
  }
`


const CartItemList = () => {
  const { cartItems, addItemToCart, removeItemFromCart } = useShoppingCart();
  const [isRemoveButtonHovered, setIsRemoveButtonHovered] = useState(false);



  const RemoveButton = (id: number) => (
    <button
      onClick={() => removeItemFromCart(id)}
      onMouseEnter={() => setIsRemoveButtonHovered(true)}
      onMouseLeave={() => setIsRemoveButtonHovered(false)}
      type="button" // Set type to "button" to prevent form submission
      aria-label="Remove item from cart" // Add an aria-label for screen readers
      style={{ cursor: 'pointer' }}
    >
      <img src={isRemoveButtonHovered ? RemoveButtonHover : RemoveButtonImg} alt="removeItemFromCart" />
    </button>
  )

  return (
    <>
      <ShoppingCartTitle>
        購物車
      </ShoppingCartTitle>
      <ShoppingCartWrapper>
        {cartItems.map((item, idx) => (
          <CartItemWrapper key={`${item.id}_${item.color.code}_${item.size}`}>
            <CartItemInfo>
              <CartItemImage src={require('./dress.png')} alt={item.title} />
              <CartItemDetail>
                <p style={{ marginBottom: '1.125em', lineHeight: '1.1875em' }}>{item.title}</p>
                <p style={{ marginBottom: '1.375em', lineHeight: '1.1875em' }}>{item.id}</p>
                {
                  [{ key: '顏色', value: item.color.name }, { key: '尺寸', value: item.size }].map((detail) => (
                    <div key={detail.key} style={{ display: 'flex', marginBottom: '0.625em', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', borderRight: '1px solid black', paddingRight: '6px', height: '1em' }}>
                        <p style={{ lineHeight: '1.1875em' }}>{detail.key}</p>
                      </div>
                      <p style={{ paddingLeft: '6px', lineHeight: '1.1875em' }}>{detail.value}</p>
                    </div>
                  ))
                }
              </CartItemDetail>
              <FloatRemoveButtonWrapper>
                {RemoveButton(item.id)}
              </FloatRemoveButtonWrapper>
            </CartItemInfo>
            <CheckoutInfo>
              <DropdownMenu idx={idx} selectedVariant={item} addItemToCart={addItemToCart} />
              <DescriptionTag>
                {idx === 0 ? <Title>單價</Title> : null}
                <p>TWD.{Math.round(item.price)}</p>
              </DescriptionTag>
              <DescriptionTag>
                {idx === 0 ? <Title>小計</Title> : null}
                <p>TWD.{Math.round(item.price * item.quantity)}</p>
              </DescriptionTag>
              <RemoveButtonWrapper>
                {RemoveButton(item.id)}
              </RemoveButtonWrapper>
            </CheckoutInfo>
          </CartItemWrapper>
        ))}
      </ShoppingCartWrapper>
    </>
  )
}

export default CartItemList
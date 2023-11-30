import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CartImage from '../../../assets/img/cart.png';
import CartImageHover from '../../../assets/img/cart-hover.png';
import { useShoppingCart } from '../../../Hooks/useShoppingCart';

const CartWrapper = styled.div`
position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  height: 44px;
  width: 44px;
`

const CartCount = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  background-color: rgba(139, 87, 42, 1);
  color: white;
  border-radius: 50%;
  text-align: center;
`

const CartXl = () => {
  const [isCartHovered, setIsCartHovered] = useState(false);
  const { cartItems } = useShoppingCart();
  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate('/checkout');
  }

  return (
    <CartWrapper onMouseEnter={() => setIsCartHovered(true)} onMouseLeave={() => setIsCartHovered(false)} onClick={handleCheckout}>
      <img src={isCartHovered ? CartImageHover : CartImage} alt="Cart" className="h-11 w-11 hover:cursor-pointer" />
      {cartItems.length ? <CartCount><p>{cartItems.length}</p></CartCount> : null}
    </CartWrapper>
  )
}

export default CartXl
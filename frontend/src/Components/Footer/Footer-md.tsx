import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import socialMediaImages from './img';
import CartImage from '../../assets/img/cart-mobile.png';
import memberImage from '../../assets/img/member-mobile.png';
import { useShoppingCart } from '../../Hooks/useShoppingCart';

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #313538;
  color: white;
`

const FooterBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  height: 146px;
  margin-bottom: 60px;
  width: 100%;
  @media (min-width: 1280px) {
    display: none;
  }
  `
const ActionBlock = styled.div`
  background-color: #313538;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  width: 100%;
  @media (min-width: 1280px) {
    display: none;
  }
  `

const ActionButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 24px;
  cursor: pointer;
`

const LinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 75%;
  width: 42%;
  flex-wrap: wrap;
  padding-top: 16px;
  align-items: space-between;
  align-content: space-evenly;
  @media (max-width: 480px) {
    width: 55%;
  }
`

const CopyRight = styled.div`
  text-align: center;
  font-size: 12px;
  color: #828282;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
`

const SocialMediaWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 30%;
`
const SocialMediaIcon = styled.div`
  width: 10%;
  min-width: 22px;
`

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


const Footer = ({ footerLinks }: { footerLinks: string[] }) => {
  const { cartItems } = useShoppingCart();
  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate('/checkout');
  }

  return (
    <FooterWrapper>
      <FooterBlock>
        <LinkWrapper>
          {footerLinks.map((link) => <div key={link} style={{ padding: '3px 0' }}>{link}</div>)}
        </LinkWrapper>
        <SocialMediaWrapper>
          {
            socialMediaImages.map((image, index) => (
              <SocialMediaIcon key={index} >
                <img src={image} alt="Cart" />
              </SocialMediaIcon>
            ))
          }
        </SocialMediaWrapper>
        <CopyRight><p>© 2018 All Rights Reserved.</p></CopyRight>
      </FooterBlock>
      <ActionBlock>
        <ActionButton style={{ borderRight: '1px solid rgb(128,128,128)' }}>
          <CartWrapper onClick={handleCheckout}>
            <img src={CartImage} alt="cart"></img>
            {cartItems.length ? <CartCount><p>{cartItems.length}</p></CartCount> : null}
          </CartWrapper>
          <p>購物車</p>
        </ActionButton>
        <ActionButton>
          <img src={memberImage} alt="member"></img>
          <p>會員</p>
        </ActionButton>
      </ActionBlock>
    </FooterWrapper >
  )
}

export default Footer

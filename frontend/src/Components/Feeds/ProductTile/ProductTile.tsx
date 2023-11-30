import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { type Product as TProduct } from '../../../types/product.type'

const ProductWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;
  flex-basis: 33%;
  max-width: 400px;
  min-width: 153px;
  padding: 1.2% 0.8%;
  font-size: 20px; 
  @media (max-width: 768px) {
    font-size: 12px;
  }
`

const MainImg = styled.img`
  width: 100%;
  height: auto;
  cursor: pointer;
`

const ColorOptionWrapper = styled.div`
  display: flex;
`

interface ColorProps {
  $colorCode: string;
}


const Color = styled.div<ColorProps>`
  width: 1.2em;
  height: 1.2em;
  border: 1px solid #D3D3D3;
  background-color: #${props => props.$colorCode};
  margin-right: 0.5em;
  margin-top: 1em;
`

const ProductTitle = styled.div`
  margin-top: 1em;
  font-size: 1em;
  line-height: 1.2em;
  letter-spacing: 0.2em;
  color: rgba(63, 58, 58, 1);
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

const ProductPrice = styled.div`
  margin-top: 0.5em;
  font-size: 1em;
  line-height: 1.2em;
  letter-spacing: 0.2em;
  color: rgba(63, 58, 58, 1);
`
type ProductProps = TProduct & {
  fetchDate: number;
}

const ProductTile = (props: ProductProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/product/${props.id}`, { state: { ...props } })
  }

  return (
    <ProductWrapper>
      <MainImg
        // src={props.main_image ? props.main_image : require('./dress.png')}
        src={require('./dress.png')}
        alt={props.title}
        onClick={handleClick} />
      <ColorOptionWrapper>
        {props.colors.map((color: { code: string }) => <Color key={color.code} $colorCode={color.code} />)}
      </ColorOptionWrapper>
      <ProductTitle onClick={handleClick}>{props.title}</ProductTitle>
      <ProductPrice>TWD.{Math.round(props.price)}</ProductPrice>
    </ProductWrapper>

  )
}

export default ProductTile
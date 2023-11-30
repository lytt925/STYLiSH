import { useState } from 'react';
import styled from "styled-components"
import { type Product as TProduct } from "@/types/product.type"
import { ProductSku } from "./ProductSku"
import { useShoppingCart } from "../../Hooks/useShoppingCart"
import CartItem from '../../types/cartItem.type';

const ProductInfoBlock = styled.div`
    color: rgba(63, 58, 58, 1);
    width: 37.5%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    font-size: 16px;
    margin-top: 3.3%;
    
    
    @media (max-width: 960px) {
      font-size: 12px;    
    }
    @media (max-width: 768px) {
      width: 100%;
    }
    @media (max-width: 480px) {
      width: 90%;
      margin: 3%;
    }

`
const ProductTitleBlock = styled.div`

  border-bottom: 1px solid rgba(63, 58, 58, 1);
`

const ProductTitle = styled.div`
  font-size: 2em;
  line-height: 1.1875em;
  letter-spacing: 0.2em;
  color: rgba(63, 58, 58, 1);
  padding-bottom: 0.5em;
`

const ProductID = styled.div`
  color: rgba(186, 186, 186, 1);
  font-size: 1.25em;
  line-height: 1.2em;
  letter-spacing: 0.2em;
  padding-bottom: 2.5em;
`
const ProductPrice = styled.div`
  font-size: 1.875em;
  line-height: 1.2em;
  padding-bottom: 0.6666em;
`

const ShoppingCartButton = styled.div`
  position: relative;
  width: 100%;
  height: 4em;
  background: rgba(0,0,0, 1);
  color: rgba(255, 255, 255, 1);
  margin-bottom: 2.5em;
  cursor: pointer;
`
const ShoppingCartButtonInner = styled.p`
  text-align: center;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);

  font-size: 1.25em;
  line-height: 1.5em;
  letter-spacing: 0.2em;
`

const ProductDetailBlock = styled.div`
  font-size: 1.25em;
  white-space: pre-wrap;
  flex: 1;
`

const sizeOrder = ['XS', 'S', 'M', 'L', 'XL'];

export const ProductInfo = ({ productData }: { productData: TProduct }) => {
  const { addItemToCart } = useShoppingCart();
  const [selectedColor, setSelectedColor] = useState<string>(productData.colors[0].code)
  const variantsByColor = productData.variants.filter((variant) => variant.color_code === selectedColor);
  variantsByColor.sort((a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size));
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1)

  const selectedVariant = variantsByColor.find((variant) => variant.size === selectedSize);
  // If the selected size is out of stock, select the first available size
  if (selectedSize !== '' && (!selectedVariant || selectedVariant?.stock <= 0)) {
    setSelectedSize('');
  }

  const isAnyAvailable = variantsByColor.some((variant) => variant.stock > 0);



  const handleAddToCart = () => {
    if (selectedVariant === undefined) return;
    addItemToCart({
      id: productData.id,
      title: productData.title,
      main_image: productData.main_image,
      price: productData.price,
      color: {
        code: selectedColor,
        name: productData.colors.find((color) => color.code === selectedColor)?.name || ""
      },
      size: selectedSize,
      quantity: selectedQuantity,
      maxQty: selectedVariant.stock,
    });
    console.log({
      id: productData.id,
      title: productData.title,
      main_image: productData.main_image,
      price: productData.price,
      color: {
        code: selectedColor,
        name: productData.colors.find((color) => color.code === selectedColor)?.name || ""
      },
      size: selectedSize,
      quantity: selectedQuantity,
      maxQty: selectedVariant.stock,
    })
  }

  return (
    <ProductInfoBlock>
      <ProductTitleBlock>
        <ProductTitle>{productData.title}</ProductTitle>
        <ProductID>{productData.id}</ProductID>
        <ProductPrice>TWD. {Math.round(productData.price)}</ProductPrice>
      </ProductTitleBlock>
      <ProductSku
        key={selectedColor}
        colors={productData.colors}
        variantsByColor={variantsByColor}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedQuantity={selectedQuantity}
        setSelectedQuantity={setSelectedQuantity}
        selectedVariant={selectedVariant}
      />
      <ShoppingCartButton onClick={handleAddToCart}>
        <ShoppingCartButtonInner>
          {
            isAnyAvailable ?
              (selectedVariant && selectedVariant?.stock > 0 ? '加入購物車' : '請選擇尺寸') :
              '此產品已無庫存'
          }
        </ShoppingCartButtonInner>
      </ShoppingCartButton>
      <ProductDetailBlock>
        {productData.note}
        <br />
        <br />
        {productData.texture}
        <br />
        {productData.description}
        <br />
        <br />
        清洗：{productData.wash}
        <br />
        產地：{productData.place}
      </ProductDetailBlock>
    </ProductInfoBlock>
  )
}

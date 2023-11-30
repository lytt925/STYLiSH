import styled from 'styled-components'
import Loading from "../../assets/img/loading.gif"
import { ProductInfo } from './ProductInfo'
import ProductStory from './ProductStory'
import { useProduct } from '../../Hooks/useProduct'


const ProductPageWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  width: 90%;
  max-width: 960px;
  gap: 4.16666%;
  margin: min(5%, 65px) 5% 0 5%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: 480px) {
    width: 100%;
    flex-direction: column;
    margin: 0;
  }
`

const ProductImg = styled.img`
  width: 58.33333%;
  max-width: 560px;
  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`

const ProductPage = () => {
  const { productData, isLoading, isError } = useProduct()

  if (isLoading) {
    return (
      <img src={Loading} alt="Loading" className="mt-10 h-14 w-14" />
    )
  }

  if (isError) {
    return (
      <div>Product Not Found</div>
    )
  }

  if (productData && productData.id) {
    return (
      <>
        <ProductPageWrapper>
          <ProductImg
            // src={props.main_image ? props.main_image : require('./dress.png')}
            src={require('./dress.png')}
            alt={productData.title}
          />
          <ProductInfo productData={productData} />
        </ProductPageWrapper>
        <ProductStory
          story={productData.story}
          images={productData.images}
        />
      </>
    );
  }

  return <div>No product data available.</div>;
};
export default ProductPage
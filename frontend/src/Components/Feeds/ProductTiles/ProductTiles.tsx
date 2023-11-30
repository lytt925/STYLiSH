import styled from "styled-components";
import { ProductTile } from "../ProductTile"
import { type Product as TProduct } from "@/types/product.type";

const PhantomProduct = styled.div`
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

type ProductProps = {
    feeds: TProduct[];
    screenWidth: number;
    dataUpdatedAt: number;
}

const ProductTiles = ({ feeds, screenWidth, dataUpdatedAt }: ProductProps) => {
    const totalProducts = feeds?.length;
    const colNum = (screenWidth >= 548 ? 3 : 2);
    const placeholderCount = colNum - totalProducts % colNum;

    return (
        feeds.length === 0 ?
            <div>
                Nothing Found!
            </div> :
            <>
                {feeds.map((feed: TProduct) => <ProductTile key={feed.id} {...feed} fetchDate={dataUpdatedAt} />)}
                {(feeds && placeholderCount < colNum) && [...Array(placeholderCount)].map((_, index) =>
                    <PhantomProduct key={index} />
                )}
            </>
    )
}

export default ProductTiles

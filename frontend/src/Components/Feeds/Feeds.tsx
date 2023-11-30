import { useState, useEffect } from 'react'
import { useOutletContext, useParams } from 'react-router-dom';
import styled from 'styled-components'
import { useInView } from 'react-intersection-observer'
import ProductTiles from './ProductTiles/ProductTiles'
import Loading from '../../assets/img/loading.gif'
import Carousel from '../Carousel/Carousel'
import { type Product as TProduct } from '@/types/product.type';
import { useFeeds } from '../../Hooks/useFeeds';

const FeedsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const FeedsDiv = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  flex-wrap: wrap;
  max-width: 1280px;
  margin: 3% 3%;
  padding: 0 4%;
  min-height: 100vh;
  align-content: flex-start;
  @media (max-width: 768px) {
    padding: 0 2%;
  }
`

const Feeds = () => {
  const [feeds, setFeeds] = useState<TProduct[]>([]);
  const { screenWidth }: { screenWidth: number } = useOutletContext();
  const { ref, inView } = useInView()
  let { category } = useParams()

  const {
    status,
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    dataUpdatedAt,
  } = useFeeds(category);


  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);


  useEffect(() => {
    if (data?.pages) {
      const aggregatedData: any[] = data.pages.flatMap(page => page.data);
      setFeeds(aggregatedData);
    }
  }, [data]);


  const renderContent = () => {
    switch (status) {
      case 'pending':
        return <img src={Loading} alt="Loading" className="mt-10 h-14 w-14" />;
      case 'error':
        return <div>Error</div>;
      default:
        return ProductTiles({ feeds, screenWidth, dataUpdatedAt });
    }
  };

  return (
    <>
      <Carousel screenWidth={screenWidth} />
      <FeedsWrapper className='feeds-wrapper'>
        <FeedsDiv className='feeds-div'>
          {renderContent()}
          <div ref={ref} />
          {isFetchingNextPage && <img src={Loading} alt="Loading" className="mt-10 h-14 w-14" />}
        </FeedsDiv>
      </FeedsWrapper>
    </>
  )
}

export default Feeds
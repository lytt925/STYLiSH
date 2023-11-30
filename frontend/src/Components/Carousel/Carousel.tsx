import { useState, useEffect, useRef } from 'react';
import imgs from './img';
import styled from 'styled-components';
import Dots from './Dots';



interface CarouselWrapperProps {
  $margintop?: number;
  $height?: number;
}

const CarouselWrapper = styled.div.attrs<CarouselWrapperProps>(props => ({
  style: {
    marginTop: props.$margintop,
    height: props.$height,
  },
}))`
  width: 100%;
  position: relative;
`


const FadeImg = styled.img.attrs(props => ({
  style: {
    height: props.height,
  },
}))`
  opacity: 0;
  transition: opacity .5s ease-in-out;
  position: absolute;
  width: 100%;
  &.active {
    opacity: 1;
  }
`

const Carousel = ({ screenWidth }: { screenWidth: number }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const intervalRef = useRef<number | NodeJS.Timeout>();

  // Determine margin-top based on screen width
  // const marginTop = screenWidth >= 1280 ? 140 : 102;
  const imageHeight = screenWidth > 960 ? (screenWidth / 1920) * 500 : (screenWidth / 480) * 185;

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      // 每3秒用setCurrentImage改變state來換圖
      setCurrentImage((currentImage) =>
        currentImage === imgs.length - 1 ? 0 : currentImage + 1
      );
    }, 3000);
  };

  useEffect(() => {
    // console.log('start interval', currentImage);
    startInterval(); // When the component mounts, it will run the code inside the useEffect callback function once.
    return () => {
      if (intervalRef.current) {
        // 會在unmount時清除 interval
        // console.log('clear interval', currentImage); // 舊照片
        clearInterval(intervalRef.current); // executed when the component unmounts or when the dependencies change and the effect needs to be re-run.
      }
      // the cleanup function logs the old value of currentImage because it captures the state 
      // from the previous render's closure. It does not have access to the updated state from the current render.
    };
  }, [currentImage]); // allows you to clear and restart the interval timer when currentImage changes.

  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    startInterval();
  };


  return (
    <CarouselWrapper className='carousel-wrapper' $height={imageHeight}>
      {imgs.map((src, index) => (
        <FadeImg
          key={src}
          src={src}
          alt={`Slide ${index}`}
          height={imageHeight}
          className={`${index === currentImage ? 'active' : ''}`}
        />
      ))}
      <Dots
        images={imgs} currentImage={currentImage} setCurrentImage={setCurrentImage}
        handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave}
      />
    </CarouselWrapper>
  );
};

export default Carousel;


import styled from 'styled-components';

const DotsDiv = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 6.8%;
  width: 100%;
`;


interface DotProps {
  isactive: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const Dot = styled(({ isactive, ...rest }: DotProps) => <div {...rest} />)`
  background-color: ${props => props.isactive ? '#8B572A' : 'rgba(255, 255, 255, 0.4)'};
  cursor: pointer;
  height: 10px;
  width: 10px;
  margin: 0 5px;
  border-radius: 50%;
  display: inline-block;

  &:hover {
    background-color: #717171;
  }
`;


interface DotsProps {
  images: string[];
  currentImage: number;
  setCurrentImage: (index: number) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}


const Dots = ({ images, currentImage, setCurrentImage, handleMouseEnter, handleMouseLeave }: DotsProps) => {
  return (
    <DotsDiv>
      {images.map((_: any, index: number) => (
        <Dot
          key={index}
          isactive={(index === currentImage)}
          onClick={() => setCurrentImage(index)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </DotsDiv>
  )
}

export default Dots
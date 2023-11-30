import styled from "styled-components"
import image0 from "./0.png"
import image1 from "./1.png"
const fakeImages = [image0, image1]

const ProductStoryBlock = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    width: 90%;
    max-width: 960px;
    gap: 4.16666%;
    margin: 3.3% 5%;
    font-size: 16px;

    @media (max-width: 768px) {
        flex-direction: column;
    }

    @media (max-width: 480px) {
      margin: 3%;
      font-size: 12px;
    }
`

const StoryTitle = styled.span`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between; 
  align-items: center; 
  color: rgba(139, 87, 42, 1);
  height: 2em;  
  margin-bottom: 1.75em;
  font-size: 1.25em;
  line-height: 1.5em;
  letter-spacing: 0.15em;

  &::after {
    content: ''; 
    flex-grow: 1; 
    margin-left: 3.2em;
    height: 1px; 
    background-color: rgba(63, 58, 58, 1); 
    align-self: center; 
  }
`;


const Story = styled.div`
    white-space: pre-wrap;
    font-size: 1.25em;
    line-height: 1.5em;
    color: rgba(63, 58, 58, 1);
    padding-bottom: 1.5em;
`

const StoryImage = styled.img`
    width: 100%;
    margin-bottom: 1.5em;
`

type ProductStoryProps = {
    story: string;
    images: ReadonlyArray<string> | null;
}

const ProductStory = ({ story, images }: ProductStoryProps) => {
    return (
        <ProductStoryBlock>
            <StoryTitle>
                更多產品資訊
            </StoryTitle>
            <Story>
                {story}
            </Story>
            {images && images.map((image, index) => (
                <StoryImage key={index} src={fakeImages[Math.round(Math.random())]} />
            ))}
        </ProductStoryBlock>
    )
}

export default ProductStory
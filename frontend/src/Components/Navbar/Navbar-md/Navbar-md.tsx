import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SearchImage from '../../../assets/img/search.png';
import LogoImage from '../../../assets/img/logo.png';
import { type Category } from '../../../types/category.type'

const NavbarWrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 102px;
  width: 100%;
  top: 0px;
  z-index: 10;
  font-family: 'Noto Sans TC', sans-serif;
  @media (min-width: 1280px) {
    display: none;
  }
`
const NavbarPlaceHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 102px;
  width: 100%;
  top: 0px;
  z-index: 10;
  font-family: 'Noto Sans TC', sans-serif;
  @media (min-width: 1280px) {
    display: none;
  }
`

const Title = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  height: 52px;
  width: 100%;
  background-color: white;
`

const Tab = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;
  background-color: rgba(49, 53, 56, 1);
  cursor: pointer;
`

const Logo = styled.img`
  height: 24px;
`

const Search = styled.img`
  height: 40px;
  width: 40px;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
`


interface CategoryProps {
  $length: number;
}



const CategoryBlock = styled.div<CategoryProps>`
  width: ${props => 100 / props.$length}%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
`;


const handleSearch = () => {
  console.log('search')
}



const Navbar = ({ categoryList }: { categoryList: ReadonlyArray<Category> }) => {
  const [isCategoryHovered, setIsCategoryHovered] = useState(Array(categoryList.length).fill(false));
  const navigate = useNavigate();

  return (
    <>
      <NavbarPlaceHolder />
      <NavbarWrapper>
        <Title>
          <div>
            <Logo src={LogoImage} alt="STYLISH Logo" onClick={() => navigate('/')} />
          </div>
          <Search src={SearchImage} alt="Search" onClick={handleSearch} />
        </Title>
        <Tab>
          {
            categoryList.map((category, index) => {
              const isLastItem = index === categoryList.length - 1;
              const borderStyle = isLastItem ? {} : { borderRight: '1px solid rgba(128, 128, 128, 1)' };
              return (
                <CategoryBlock
                  key={category.name}
                  $length={categoryList.length}
                  onMouseEnter={() => {
                    setIsCategoryHovered((prev) => { prev[index] = true; return [...prev] })
                  }}
                  onMouseLeave={() => {
                    setIsCategoryHovered((prev) => { prev[index] = false; return [...prev] })
                  }}
                  style={borderStyle}
                  onClick={() => navigate(`/products/${category.name}`)}
                >
                  <Link to={`/products/${category.name}`} style={{ lineHeight: '16px', color: isCategoryHovered[index] ? 'white' : 'rgba(130, 130, 130, 1)' }}>
                    {category.showName}
                  </Link>
                </CategoryBlock>
              )
            })
          }
        </Tab>
      </NavbarWrapper>
    </>
  )
}

export default Navbar
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import LogoImage from '../../../assets/img/logo.png';
import SearchInput from './SearchInput';
import CartXl from './Cart-xl';
import MemberXl from './Member-xl';
import { type Category } from '../../../types/category.type';

const Navbar = ({ categoryList }: { categoryList: ReadonlyArray<Category> }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="hidden xl:flex top-0 z-20 px-14 py-4 h-[140px] justify-between items-center xl:bg-white " style={{ width: '100%' }}>
      </div>
      <div className="hidden xl:flex xl:fixed top-0 z-20 px-14 py-4 h-[140px] justify-between items-center xl:bg-white " style={{ width: '100%', borderBottom: '40px solid black' }}>
        <div className="flex w-5/6 max-w-[826px]">
          <img src={LogoImage} alt="STYLISH Logo" className="h-12 mr-[57px] cursor-pointer" onClick={() => navigate('/')} />
          <div className="flex w-[55%] items-end p-1">
            {categoryList.map((category, index) => {
              const isLastItem = index === categoryList.length - 1;
              const borderClass = isLastItem ? '' : 'border-r-[1px]';
              return (
                <div
                  onClick={() => navigate(`/products/${category.name}`)}
                  key={category.name}
                  className={`w-1/3 h-5 flex justify-center text-center ${borderClass} border-black border-solid`}>
                  <div className={`text-[#3F3A3A] text-[20px] leading-5 hover:text-[#8B572A] tracking-[30px] `} >
                    <Link to={`/products/${category.name}`} className={`w-[100%] pl-[30px] hover:no-underline`}>{category.showName}</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-end w-1/2  space-x-7">
          <SearchInput />
          <CartXl />
          <MemberXl />
        </div>
      </div >
    </>
  );
};
export default Navbar;

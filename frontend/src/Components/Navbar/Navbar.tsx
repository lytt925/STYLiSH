import NavXl from './Navbar-xl'
import NavMd from './Navbar-md'


const Navbar = () => {

  const categoryList = [
    { name: 'women', showName: '女裝' },
    { name: "men", showName: '男裝' },
    { name: 'accessories', showName: '配件' }
  ] as const;

  return (
    <>
      <NavXl categoryList={categoryList} />
      <NavMd categoryList={categoryList} />
    </>
  )
}

export default Navbar;
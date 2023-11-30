import { Outlet, ScrollRestoration } from "react-router-dom";
import styled from "styled-components";
import { useScreenWidth } from "./Hooks/useScreenWidth";
import { Footer } from "./Components/Footer";
import { Navbar } from "./Components/Navbar";
import { ShoppingCartProvider } from "./Hooks/useShoppingCart";


const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

export default function App() {
  const [screenWidth] = useScreenWidth();

  return (
    <ShoppingCartProvider>
      <Navbar />
      <PageWrapper className="page-wrapper">
        <Outlet context={{ screenWidth }} />
        <ScrollRestoration />
      </PageWrapper>
      <Footer />
    </ShoppingCartProvider>
  )
}

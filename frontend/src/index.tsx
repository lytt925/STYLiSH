import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './styles/index.css';
import App from './App';
import { Feeds } from './Components/Feeds';
import ErrorPage from './Components/ErrorPage';
import ProductDetail from './Components/ProductPage';
import { Checkout } from './Components/Checkout';
import SuccessCheckout from './Components/Checkout/SuccessCheckout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Feeds />,
      },
      {
        path: "/products/:category",
        element: <Feeds />,
      },
      {
        path: "/search",
        element: <Feeds />,
      },
      {
        path: "/product/:productId",
        element: <ProductDetail />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/checkout/pay",
        element: <SuccessCheckout />,
      }
    ],
  }
]);

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

reportWebVitals();

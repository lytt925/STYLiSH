import { useQuery } from '@tanstack/react-query'
import { useParams, useLocation } from 'react-router-dom'
import { type Product as TProduct } from '@/types/product.type'
import api from '../api'

const fetchProduct = async (id: string | undefined) => {
    // console.log('fetchProduct', id)
    const response = await api.get(`products/details?id=${id}`)
    return response.data.data
}

type TProductDetail = TProduct & {
    fetchDate: number;
}

export const useProduct = () => {
    const location = useLocation();
    const currentTime = new Date().getTime();
    const product = location.state; // Access the product data directly
    const { productId } = useParams();

    const { data, isLoading, isError }
        = useQuery({
            queryKey: ['product', productId],
            queryFn: () => fetchProduct(productId),
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            enabled: !product || (currentTime - product.fetchDate) > 3 * 60 * 1000
        })

    const productData: TProductDetail = data || product;
    return { productData, isLoading, isError }
}
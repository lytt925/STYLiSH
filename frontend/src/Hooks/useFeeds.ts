import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from "react-router-dom";
import axios from '../api';

const fetchProducts = async (query: any, category: any, paging: any) => {
    const actions = query ? 'search' : 'category'

    try {
        if (actions === 'category') {
            if (!category) category = 'all';
            const { data } = await axios.get(`/products/${category}`, { params: { paging } });
            return data;
        } else if (actions === 'search') {
            const keyword = query;
            const { data } = await axios.get(`/products/search?keyword=${keyword}`, { params: { paging } });
            return data; // Assuming this returns an object with 'data' and 'next_paging'
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Failed to fetch products:', error.message);
            throw new Error(error.message);
        } else {
            // Handle cases where error is not an Error instance
            console.error(error);
            throw new Error(error as string);
        }
    }
}

export const useFeeds = (category: string | undefined) => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q'); // Get the query parameter
    const {
        status,
        data,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        dataUpdatedAt
    } = useInfiniteQuery({
        queryKey: [category, query],
        queryFn: ({ pageParam }: { pageParam: number }) => fetchProducts(query, category, pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage: any) => lastPage?.next_paging ?? undefined,
    })


    return {
        status,
        data,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        dataUpdatedAt,
    }
}
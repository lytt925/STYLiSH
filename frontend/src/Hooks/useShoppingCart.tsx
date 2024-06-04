import React, { createContext, useState, useContext, useEffect } from 'react';
import CartItem from '../types/cartItem.type';
import api from '../api';


type ShoppingCartContextType = {
    cartItems: CartItem[];
    addItemToCart: (item: CartItem) => void;
    removeItemFromCart: (itemId: number) => void;
    clearCart: () => void;
};

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

const useShoppingCart = (): ShoppingCartContextType => {
    const context = useContext(ShoppingCartContext);
    if (context === undefined) {
        throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
    }
    return context;
};

const isItemInCart = (cartItems: CartItem[], itemToCheck: CartItem) => {
    return cartItems.some(item =>
        item.id === itemToCheck.id &&
        item.color.code === itemToCheck.color.code &&
        item.size === itemToCheck.size
    );
}

const fetchProduct = async (id: number | undefined) => {
    // console.log('fetchProduct', id)
    const response = await api.get(`products/details?id=${id}`)
    return response.data.data
}

const deleteSoldOutItems = (productPromise: any, tempCartItems: CartItem[], setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>) => {
    // 刪掉賣完的商品
    Promise.all(productPromise).then((products) => {
        const newCartItems = products.map((item: any, idx: number) => {
            const matchingVariant = item.variants.find((variant: any) =>
                variant.size === tempCartItems[idx].size &&
                variant.color_code === tempCartItems[idx].color.code
            );
            return {
                id: item.id,
                title: item.title,
                main_image: item.main_image,
                price: item.price,
                color: {
                    code: tempCartItems[idx].color.code,
                    name: tempCartItems[idx].color.name,
                },
                size: tempCartItems[idx].size,
                quantity: tempCartItems[idx].quantity,
                maxQty: matchingVariant.stock
            }
        })
        setCartItems(newCartItems.filter((item: CartItem) => item.maxQty >= item.quantity));
    })
}

const ShoppingCartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // localStorage.removeItem('shoppingCartItems');

    useEffect(() => {
        const savedCartItems = localStorage.getItem('shoppingCartItems');
        if (savedCartItems && cartItems.length == 0) {
            const tempCartItems = JSON.parse(savedCartItems);
            // products/details?id=1234
            const productPromise = tempCartItems.map(async (item: CartItem) => {
                return fetchProduct(item.id);
            })
            deleteSoldOutItems(productPromise, tempCartItems, setCartItems);
        }
    }, []);

    // Save data to localStorage whenever myList changes
    useEffect(() => {
        localStorage.setItem('shoppingCartItems', JSON.stringify(cartItems));
    }, [cartItems]);



    const addItemToCart = (item: CartItem) => {
        // add to cart if the item is not already in the cart (same id, color, size)
        if (!isItemInCart(cartItems, item)) {
            setCartItems(currentItems => [...currentItems, item]);
            return;
        } else {
            // update the quantity if the item is already in the cart
            setCartItems(currentItems => currentItems.map(cartItem => {
                if (cartItem.id === item.id &&
                    cartItem.color.code === item.color.code &&
                    cartItem.size === item.size) {
                    return { ...cartItem, quantity: item.quantity };
                }
                return cartItem;
            }));
        }
    };

    const removeItemFromCart = (itemId: number) => {
        setCartItems(currentItems => currentItems.filter(item => item.id !== itemId));
    };

    const clearCart = () => {
        setCartItems([]);
    }

    return (
        <ShoppingCartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart, clearCart }}>
            {children}
        </ShoppingCartContext.Provider>
    );
};

export { ShoppingCartProvider, useShoppingCart };
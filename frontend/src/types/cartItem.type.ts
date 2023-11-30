type CartItem = {
    id: number;
    title: string;
    main_image?: string;
    price: number;
    color: { code: string, name: string };
    size: string;
    quantity: number;
    maxQty: number;
};






export default CartItem;
type Product = {
    readonly category: string;
    readonly colors: ReadonlyArray<{ code: string, name: string }>,
    readonly description: string;
    readonly id: number;
    readonly images: null | string[];
    readonly main_image: string;
    readonly note: string;
    readonly place: string;
    readonly price: number;
    readonly sizes: string[];
    readonly story: string;
    readonly texture: string;
    readonly title: string;
    readonly variants: ReadonlyArray<{ size: string, stock: number, color_code: string }>;
    readonly wash: string;
}

export type { Product };
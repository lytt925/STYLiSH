import QuantityCounter from "./QuantityCounter"
import { ProuductSkuBlock, SkuBlock, SkuTitle, OptionWrapper, SelectionBox, ColorOption, SizeOptionBox, SizeOptionText } from "./ProductSku.styled"



type ProductSkuProps = {
    colors: ReadonlyArray<{ code: string, name: string }>;
    variantsByColor: ReadonlyArray<{ size: string, stock: number, color_code: string }>
    selectedColor: string;
    setSelectedColor: React.Dispatch<React.SetStateAction<string>>;
    selectedSize: string;
    setSelectedSize: React.Dispatch<React.SetStateAction<string>>;
    selectedQuantity: number;
    setSelectedQuantity: React.Dispatch<React.SetStateAction<number>>;
    selectedVariant: { size: string, stock: number, color_code: string } | undefined;
}

const ColorBox = (
    colorCode: string,
    isSelected: boolean = false,
    setSelectedColor: React.Dispatch<React.SetStateAction<string>>,
    setSelectedQuantity: React.Dispatch<React.SetStateAction<number>>,
) => {
    return (
        <SelectionBox key={colorCode} $isselected={isSelected}
            onClick={() => {
                setSelectedColor(colorCode)
                setSelectedQuantity(1);
            }}>
            <ColorOption $colorCode={colorCode} />
        </SelectionBox>
    )
}

const SizeBox = (
    size: string,
    stock: number,
    isSelected: boolean,
    setSelectedSize: React.Dispatch<React.SetStateAction<string>>,
    setSelectedQuantity: React.Dispatch<React.SetStateAction<number>>,
) => {
    return (
        <SizeOptionBox key={size} $chosen={isSelected} $available={stock > 0}
            onClick={() => {
                if (stock <= 0) return;
                setSelectedSize(size)
                setSelectedQuantity(1);
            }}>
            {/* {size} */}
            <SizeOptionText $chosen={isSelected} $available={stock > 0}>{size}</SizeOptionText>
        </SizeOptionBox>
    )
}


export const ProductSku = (
    { colors,
        variantsByColor,
        setSelectedColor,
        selectedColor,
        selectedSize,
        setSelectedSize,
        selectedQuantity,
        setSelectedQuantity,
        selectedVariant
    }: ProductSkuProps) => {

    return (
        <ProuductSkuBlock>
            <SkuBlock>
                <SkuTitle>顏色</SkuTitle>
                <OptionWrapper>
                    {colors.map((color) => {
                        let isSelected = selectedColor === color.code ? true : false
                        return ColorBox(color.code, isSelected, setSelectedColor, setSelectedQuantity)
                    })}
                </OptionWrapper>
            </SkuBlock>
            <SkuBlock>
                <SkuTitle>尺寸</SkuTitle>
                <OptionWrapper>
                    {variantsByColor.map((variant) => {
                        let isSelected = selectedSize === variant.size ? true : false;
                        return (
                            SizeBox(variant.size, variant.stock, isSelected, setSelectedSize, setSelectedQuantity)
                        )
                    })}
                </OptionWrapper>
            </SkuBlock>
            <SkuBlock>
                <SkuTitle>數量</SkuTitle>
                <OptionWrapper>
                    <QuantityCounter
                        key={`${selectedVariant?.color_code}_${selectedVariant?.size}`}
                        disabled={selectedVariant === undefined}
                        count={selectedQuantity}
                        setCount={setSelectedQuantity}
                        limit={selectedVariant?.stock}
                    />
                </OptionWrapper>
            </SkuBlock>
        </ProuductSkuBlock>
    )
}

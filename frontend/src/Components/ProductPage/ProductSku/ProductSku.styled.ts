import styled from "styled-components";


export const ProuductSkuBlock = styled.div`
  padding-top: 1.25em;
`

export const SkuBlock = styled.div`
display: flex;
align-items: center;
color: rgba(63, 58, 58, 1);
font-size: 1.25em;
line-height: 1.2em;
letter-spacing: 0.2em;
margin-bottom: 1.5em;
`

export const SkuTitle = styled.div`
border-right: 1px solid rgba(63, 58, 58, 1);
box-sizing: content-box;
width: 3em;
margin-right: 1.4em;
`

export const OptionWrapper = styled.div`
  display: flex;
  gap: 1em;
`

type ColorProps = {
    $colorCode: string;
}

export const ColorOption = styled.div<ColorProps>`
    display: flex;
    width: 1.2em;
    height: 1.2em;
    border: 1px solid rgba(211, 211, 211, 1);
    background-color: #${props => props.$colorCode};
`

type SizeBoxProps = {
    $chosen: boolean;
    $available: boolean;
}

export const SizeOptionBox = styled.div<SizeBoxProps>`
    position: relative;
    width: 1.8em;
    height: 1.8em;
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
    background-color: ${props => {
        if (props.$chosen) {
            return 'rgba(0, 0, 0, 1)'
        } else if (props.$available) {
            return 'rgba(236, 236, 236, 1)'
        } else {
            return 'rgba(236, 236, 236, 0.25)'
        }
    }};
`
type SizeTextProps = {
    $chosen: boolean;
    $available: boolean;
}

export const SizeOptionText = styled.p<SizeTextProps>`
    font-size: 1em;
    line-height: 1.8em;
    text-align: center;
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
    text-indent: 0.1em;

    color: ${props => {
        if (props.$chosen) {
            return 'rgba(255, 255, 255, 1)'
        } else if (props.$available) {
            return 'rgba(63, 58, 58, 1)'
        } else {
            return 'rgba(63, 58, 58, 0.25)'
        }
    }};
`



type SelectionBoxProps = {
    $isselected: boolean;
}

export const SelectionBox = styled.div<SelectionBoxProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.8em;
    height: 1.8em;
    border: ${props => props.$isselected ? '1px solid rgba(151, 151, 151, 1)' : 'none'};
    cursor: pointer;
`
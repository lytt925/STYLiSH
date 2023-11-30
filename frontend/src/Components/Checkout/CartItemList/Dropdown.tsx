import { ChangeEvent } from 'react';
import styled from 'styled-components';
import CartItem from '../../../types/cartItem.type';

type DropdownMenuProps = {
  idx: number,
  selectedVariant: CartItem,
  addItemToCart: (item: CartItem) => void
}

const DropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  position: relative;
  @media (max-width: 960px) {
    flex-direction: column;
    min-width: 0;
  }
`

const Title = styled.div`
  position: absolute;
  top: -80px;
  @media (max-width: 960px) {
    position: static;
    margin-bottom: 1.25em;
  }
`

function DropdownMenu({ idx, selectedVariant, addItemToCart }: DropdownMenuProps) {
  // State to keep track of the selected option

  // Function to handle when the option is changed
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const quantity = parseInt(event.target.value);
    addItemToCart({ ...selectedVariant, quantity });
  };

  return (
    <DropdownWrapper>
      {idx === 0 ? <Title>數量</Title> : null}
      <select style={{
        width: '80px',
        height: '32px',
        paddingLeft: '16px',
        borderRadius: '8px',
        border: '1px solid rgba(151, 151, 151, 1)',
        backgroundColor: 'rgba(243, 243, 243, 1)'
      }} value={selectedVariant.quantity} onChange={handleChange}>
        {[...Array(selectedVariant.maxQty).keys()].map((i) => {
          const v = i + 1;
          return (<option key={v} value={v}>{v}</option>);
        })}
      </select>
    </DropdownWrapper>
  );
}

export default DropdownMenu;

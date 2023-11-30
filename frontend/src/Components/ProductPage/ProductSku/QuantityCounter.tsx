import styled from "styled-components";


const CounterBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 8em;
    height: 2.2em;
    padding: 0em 0.75em;
    border: 1px solid rgba(151, 151, 151, 1);
`;

type QuantityCounterProps = {
    disabled: boolean;
    count: number;
    setCount: React.Dispatch<React.SetStateAction<number>>;
    limit: number | undefined;
};


const QuantityCounter = ({ disabled, count, setCount, limit }: QuantityCounterProps) => {
    // Function to increment the count
    const increment = () => {
        if (disabled) return;
        if (limit && count >= limit) return;
        setCount(prevCount => prevCount + 1);
    };

    // Function to decrement the count, ensuring it doesn't go below 1
    const decrement = () => {
        if (disabled) return;
        setCount(prevCount => (prevCount > 1 ? prevCount - 1 : 1));
    };

    return (
        <CounterBlock>
            <button onClick={decrement} style={{ marginRight: '10px' }}>-</button>
            <span>{count}</span>
            <button onClick={increment} style={{ marginLeft: '10px' }}>+</button>
        </CounterBlock>
    );
};

export default QuantityCounter;

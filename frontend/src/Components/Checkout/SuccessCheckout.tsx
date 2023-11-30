import styled from "styled-components"
import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

const SuccessCheckoutWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 250px;
    width: 400px;
    border: 1px solid #D3D3D3;
    margin: 250px;
`

const SuccessCheckout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const state = location.state;
        console.log("state", state);

        if (state?.message === "success") {
            setMessage('付款成功');
        } else if (state?.message === "failed") {
            setMessage('付款失敗');
        } else {
            navigate('/');
        }
    }, [location.state, navigate]);

    return (
        <SuccessCheckoutWrapper>
            {message &&
                <>
                    <h1 style={{ fontSize: '30px', marginBottom: '10px' }}>{message}</h1>
                    {message === "付款成功" ? <div>您的訂單編號是{location.state.data.number}</div> : null}
                </>
            }
        </SuccessCheckoutWrapper>
    );
}



export default SuccessCheckout
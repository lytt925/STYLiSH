import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import './style.css'
import useTappay from "../../../Hooks/useTappay"
import nativeLogin from "../../../Hooks/nativeLogin"
import { useShoppingCart } from "../../../Hooks/useShoppingCart"
import CartItem from "../../../types/cartItem.type"
import api from "../../../api"
import Loading from '../../../assets/img/loading.gif'



const CheckoutInfoWrapper = styled.div`
    width: 100%;
    border-top: 1px solid rgba(151, 151, 151, 1);
    display: flex;
    flex-direction: column;
    padding-top: 25px;
    margin-bottom: 40px;
    gap: 30px;
`


const CheckoutInfoTitle = styled.div`
  width: 100%;
  font-size: 16px;
  margin-bottom: 16px;
  font-weight: 700;
  @media (max-width: 960px) {
    margin-bottom: 10px;
  }
`

const FormLabel = styled.label`
  max-width: 120px;
  flex: 1;
  @media (max-width: 960px) {
    margin-bottom: 10px;
  }
`
const FormBlock = styled.form`
    display: flex;
    max-width: 696px;
    flex-wrap: wrap;
`

const FormControl = styled.div`
    flex: 1;
    border: 1px solid rgba(151, 151, 151, 1);
    border-radius: 8px;
    padding: 0 6px;
    min-width: 450px;
    height: 26px;
    @media (max-width: 960px) {
        min-width: 100%;
    }
`

const CheckoutSummary = styled.div`
  width: 240px;
  align-self: flex-end;
`

const CheckoutBlock = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`


const PayButton = styled.div`
  position: relative;
  width: 100%;
  height: 4em;
  background: rgba(0,0,0, 1);
  color: rgba(255, 255, 255, 1);
  margin-bottom: 2.5em;
  cursor: pointer;
  margin-top: 50px;
`
const PayButtonInner = styled.p`
  text-align: center;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);

  font-size: 1.25em;
  line-height: 1.5em;
  letter-spacing: 0.2em;
`

type RecipientData = {
    name: string | null,
    phone: string | null,
    email: string | null,
    address: string | null,
    time: string | null,
}

type CheckoutInfoProps = {
    recipientData: RecipientData
    errors: boolean[]
}

async function sendCheckoutRequest(recipientData: RecipientData, totalPrice: number, cartItems: CartItem[], accessToken: string, prime: string) {
    const headers = {
        "content-type": "application/json",
        "Authorization": `Bearer ${accessToken}`
    };

    const checkoutData = {
        "prime": prime,
        "order": {
            shipping: "delivery",
            payment: "credit_card",
            subtotal: totalPrice,
            freight: 30,
            total: totalPrice + 30,
            recipient: recipientData,
            list: cartItems.map((item: CartItem) => ({
                id: item.id.toString(),
                name: item.title,
                price: item.price,
                color: {
                    code: item.color.code,
                    name: item.color.name,
                },
                size: item.size,
                qty: item.quantity,
            }))
        }
    }

    try {
        const response = await api.post('/order/checkout', checkoutData, { headers })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

const CheckoutInfo = ({ recipientData, errors }: CheckoutInfoProps) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const { cartItems, clearCart } = useShoppingCart()
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    useTappay()

    const handlePay = async () => {
        if (errors.some(error => error === true)) {
            alert('請填寫正確資料')
            return
        }

        const accessToken = await nativeLogin()

        const tappayStatus = TPDirect.card.getTappayFieldsStatus()
        // Check TPDirect.card.getTappayFieldsStatus().canGetPrime before TPDirect.card.getPrime
        if (tappayStatus.canGetPrime === false) {
            alert('Can not get prime')
            return
        }

        // Get prime
        TPDirect.card.getPrime(async function (result: any) {
            if (result.status !== 0) {
                alert('Get prime error ' + result.msg)
                return
            }
            if (!accessToken) {
                alert('Not logged in')
                return
            }

            setLoading(true)
            const response = await sendCheckoutRequest(recipientData, totalPrice, cartItems, accessToken, result.card.prime)
            console.log("response", response);
            setLoading(false)
            const state = { message: '', data: { number: -1 } }
            if (response.data.number) {
                clearCart()
                state.message = 'success'
                state.data.number = response.data.number
            } else {
                state.message = 'failed'
            }
            navigate(`/checkout/pay`, { state })
        })
    }

    return (
        loading ? <div style={{ height: '300px' }}><img src={Loading} alt="loading" style={{ width: '60px', height: '60px' }} /></div> :
            <>
                <CheckoutInfoTitle>付款資料</CheckoutInfoTitle>
                <CheckoutInfoWrapper>
                    <FormBlock className="card-number-group">
                        <FormLabel htmlFor="card-number" className="control-label"><span id="cardtype"></span>卡號</FormLabel>
                        <FormControl className="form-control card-number"></FormControl>
                    </FormBlock>
                    <FormBlock className="expiration-date-group">
                        <FormLabel htmlFor="expiration-date" className="control-label">卡片到期日</FormLabel>
                        <FormControl className="form-control expiration-date" id="tappay-expiration-date"></FormControl>
                    </FormBlock>
                    <FormBlock className="ccv-group">
                        <FormLabel htmlFor="ccv" className="control-label">卡片後三碼</FormLabel>
                        <FormControl className="form-control ccv"></FormControl>
                    </FormBlock>
                </CheckoutInfoWrapper>
                <CheckoutSummary>
                    <CheckoutBlock>
                        <span>總金額</span>
                        <div className="flex items-center">
                            <div>NT.</div>
                            <div style={{ fontSize: '1.875em', lineHeight: '1.2em', marginLeft: '8px' }}>
                                {Math.round(totalPrice)}
                            </div>
                        </div>
                    </CheckoutBlock>
                    <CheckoutBlock>
                        <span>運費</span>
                        <div className="flex items-center">
                            <div>NT.</div>
                            <div style={{ fontSize: '1.875em', lineHeight: '1.2em', marginLeft: '8px' }}>30</div>
                        </div>
                    </CheckoutBlock>
                    <CheckoutBlock style={{ paddingTop: '20px', borderTop: '1px solid rgba(63, 58, 58, 1)' }}>
                        <span>應付金額</span>
                        <div className="flex items-center">
                            <div>NT.</div>
                            <div style={{ fontSize: '1.875em', lineHeight: '1.2em', marginLeft: '8px' }}>{Math.round(totalPrice) + 30}</div>
                        </div>
                    </CheckoutBlock>
                    <form id='tappay'>
                        <PayButton onClick={handlePay}>
                            <PayButtonInner>
                                確認付款
                            </PayButtonInner>
                        </PayButton>
                    </form>
                </CheckoutSummary>
            </>
    )
}

export default CheckoutInfo
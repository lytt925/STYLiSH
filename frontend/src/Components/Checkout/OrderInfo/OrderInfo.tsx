import styled from "styled-components"
import { useState } from "react"
import './OrderInfo.css'

const OrderInfoWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-top: 25px;
    border-top: 1px solid rgba(151, 151, 151, 1);
    margin-bottom: 50px;
    font-size: 16px;
    gap: 30px;
    @media (max-width: 960px) {
        padding: 20px 0px;
        border-right: none;
        border-left: none;
        font-size: 14px;
        gap: 20px;
    }
`


const OrderInfoTitle = styled.div`
  width: 100%;
  margin-bottom: 16px;
  font-weight: 700;
  @media (max-width: 960px) {
    margin-bottom: 10px;
  }
`

const FormBlock = styled.form`
    display: flex;
    max-width: 696px;
    flex-wrap: wrap;
    @media (max-width: 960px) {
        flex-direction: column;
    }
`

const ReceiverBlock = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 696px;
`


const FormInput = styled.input`
  flex: 1;
  border: 1px solid rgba(151, 151, 151, 1);
  border-radius: 8px;
  padding: 0 6px;
  min-width: 450px;
  @media (max-width: 960px) {
    min-width: 100%;
  }
`

const FormLabel = styled.label`
  max-width: 120px;
  flex: 1;
  @media (max-width: 960px) {
    margin-bottom: 10px;
  }
  &::after {
    content: "*";
    color: red;
  }
`

const DeliveryLabel = styled.label`
  margin-right: 32px;
  line-height: 26px;
  @media (max-width: 960px) {
    margin-right: 22px;
  }
`
type RecipientData = {
  name: string | null,
  phone: string | null,
  email: string | null,
  address: string | null,
  time: string | null,
}

type OrderInfoProps = {
  recipientData: RecipientData,
  setRecipientData: React.Dispatch<React.SetStateAction<{
    name: null;
    phone: null;
    email: null;
    address: null;
    time: null;
  }>>,
  errors: boolean[],
  setErrors: React.Dispatch<React.SetStateAction<boolean[]>>
}



const OrderInfo = ({ recipientData, setRecipientData, errors, setErrors }: OrderInfoProps) => {
  const validateAndSetState = (name: string, value: string) => {
    let hasError = false;

    switch (name) {
      case 'name': {
        hasError = value.length < 1;
        break;
      }
      case 'phone': {
        hasError = value.length < 10 || !(/^\d+$/.test(value));
        break;
      }
      case 'address': {
        hasError = value.length < 1;
        break;
      }
      case 'email': {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        hasError = !regex.test(value);
        break;
      }
      case 'time': {
        hasError = !value; // Inverted for clarity: empty value is an error
        break;
      }
      default:
        // Handle unexpected field names (optional)
        break;
    }


    type TfieldIndexMap = {
      name: number;
      phone: number;
      address: number;
      email: number;
      time: number;
      [key: string]: number; // Add index signature
    }

    const fieldIndexMap: TfieldIndexMap = {
      name: 0,
      phone: 1,
      address: 2,
      email: 3,
      time: 4
    }

    errors[name === 'email' ? 3 : fieldIndexMap[name]] = hasError; // Efficient error state update
  };

  const onChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateAndSetState(name, value);
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneInput = e.target as HTMLInputElement;
    const phoneValue = phoneInput.value;
    const masked = phoneValue.replace(/.(?=.{4})/g, '*');
    phoneInput.value = masked;
  };

  const handleFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneInput = e.target as HTMLInputElement;
    phoneInput.value = recipientData.phone || '';
  };

  return (
    <>
      <OrderInfoTitle>訂購資料</OrderInfoTitle>
      <OrderInfoWrapper>
        <ReceiverBlock >
          <div className={errors[0] ? 'has-error' : ""} style={{ display: 'flex', marginBottom: '10px', flexWrap: 'wrap' }}>
            <FormLabel htmlFor="name">收件人姓名</FormLabel>
            <FormInput type="text" id="name" name="name" placeholder="" onChange={onChanges} />
          </div>
          <p style={{ alignSelf: 'flex-end', color: 'rgba(139, 87, 42, 1)' }}>務必填寫完整收件人姓名，避免包裹無法順利簽收</p>
        </ReceiverBlock>
        <FormBlock className={errors[1] ? 'has-error' : ""}>
          <FormLabel htmlFor="phone">手機</FormLabel>
          <FormInput type="tel" id="phone" name="phone" placeholder="" onChange={onChanges} onBlur={handleBlur} onFocus={handleFocus} />
        </FormBlock>
        <FormBlock className={errors[2] ? 'has-error' : ""}>
          <FormLabel htmlFor="address">地址</FormLabel>
          <FormInput type="text" id="address" name="address" placeholder="" onChange={onChanges} />
        </FormBlock>
        <FormBlock className={errors[3] ? 'has-error' : ""}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <FormInput type="email" id="email" name="email" placeholder="" onChange={onChanges} />
        </FormBlock>
        <FormBlock className={errors[4] ? 'has-error' : ""}>
          <FormLabel htmlFor="time">配送時間</FormLabel>
          <div>
            <input style={{ marginRight: '5px' }} type="radio" id="morning" name="time" value="morning" onChange={onChanges} />
            <DeliveryLabel htmlFor="morning" >08:00-12:00</DeliveryLabel>
            <input style={{ marginRight: '5px' }} type="radio" id="afternoon" name="time" value="afternoon" onChange={onChanges} />
            <DeliveryLabel htmlFor="afternoon">14:00-18:00</DeliveryLabel>
            <input style={{ marginRight: '5px' }} type="radio" id="anytime" name="time" value="anytime" onChange={onChanges} />
            <DeliveryLabel htmlFor="anytime">不指定</DeliveryLabel>
          </div>
        </FormBlock>
      </OrderInfoWrapper>
    </>
  )
}

export default OrderInfo
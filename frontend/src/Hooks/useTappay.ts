import { useEffect } from "react"

const useTappay = () => {
  useEffect(() => {
    TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox')
    TPDirect.card.setup({
      fields: {
        number: {
          element: '.form-control.card-number',
          placeholder: '**** **** **** ****'
        },
        expirationDate: {
          element: document.getElementById('tappay-expiration-date'),
          placeholder: 'MM / YY'
        },
        ccv: {
          element: $('.form-control.ccv')[0],
          placeholder: '後三碼'
        }
      },
      styles: {
        'input': {
          'color': 'gray'
        },
        'input.ccv': {
          // 'font-size': '16px'
        },
        ':focus': {
          'color': 'black'
        },
        '.valid': {
          'color': 'green'
        },
        '.invalid': {
          'color': 'red'
        },
        '@media screen and (max-width: 400px)': {
          'input': {
            'color': 'orange'
          }
        }
      },
      // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
      isMaskCreditCardNumber: true,
      maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
      },
    })


    // listen for TapPay Field
    TPDirect.card.onUpdate(function (update: any) {
      /* Disable / enable submit button depend on update.canGetPrime  */
      /* ============================================================ */

      // update.canGetPrime === true
      //     --> you can call TPDirect.card.getPrime()
      const submitButton = document.querySelector('button[type="submit"]')
      if (update.canGetPrime) {
        submitButton?.removeAttribute('disabled')
        $('button[type="submit"]').removeAttr('disabled')
      } else {
        submitButton?.setAttribute('disabled', 'true')
        $('button[type="submit"]').attr('disabled', 'true')
      }


      /* Change card type display when card type change */
      /* ============================================== */

      // cardTypes = ['visa', 'mastercard', ...]
      let newType = update.cardType === 'unknown' ? '' : update.cardType
      $('#cardtype').text(newType)



      /* Change form-group style when tappay field status change */
      /* ======================================================= */

      // number 欄位是錯誤的
      if (update.status.number === 2) {
        setNumberFormGroupToError('.card-number-group')
      } else if (update.status.number === 0) {
        setNumberFormGroupToSuccess('.card-number-group')
      } else {
        setNumberFormGroupToNormal('.card-number-group')
      }

      if (update.status.expiry === 2) {
        setNumberFormGroupToError('.expiration-date-group')
      } else if (update.status.expiry === 0) {
        setNumberFormGroupToSuccess('.expiration-date-group')
      } else {
        setNumberFormGroupToNormal('.expiration-date-group')
      }

      if (update.status.ccv === 2) {
        setNumberFormGroupToError('.ccv-group')
      } else if (update.status.ccv === 0) {
        setNumberFormGroupToSuccess('.ccv-group')
      } else {
        setNumberFormGroupToNormal('.ccv-group')
      }
    })


  }, [])

}

function setNumberFormGroupToError(selector: any) {
  $(selector).addClass('has-error')
  $(selector).removeClass('has-success')
}

function setNumberFormGroupToSuccess(selector: any) {
  $(selector).removeClass('has-error')
  $(selector).addClass('has-success')
}

function setNumberFormGroupToNormal(selector: any) {
  $(selector).removeClass('has-error')
  $(selector).removeClass('has-success')
}

export default useTappay
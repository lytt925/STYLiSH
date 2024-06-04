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
  }
})


// listen for TapPay Field
TPDirect.card.onUpdate(function (update) {
  /* Disable / enable submit button depend on update.canGetPrime  */
  /* ============================================================ */

  // update.canGetPrime === true
  //     --> you can call TPDirect.card.getPrime()
  const submitButton = document.querySelector('button[type="submit"]')
  if (update.canGetPrime) {
    submitButton.removeAttribute('disabled')
    $('button[type="submit"]').removeAttr('disabled')
  } else {
    submitButton.setAttribute('disabled', true)
    $('button[type="submit"]').attr('disabled', true)
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

$('#tappay').on('submit', function (event) {
  event.preventDefault()

  // fix keyboard issue in iOS device
  forceBlurIos()

  const tappayStatus = TPDirect.card.getTappayFieldsStatus()
  console.log(tappayStatus)

  // Check TPDirect.card.getTappayFieldsStatus().canGetPrime before TPDirect.card.getPrime
  if (tappayStatus.canGetPrime === false) {
    alert('can not get prime')
    return
  }

  // Get prime
  TPDirect.card.getPrime(function (result) {
    if (result.status !== 0) {
      alert('get prime error ' + result.msg)
      return
    }
    // let command = 'get prime 成功，prime: ' + result.card.prime + '\nprime is inserted to the json'
    // document.querySelector('#curl').innerHTML = command
    const jsonData = JSON.parse(document.getElementById("jsonData").value);
    jsonData.prime = result.card.prime;
    document.getElementById("jsonData").value = JSON.stringify(jsonData, null, 2);
    sendCheckoutRequest()
  })
})

function setNumberFormGroupToError(selector) {
  $(selector).addClass('has-error')
  $(selector).removeClass('has-success')
}

function setNumberFormGroupToSuccess(selector) {
  $(selector).removeClass('has-error')
  $(selector).addClass('has-success')
}

function setNumberFormGroupToNormal(selector) {
  $(selector).removeClass('has-error')
  $(selector).removeClass('has-success')
}

function forceBlurIos() {
  if (!isIos()) {
    return
  }
  let input = document.createElement('input')
  input.setAttribute('type', 'text')
  // Insert to active element to ensure scroll lands somewhere relevant
  document.activeElement.prepend(input)
  input.focus()
  input.parentNode.removeChild(input)
}

function isIos() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function sendCheckoutRequest() {
  const target = window.location.hostname;
  const protocol = window.location.protocol;
  let stylishBackendApi;
  if (target === 'localhost') {
    stylishBackendApi = `${protocol}//${target}:3000/api/1.0/order/checkout`;
  } else {
    stylishBackendApi = `${protocol}//${target}/api/1.0/order/checkout`;
  }
  const jsonData = JSON.parse(document.getElementById("jsonData").value);

  const accessToken = localStorage.getItem('access_token');
  const headers = {
    "content-type": "application/json",
    "Authorization": `Bearer ${accessToken}`
  };

  document.querySelector('#curl').innerHTML = "Paying..."
  axios.post(stylishBackendApi, jsonData, { headers })
    .then(response => {
      console.log("Response:", response.data);
      // Handle the response as needed
      document.querySelector('#curl').innerHTML = `Response: ${JSON.stringify(response.data, null, 2)}`;
    })
    .catch(error => {
      console.error("Error:", error);
      // Handle errors
      document.querySelector('#curl').innerHTML = `Error: ${JSON.stringify(error.response.data, null, 2)}`;
    });
}

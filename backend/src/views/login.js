document.querySelector('#native-login').addEventListener('submit', (e) => nativeLoginOnSubmit(e));
async function nativeLoginOnSubmit(event) {
  event.preventDefault();
  const target = window.location.hostname;
  let stylishBackendApi;
  const protocol = window.location.protocol;
  if (target === 'localhost') {
    stylishBackendApi = `${protocol}//${target}:3000/api/1.0/user/signin`;
  } else {
    stylishBackendApi = `${protocol}//${target}/api/1.0/user/signin`;
  }
  const email = event.target.email.value
  const password = event.target.password.value
  const data = {
    provider: "native",
    email: email,
    password: password
  };

  const loginInfo = document.querySelector('#loginInfo');
  try {
    loginInfo.innerHTML = `Logging in...`;
    const response = await axios.post(stylishBackendApi, data, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // Handle the response here, e.g., show a success message or redirect to a new page.
    const accessToken = response.data.data.access_token;
    console.log(accessToken);
    // Save the access token to localStorage
    localStorage.setItem('access_token', accessToken);
    if (localStorage.getItem('access_token')) {
      loginInfo.innerHTML = `Login successful! You can pay now`;
    }
  } catch (error) {
    // Handle errors, e.g., display an error message.
    console.error('Login failed');
    console.error(error);
    loginInfo.innerHTML = `Login failed! Try again`;
  }
}



async function googleLogin(e) {
  // print the parameters
  const credential = e.credential;
  const loginInfo = document.querySelector('#loginInfo');
  loginInfo.innerHTML = `Logging in...`;
  if (credential) {
    loginToBackendWithGoogle(credential).then((response) => {
      localStorage.setItem('access_token', response.data.data.access_token);
      if (localStorage.getItem('access_token')) {
        loginInfo.innerHTML = `Login successful! You can pay now`;
        const googleButton = document.querySelector('.g_id_signin');
        googleButton.style.display = 'none';
        return true;
      }
    }).catch(error => { console.error(error) })
  } else {
    console.error('Login failed');
    loginInfo.innerHTML = `Login failed! Try again`;
    return false
  }
}

loginToBackendWithGoogle = async (credential) => {
  let stylishBackendApi;
  const target = window.location.hostname;
  const protocol = window.location.protocol;
  if (target === 'localhost') {
    stylishBackendApi = `${protocol}//${target}:3000/api/1.0/user/signin`;
  } else {
    stylishBackendApi = `${protocol}//${target}/api/1.0/user/signin`;
  }
  const data = {
    provider: "google",
    token: credential
  };
  return axios.post(stylishBackendApi, data, { headers: { 'Content-Type': 'application/json' } })
}

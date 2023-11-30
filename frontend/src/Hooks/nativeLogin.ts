import api from '../api';

async function nativeLogin() {

    const data = {
        "provider": "native",
        "email": "testtest@gmail.com",
        "password": "Test1234"
    }

    try {
        const response = await api.post('/user/signin', data, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        // Handle the response here, e.g., show a success message or redirect to a new page.
        const accessToken = response.data.data.access_token;
        console.log('login success', accessToken);
        // Save the access token to localStorage
        localStorage.setItem('accessToken', accessToken);
        return accessToken;

    } catch (error) {
        // Handle errors, e.g., display an error message.
        console.error('Login failed');
        console.error(error);
    }

}

export default nativeLogin;

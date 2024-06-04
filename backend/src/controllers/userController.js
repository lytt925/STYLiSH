const bcrypt = require('bcrypt');
const UsersTable = require('../services/UsersTable')
const { generateAccessToken } = require('../utils/jwt')
const { googleVerifyUser } = require('../services/GoogleAuth')


const getUserProfile = async (req, res) => {
  try {
    const { provider, name, email, picture } = req.tokenPayload;
    const response = {
      data: {
        provider,
        name,
        email,
        picture,
      }
    }
    return res.status(200).send(response)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ error: "Internal Server Error" })
  }
}

const signupUser = async (req, res) => {
  const { name, email, password } = req.body
  // check if user exists
  const existUser = await UsersTable.getUserByEmail(email)
  if (existUser.length > 0) {
    return res.status(409).send({ error: "User already exists" })
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await UsersTable.insertUser({ name, email, hash })
    const user = {
      id: result.insertId,
      provider: 'native',
      name: name,
      email: email,
      picture: `https://ui-avatars.com/api/?name=${name}&background=random`,
    }

    // Create the access token
    const { token, expiresIn } = generateAccessToken(user);
    // Create the response object
    const response = {
      data: {
        access_token: token,
        access_expired: expiresIn,
        user,
      },
    };
    return res.status(200).send(response)
  } catch (err) {
    console.log(err)
    return res.status(500).send({ error: "Internal Server Error" })
  }
}


const signinUser = async (req, res) => {
  const { provider, email, password, token: googleCred } = req.body;

  try {
    const user = await handleSignin(provider, email, password, googleCred);
    if (!user) {
      return res.status(400).send({ error: "Invalid credentials" });
    }

    const response = generateSigninResponse(user);
    return res.status(200).send(response);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

const handleSignin = async (provider, email, password, googleCred) => {
  if (provider === "google" && googleCred) {
    const payload = await googleVerifyUser(googleCred);
    return await handleGoogleSignin(payload);
  } else if (provider === "native" && email && password) {
    return await handleNativeSignin(email, password);
  } else {
    return null;
  }
};

const handleGoogleSignin = async (payload) => {
  const existingUser = await UsersTable.getUserByEmail(payload.email);
  if (existingUser.length === 0) {
    const newUser = await UsersTable.insertUser({
      name: payload.name,
      email: payload.email,
      hash: null,
      picture: payload.picture,
    });

    return {
      id: newUser.insertId,
      provider: "google",
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };
  }

  return {
    id: existingUser[0].id,
    provider: "google",
    name: existingUser[0].name,
    email: existingUser[0].email,
    picture: existingUser[0].picture,
  };
};

const handleNativeSignin = async (email, password) => {
  const existingUser = await UsersTable.getUserByEmail(email);
  if (existingUser.length === 0) {
    return null;
  }

  const passwordMatch = await bcrypt.compare(password, existingUser[0].password);
  if (!passwordMatch) {
    return null;
  }

  return {
    id: existingUser[0].id,
    provider: "native",
    name: existingUser[0].name,
    email: existingUser[0].email,
    picture: existingUser[0].picture,
  };
};

const generateSigninResponse = (user) => {
  // Create the access token after a new signin
  if (user) {
    const { token, expiresIn } = generateAccessToken(user);
    const response = {
      data: {
        "access_token": token,
        "access_expired": expiresIn,
        user
      }
    }
    return response
  }
}

exports.getUserProfile = getUserProfile
exports.signupUser = signupUser
exports.signinUser = signinUser
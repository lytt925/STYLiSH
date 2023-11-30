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
  const { provider, email, password, token: googleCred } = req.body

  let user;
  try {
    if (provider === "google" && googleCred) {
      const payload = await googleVerifyUser(googleCred);
      const existUser = await UsersTable.getUserByEmail(payload.email)

      if (existUser.length === 0) {
        const newUser = await UsersTable.insertUser(
          {
            name: payload.name,
            email: payload.email,
            hash: null,
            picture: payload.picture
          })
        if (newUser.affectedRows === 1) {
          user = {
            id: newUser.insertId,
            provider: "google",
            name: payload.name,
            email: payload.email,
            picture: payload.picture,
          }
          const response = generateSigninResponse(user)
          return res.status(200).send(response)
        }
      }

      if (existUser.length > 0) {
        user = {
          id: existUser[0].id,
          provider: "google",
          name: existUser[0].name,
          email: existUser[0].email,
          picture: existUser[0].picture,
        }
        const response = generateSigninResponse(user)
        return res.status(200).send(response)
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error" })
  }

  try {
    if (provider === "native" && (!email || !password)) {
      return res.status(400).send({ error: "invalid request" });
    }

    const existUser = await UsersTable.getUserByEmail(email);
    if (existUser.length === 0) {
      return res.status(403).send({ error: "email not found" });
    }

    const result = await bcrypt.compare(password, existUser[0].password);
    if (result) {
      user = {
        id: existUser[0].id,
        provider: 'native',
        name: existUser[0].name,
        email: existUser[0].email,
        picture: existUser[0].picture,
      };
      const response = generateSigninResponse(user)
      return res.status(200).send(response)
    } else {
      return res.status(403).send({ error: "wrong password" });
    }

  } catch (err) {
    console.log(err)
    return res.status(500).send({ error: "Internal Server Error" })
  }
}

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
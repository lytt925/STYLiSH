
const { OAuth2Client } = require('google-auth-library');

const googleVerifyUser = async (googleCred) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken: googleCred,
    audience: process.env.CLIENT_ID
  });
  return ticket.getPayload();
}

exports.googleVerifyUser = googleVerifyUser;
const db = require('../models/db')

// check if user exists
const getUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email])
  return rows
}

const insertUser = async ({ id, name, email, hash, picture, isGoogleAccount }) => {
  const [newUser] = await db.execute('INSERT INTO user (id, name, email, password, picture, is_google_account) VALUES (?, ?, ?, ?, ?, ?)',
    [id || null, name, email, hash, picture || `https://ui-avatars.com/api/?name=${name}&background=random`, isGoogleAccount || null])
  return newUser
}


exports.getUserByEmail = getUserByEmail
exports.insertUser = insertUser
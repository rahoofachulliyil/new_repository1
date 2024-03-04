const express = require('express')
const bcrypt = require('bcrypt')
var cors = require('cors')
const jwt = require('jsonwebtoken')
//var low = require('lowdb')
//var FileSync = require('lowdb/adapters/FileSync')
//var adapter = new FileSync('./database.json')
//var db = low(adapter)
const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));
// Initialize Express app
const app = express()

// Define a JWT secret key. This should be isolated by using env variables for security
const jwtSecretKey = 'dsfdsfsdfdsvcsvdfgefg'

// Set up CORS and JSON middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/', (_req, res) => {
  console.log("get call")
  res.send('Auth API.\nPlease use POST /auth & POST /verify for authentication')
})

// The auth endpoint that creates a new user record or logs a user based on an existing record
app.post('/auth', async (req, res) => {
  const { email, password } = req.body
  console.log("/auth user in email:", email, " password:",password)
  // Look up the user entry in the user by email
  const user = await User.findOne({ email });
  console.log("/auth user find: ", user)
  // If found, compare the hashed passwords and generate the JWT token for the user
  if (user) {
    bcrypt.hash("123456", 10, (error, hashedPassword) => {
      if (error) {
        console.error('Error generating hashed password:', error);
        return;
      }
    
      console.log('Hashed password:', hashedPassword);
    });
    bcrypt.compare(password, user.password, function (_err, result) {
      if (!result) {
        return res.status(401).json({ message: 'Invalid password' })
      } else {
        let loginData = {
          email,
          signInTime: Date.now(),
        }

        const token = jwt.sign(loginData, jwtSecretKey)
        res.status(200).json({ message: 'success', token })
        console.log("/auth call res: ", res.body)
      }
    })
    // If no user is found, hash the given password and create a new entry in the auth db with the email and hashed password
  } else {
    console.log("/auth call res: user not found")
    return res.status(404).json({ message: 'User not found' });
  }
  //else if (user.length === 0) {
  //   bcrypt.hash(password, 10, function (_err, hash) {
  //     console.log({ email, password: hash })
  //     db.get('users').push({ email, password: hash }).write()

  //     let loginData = {
  //       email,
  //       signInTime: Date.now(),
  //     }

  //     const token = jwt.sign(loginData, jwtSecretKey)
  //     res.status(200).json({ message: 'success', token })
  //   })
  // }
})

// The verify endpoint that checks if a given JWT token is valid
app.post('/verify', (req, res) => {
  const tokenHeaderKey = 'jwt-token'
  const authToken = req.headers[tokenHeaderKey]
  try {
    const verified = jwt.verify(authToken, jwtSecretKey)
    console.log("/verify call res: ", authToken)
    console.log("verify: ", verified)
    if (verified) {
      return res.status(200).json({ status: 'logged in', message: 'success' })
    } else {
      // Access Denied
      return res.status(401).json({ status: 'invalid auth', message: 'error' })
    }
  } catch (error) {
    // Access Denied
    return res.status(401).json({ status: 'invalid auth', message: 'error' })
  }
})

// An endpoint to see if there's an existing account for a given email address
app.post('/check-account', async(req, res) => {
  const { email } = req.body

  console.log(req.body)

  const user = await User.findOne({ email });

  console.log(user)

  res.status(200).json({
    status: !user ? 'User does not exist' : 'User exists',
    userExists: !(!user),
  })
})

app.listen(3080)
const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userprofile = require('../middleware/userprofile');

// Validation middleware
const userValidationRules = () => {
  return [
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
};

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// User creation route with validation
router.post('/createuser', userValidationRules(), validate(userValidationRules()), async (req, res) => {
  let success = false
  try {
    let { name, email, password } = req.body;

    //hashing the password

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)
    password = hash

    // Additional validation if needed, e.g., checking if the email is already in use

    const user = new User({ name, email, password });
    await user.save();

    //Generating token to sent to the user

    success = true
    const token = jwt.sign({userId:user.id}, 'tokenGenerationMessage')
    res.json({ success, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//creating a login end point

const loginValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
};

// Login route with validation
router.post('/login', loginValidationRules(), validate(loginValidationRules()), async (req, res) => {
  let success = false
  try {
    const { email, password } = req.body;

    // Check if the user with the provided email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the provided password matches the hashed password in the database
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If credentials are valid, generate a token and send it to the user
    success = true
    const token = jwt.sign({ userId: user.id }, 'tokenGenerationMessage');
    res.json({success, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//getting the profile of the user using token generated

router.get('/profile', userprofile, async (req, res) => {
  try {
    // The user information is available in req.user
    const userId = req.user.userId;
    
    // Retrieve user data from the database using the userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send user data as the response
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;

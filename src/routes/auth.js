const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService =  require('../services/userService');

const router =  express.Router();

router.post('/register', async (req, res) => {
    try{
        const user = await userService.registerUser(req.body);

        const token = jwt.sign(
            {
                sub: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {expiredIn: '24h'}
        );

        res.status(201).json({
            message: 'Registration successful',
            user: { ...user, password: undefined},
            token
        });
    } catch (error){
        res.status(400).json({
            message: error.message
        });
    }
});

router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }
  
      const user = await userService.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { 
          sub: user.id, 
          email: user.email, 
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      res.json({ 
        message: 'Login successful',
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name, 
          role: user.role 
        },
        token 
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed' });
    }
  });

  module.exports =  router;
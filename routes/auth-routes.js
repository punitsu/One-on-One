import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtTokens } from '../utils/jwt.helpers.js';
// import  registerSchema  from '../validation/userSchema';


// import {jwtTokens} from '../utils/jwt-helpers.js';

const router = express.Router();

router.post('/register', async(req,res) =>{

    const { error } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({ error: error.details });
    }
  
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await pool.query('INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
        [req.body.first_name, req.body.last_name, req.body.username, req.body.email, hashedPassword]);
        res.status(500).json({error:"We dont allow toxic comments"});
    } catch(error){
        res.status(200).json({message: 'User has been added'})
    }
})


router.post('/login', async(req,res) =>{
    try{
        const {email, password} = req.body;
        const users = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        //Valid Email
        if(users.rows.length === 0) return res.status(401).json({error : "Email is incorrect"})
        //Valid Password
        const validPassword = await bcrypt.compare(password, users.rows[0].password);
        if(!validPassword) return res.status(401).json({error:"Incorrect Password"});
        res.status(200)
        //JWT
        let tokens = jwtTokens(users.rows[0]);
        res.cookie('refresh token', tokens.refreshToken, {httpOnly:true})
        res.json(tokens)

    } catch(error){
        res.status(401).json({error:error.message})
    }
})

router.get('/refresh_token', (req,res) => {
    try{
        const refreshToken = req.cookies;
        if(refreshToken === null) return res.status(401).json({error: "Null refresh token"});
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
            if (error) return res.status(403).json({error:error.message})
            let tokens = jwtTokens(user);
            res.cookie('refresh token', tokens.refreshToken, {httpOnly:true})
            res.json(tokens);
        })
    }catch(error){
        res.status(401).json({error:error.message})
    }
})

router.delete('/refresh_token', (req,res)=> {
    try{
        res.clearCookie('refresh token')
        return res.status(200).json({message: 'Your token has been refreshed'})
    } catch(error){
        res.status(401).json({error:error.message})
    }
})

export default router;

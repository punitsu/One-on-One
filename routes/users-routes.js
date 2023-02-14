import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/authorization.js'


const router = express.Router();

router.get('/',authenticateToken, async(req,res) => {
    try{
        const users = await pool.query('SELECT * FROM users');
        res.json({users : users.rows});
    } catch(error){
        res.status(500).json({error:error.message});
    }
})

router.get('/interests',authenticateToken, async(req,res) => {
    try{
        const decoded = jwt.verify(req.cookies['refresh token'], process.env.REFRESH_TOKEN_SECRET); 
        const username = decoded.username;
        const { rows } = await pool.query('SELECT topic_id FROM topics WHERE topic = $1', [req.body.interest])
        
        const newUser = await pool.query('INSERT INTO interests (username, topic_id) VALUES ($1, $2) RETURNING *', 
        [username, rows[0]['topic_id']]);
        
        res.json({username : username, topic: newUser});   
        // const users = await pool.query('SELECT * FROM users');
    } catch(error){
        res.status(500).json({error:error.message});
    }
})



export default router; 
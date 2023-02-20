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

router.post('/interests',authenticateToken, async(req,res) => {
    try{
        const decoded = jwt.verify(req.cookies['refresh token'], process.env.REFRESH_TOKEN_SECRET); 
        const username = decoded.username;
        const { rows } = await pool.query('SELECT topic_id FROM topics WHERE topic = $1', [req.body.interest])
        
        const newUser = await pool.query('INSERT INTO interests (username, topic_id) VALUES ($1, $2) RETURNING *', 
        [username, rows[0]['topic_id']]);
        
        res.status(200).json({message: 'Your interest has been updated'})
    } catch(error){
        res.status(500).json({error:error.message});
    }
})

router.post('/update', async(req,res) =>{
    try{
        const decoded = jwt.verify(req.cookies['refresh token'], process.env.REFRESH_TOKEN_SECRET); 
        const username = decoded.username;

        const updateUser = await pool.query('INSERT INTO hosts (username, bio, photo, website, linkedin) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
        [username, req.body.bio, req.body.photo, req.body.website, req.body.linkedin]);

        res.status(200).json({message: 'Congrats now you can set meetings!'})
    } catch(error){
        res.status(500).json({error:error.message})
    }
})

router.post('/expertise',authenticateToken, async(req,res) => {
    try{
        const decoded = jwt.verify(req.cookies['refresh token'], process.env.REFRESH_TOKEN_SECRET); 
        const username = decoded.username;
        const hostid = await pool.query('SELECT host_id FROM hosts WHERE username = $1', [username])
        const { rows } = await pool.query('SELECT topic_id FROM topics WHERE topic = $1', [req.body.expertise])
        
        const newUser = await pool.query('INSERT INTO expertise (host_id, topic_id) VALUES ($1, $2) RETURNING *', 
        [hostid.rows[0]['host_id'], rows[0]['topic_id']]);

        res.status(200).json({message: 'Users can see and find you from your expertise!'})
        
    } catch(error){
        res.status(500).json({error:error.message});
    }
})


export default router;
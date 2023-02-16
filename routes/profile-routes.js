import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/authorization.js'
import clasify from '../validation/commentClassification.js'

const router = express.Router();


router.get('/:username', async(req,res) => {
    try{
        const hostUsername = req.params.username;
        const hostInfo = await pool.query('SELECT * FROM hosts WHERE username = $1', [hostUsername])
        // const { rows } = await pool.query('SELECT topic_id FROM topics WHERE topic = $1', [req.body.expertise])
        
        // const newUser = await pool.query('INSERT INTO expertise (host_id, topic_id) VALUES ($1, $2) RETURNING *', 
        // [hostid.rows[0]['host_id'], rows[0]['topic_id']]);

        res.json(hostInfo)

    } catch(error){
        res.status(500).json({error:error.message});
    }
})

router.post('/:username/comments',authenticateToken, async(req,res) => {
    try{

        const hostUsername = req.params.username;
        const hostid = await pool.query('SELECT host_id FROM hosts WHERE username = $1', [hostUsername])


        const comment = req.body.comment;
        const decoded = jwt.verify(req.cookies['refresh token'], process.env.REFRESH_TOKEN_SECRET); 
        const username = decoded.username;
        
        clasify({"inputs": comment}).then(async (response) => {
            const toxicity = JSON.parse(JSON.stringify(response));
            const toxicScore = toxicity[0].find(label => label.label === 'toxic').score;
            if (toxicScore < 0.4){
                    const result = await pool.query(
                        'INSERT INTO comments (host_id, username, comment) VALUES ($1, $2, $3)',
                        [hostid.rows[0]['host_id'], username, comment]
                        );
                    res.status(201).json({ message: result });
            }
            else{
                res.status(500).json({error:"We dont allow toxic comments"});
            }
        });   

    } catch(error){
        res.status(500).json({error:error.message});
    }
})

router.post('/:username/rating',authenticateToken, async(req,res) => {
    try{

        const hostUsername = req.params.username;
        const hostid = await pool.query('SELECT host_id FROM hosts WHERE username = $1', [hostUsername])


        const rating = req.body.rating;

        const decoded = jwt.verify(req.cookies['refresh token'], process.env.REFRESH_TOKEN_SECRET); 
        const username = decoded.username;


        const result = await pool.query(
            'INSERT INTO rating (host_id, username, rating) VALUES ($1, $2, $3)',
            [hostid.rows[0]['host_id'], username, rating]
          );
                
        res.status(201).json({ message: result });


    } catch(error){
        res.status(500).json({error:error.message});
    }
})


export default router;
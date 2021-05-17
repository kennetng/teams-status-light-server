import express from 'express';

import { getPresence } from '../client/presenceClient';
import { getToken } from './authApi';

export function presenceApi(app: express.Application){
    app.get("/presence/me", async (req, res) => {
        const token = getToken();
        try{
            if(!token){
                res.status(409).send("No user logged in")
                return
            }
            const presenceMe = await getPresence(token);
            res.status(200).send(presenceMe);
        }catch(error){
            res.status(409).send(error)
        }
    })
}

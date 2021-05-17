import express from "express";
import msal = require('@azure/msal-node');

const { PORT, REDIRECT_URL, CLIENT_ID, CLIENT_SECRET } = require('../config/environment');

const SERVER_PORT = PORT || 3000;
const REDIRECT_URI = REDIRECT_URL ||`http://localhost:${SERVER_PORT}/redirect`;

// Global variables
let accessToken: string | undefined;

const msalConfig = {
    auth: {
        clientId: CLIENT_ID,
        authority: "https://login.microsoftonline.com/common",
        clientSecret: CLIENT_SECRET,
    },
     system: {
         loggerOptions: {
             loggerCallback(logLevel: number, message: string, containsPii: any) {
                 console.log(message);
             },
             piiLoggingEnabled: false,
             logLevel: msal.LogLevel.Verbose,
         }
     }
 };

// Create msal application object
const pca = new msal.ConfidentialClientApplication(msalConfig);

export function authApi(app: express.Application){
    app.get("/", (req, res) => {
        const authCodeUrlParameters = {
          scopes: ["user.read", "presence.read"],
          redirectUri: REDIRECT_URI,
        };
      
        // get url to sign user in and consent to scopes needed for application
        pca
          .getAuthCodeUrl(authCodeUrlParameters)
          .then((response) => {
              res.redirect(response);
          })
          .catch((error) => console.log(JSON.stringify(error)));
      });
      
      app.get("/redirect",  (req, res) => {
        const tokenRequest: any  = {
          code: req.query.code,
          scopes: ["user.read"],
          redirectUri: REDIRECT_URI,
        };
      
         pca
          .acquireTokenByCode(tokenRequest)
          .then((response) => {
            if(response){
              accessToken = response.accessToken
              res.sendStatus(200)
            }
            res.sendStatus(408)
          })
          .catch((error) => {
            res.status(500).send(error);
          });
      });
}

export function getToken(){
    return accessToken;
}

export function getPca(){
  return pca;
}

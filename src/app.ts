import express from 'express';

import { authApi } from './api/authApi';
import { presenceApi } from './api/presenceApi';

const { PORT } = require('./config/environment');

const SERVER_PORT = PORT || 3000;

const app = express();

function startApplication(){

    // Endpoints
    authApi(app)
    presenceApi(app)

    app.listen(SERVER_PORT, () =>
    console.log(
      `Msal Node Auth Code Sample app listening on port ${SERVER_PORT}!`
    )
  );  
}

startApplication()
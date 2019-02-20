# Auth0-nodejs-example

This repo was done with the intention of showing how to do authentication and authorization with Node.js and Auth0.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

```
Node.js
```

### Installing

A step by step series of examples that tell you how to get a development env running

Install the required modules

```
npm install
```

And then

```
node index.js
```

### Tutorial

#### Requires

```javascript

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const request = require('request');

```

#### Authentication

```javascript

app.post('/authenticate', (req, res) => {
    const username = req.body.username; //Username or email
    const password = req.body.password;

    const options = { method: 'POST',
        url: 'https://studies.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        body: { 
            grant_type: 'password',
            username: username,
            password: password,
            audience: YOUR_AUDIENCE,
            scope: 'read:sample',
            client_id: YOUR_CLIENT_ID,
            client_secret: YOUR_CLIENT_SECRET },
        json: true 
    };

    request(options, function (error, response, body) {
        res.status(response.statusCode).json(body);
    });
});

```

#### Authorization

```javascript

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://ISSUER/.well-known/jwks.json"
    }),
    audience: 'YOUR_AUDIENCE',
    issuer: "ISSUER",
    algorithms: ['RS256']
});

app.get('/protected', jwtCheck, (req, res) => {
    res.json({message: 'authorized'})
});

```

## Built With

* [Node.js](https://nodejs.org)
* [Express](https://expressjs.com) - Used to manage routes
* [Request](https://github.com/request/request) - Used to make request to Auth0

## Author

* **Leandro Lima** - [limaleandro1999](https://github.com/limaleandro1999)

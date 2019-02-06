const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const request = require("request");

const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://studies.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://studies-api.com',
    issuer: "https://studies.auth0.com/",
    algorithms: ['RS256']
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/authenticate', (req, res) => {
    const options = { method: 'POST',
    url: 'https://studies.auth0.com/oauth/token',
    headers: { 'content-type': 'application/json' },
    body: 
     { grant_type: 'password',
       username: 'user@email.com',
       password: 'User123@',
       audience: 'https://studies-api.com',
       scope: 'read:sample',
       client_id: 'zWZHLbQPmQaHir47rqnh5oAXgbn1LGy7',
       client_secret: 'fUG4ApSpOgO90lBTWtl6TfLt4OCC0T0pph3hoGSvuZ6l9IIAAGD66ZIUnBgJaRFX' },
    json: true };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        
        console.log(body);
        res.json(body)
    });
});

app.get('/protected', jwtCheck, (req, res) => {
    res.json({message: 'authorized'})
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
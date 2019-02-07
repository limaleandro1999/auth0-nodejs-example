const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const request = require("request");
const fs = require('fs');

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
    const username = req.body.username;
    const password = req.body.password;

    const options = { method: 'POST',
        url: 'https://studies.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        body: { 
            grant_type: 'password',
            username: username,
            password: password,
            audience: 'https://studies-api.com',
            scope: 'read:sample',
            client_id: 'zWZHLbQPmQaHir47rqnh5oAXgbn1LGy7',
            client_secret: 'fUG4ApSpOgO90lBTWtl6TfLt4OCC0T0pph3hoGSvuZ6l9IIAAGD66ZIUnBgJaRFX' },
        json: true 
    };

    request(options, function (error, response, body) {
        if(response.statusCode === 200){
            try{
                const cert = fs.readFileSync('public.pem');
                const decoded = require('jsonwebtoken').verify(body.access_token, cert, {algorithms:['RS256']});
        
                body.email = decoded['https://myapp.example.com/email'];
                body.profile = decoded['https://myapp.example.com/profile'];
                res.status(response.statusCode).json(body)    
            }catch(error){
                console.log(error);
                res.status(500).json({'message': 'Internal Server Error.'});
            }
        }else if(response.statusCode === 403){
            res.status(response.statusCode).json(body)
        }
    });
});

app.get('/protected', jwtCheck, (req, res) => {
    res.json({message: 'authorized'})
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
// Require packages and set the port
const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes/routes');
//const userRoutes = require('./routes/users');

const port = 3002;
const app = express();


// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
 




// Export the router

//routes(app);
app.use('/', routes);
app.use('/users', routes);
app.use('/ins_user', routes);
app.use('/register', routes);
app.use('/check', routes);
app.use('/user', routes);
app.use('/deluser', routes);


const FOLDER = `${process.cwd()}/css`;
app.use(express.static(FOLDER));


// Start the server
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
 
    console.log(`Server listening on port ${server.address().port}`);
});
module.exports = app;

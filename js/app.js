const mysql = require ('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


var con = mysql.createConnection({
    host: 'core1.hostingspace.ro',
    user:'routteco_dradmin',
    password:'Greystar1',
    database:'routteco_crowd',
    port:3306
});

con.connect(function(error){
    if(error){
        console.log("Couldn't connect :(    Error: " + error);
    } else {
        console.log("Connected successfully~!");
    }    
});

con.query('USE routteco_crowd', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.' + err);
});

app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});
 
// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});


app.get('api/success', function (req, res) {
    con.query("SELECT * FROM `TABLE 1` WHERE state = 'success'", function (error, results, fields) {
        if (error) throw error;
        return res.send({  message: 'Successfull projects list.' , data: results,});
    });
});

app.get('api/failed', function (req, res) {
    con.query("SELECT * FROM `TABLE 1` WHERE state != 'success'", function (error, results, fields) {
        if (error) throw error;
        return res.send({  message: 'Failed Projects list.' , data: results,});
    });
});
app.get('api/creators', function (req, res) {
    con.query("SELECT creator FROM `TABLE 1`", function (error, results, fields) {
        if (error) throw error;
        return res.send({  message: 'Creators list.' , data: results,});
    });
});

app.get('api/projects', function (req, res) {
    con.query("SELECT * from `TABLE 1`", function (error, results, fields) {
        if (error) throw error;
        return res.send({  message: 'Projects list.' , data: results,});
    });
});

app.get('api/project/:name', function (req, res) {
    let project_name = req.params.name;
    if (!project_name) {
        return res.status(400).send({ error: true, message: 'Please provide project_name' });
    }
    con.query("SELECT * FROM `TABLE 1` WHERE 'project name' =?",project_name , function (error, results, fields) {
        if (error) throw error;
        return res.send({  message: 'Project called :'+ project_name , data: results,});
    });
});
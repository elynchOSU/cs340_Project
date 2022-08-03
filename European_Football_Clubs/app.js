/*
Citation for the following file:
Date: 7/26/2022
Adapted from:
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/app.js
*/

/*
    SETUP
*/



var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code

PORT        = 6234;                 // Set a port number at the top so it's easy to change in the future

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector')

// app.js - SETUP section

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
//app.use(express.static('public'))
app.use(express.static(__dirname + '/public')); // this is needed to allow for the form to use the ccs style sheet

/*
    ROUTES
*/
app.get('/', (req, res) => {
    res.render('home')
})                                                  // received back from the query

app.get('/owners', function(req, res)
{  
    let query1 = "SELECT * FROM Owners;";

    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        // store owner list
        // let owners = rows;

        res.render('owners', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

app.get('/coaches', function(req, res)
{  
    let query1 = `SELECT * FROM Coaches 
    JOIN Teams ON Coaches.team_id = Teams.team_id 
    ORDER BY coach_id ASC;`;

    let query2 = `SELECT * FROM Teams ORDER BY team_name ASC;`;

    // Execute the first query
    db.pool.query(query1, function(error, rows, fields){    

        // Store query results
        let coaches = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let teams = rows;
            res.render('coaches', {data: coaches, teams: teams}); 
        })
                         // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

app.get('/players', function(req, res)
{  
    let query1 = `SELECT * FROM Players 
    JOIN Teams ON Players.team_id = Teams.team_id 
    ORDER BY player_id ASC;`;

    let query2 = `SELECT * FROM Teams ORDER BY team_name ASC;`;

    // Execute the first query
    db.pool.query(query1, function(error, rows, fields){    

        // Store query results
        let players = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let teams = rows;
            res.render('players', {data: players, teams: teams}); 
        })
                         // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

app.get('/trophies', function(req, res)
{  
    let query1 = `SELECT * FROM Trophies 
    JOIN Teams ON Trophies.team_id = Teams.team_id 
    ORDER BY trophy_year DESC;`;

    let query2 = `SELECT * FROM Teams ORDER BY team_name ASC;`;

    // Execute the first query
    db.pool.query(query1, function(error, rows, fields){    

        // Store query results
        let trophies = rows;

        db.pool.query(query2, (error, rows, fields) => {
            let teams = rows;
            res.render('trophies', {data: trophies, teams: teams}); 
        })
                         // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

app.get('/matches', (req, res) => {
    res.render('matches')
})

app.get('/teams', function(req, res)
{  
    let query1 = `SELECT team_id, team_name, play_ground FROM Teams ORDER BY team_name ASC;`;

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('teams', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

app.get('/home', (req, res) => {
    res.render('home')
})

// Create a new Team    
app.post('/add-team-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Teams (team_name, play_ground) VALUES ("${data.team_name}", "${data.play_ground}");`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        else
        {
            // If there was no error, perform a SELECT * on owners
            query2 = `SELECT team_id, team_name, play_ground FROM Teams ORDER BY team_name ASC;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
})

// Create a new Trophy    
app.post('/add-trophy-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let teamID = parseInt(data.team_id);

    // Create the query and run it on the database
    query1 = `INSERT INTO Trophies (trophy_name, trophy_year, team_id)
    VALUES ("${data.trophy_name}", ${data.trophy_year}, ${teamID});`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        else
        {
            // If there was no error, perform a SELECT * on trophies
            query2 = `SELECT * FROM Trophies ORDER BY trophy_year DESC;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
})

// Create a new Coach    
app.post('/add-coach-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let teamID = parseInt(data.team_id);

    // Create the query and run it on the database
    query1 = `INSERT INTO Coaches (coach_name, team_id, is_head_coach)
    VALUES ("${data.coach_name}", ${teamID}, ${data.is_head_coach});`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        else
        {
            // If there was no error, perform a SELECT * on coaches
            query2 = `SELECT * FROM Coaches ORDER BY coach_id ASC;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
})

// Create a new Player    
app.post('/add-player-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let teamID = parseInt(data.team_id);

    // Create the query and run it on the database
    query1 = `INSERT INTO Players (player_name, player_age, position, salary, jersey_number, team_id)
    VALUES ("${data.player_name}", ${data.player_age}, ${data.position}, ${data.salary}, ${data.jersey_number}, ${teamID});`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        else
        {
            // If there was no error, perform a SELECT * on coaches
            query2 = `SELECT * FROM Players ORDER BY player_id ASC;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
})

// Create a new Owner    
app.post('/add-owner-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    
    let age = parseInt(data.owner_age);
    if (isNaN(age))
    {
        age = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Owners (owner_name, owner_age, owner_nationality) VALUES ('${data.owner_name}', ${age}, '${data.owner_nationality}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        else
        {
            // If there was no error, perform a SELECT * on owners
            query2 = `SELECT * FROM Owners;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
})

app.delete('/delete-owner-ajax/', function(req,res,next){
    let data = req.body;
    let ownerID = parseInt(data.owner_id);
    let deleteOwner = `DELETE FROM Owners WHERE owner_id = ?`;

          // Run the 1st query
          db.pool.query(deleteOwner, [ownerID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                
              // If there was no error, perform a SELECT * on bsg_people
              query2 = `SELECT * FROM Owners;`;
              db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
              })
              }
  })});

  app.put('/put-owner-ajax', function(req,res,next){
    let data = req.body;
  
    let owner = parseInt(data.owner_id);
    let age = parseInt(data.owner_age);
  
    let queryUpdateOwner = `UPDATE Owners SET owner_age = ? WHERE owner_id = ?`;
  
          // Run the 1st query
          db.pool.query(queryUpdateOwner, [age, owner], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                
              // If there was no error, perform a SELECT * on bsg_people
              query2 = `SELECT * FROM Owners;`;
              db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
              })
              }
  })});
/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
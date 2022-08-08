/*
Citation for the following file:
Date: 7/26/2022
Adapted from:
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/app.js
*/

/*
    SETUP
*/

var express = require('express');                           // Enable Express library for the web server
var app     = express();                                    // Instantiate an express object to interact with the server

PORT        = 6234;                                         // Set unique port number

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');                 // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));              // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                             // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector')

// app.js - SETUP section
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

//app.use(express.static('public'))
app.use(express.static(__dirname + '/public'));             // this is needed to allow for the form to use the ccs style sheet

/*
    ROUTES
*/
app.get('/', (req, res) => {
    res.render('home')                                      // display home page
})                                                  

app.get('/owners', function(req, res)
{  
    let query1 = "SELECT owner_id AS 'ID', owner_name AS 'Name', owner_nationality AS 'Nationality', owner_age AS 'Age' FROM Owners;";

    db.pool.query(query1, function(error, rows, fields){    // Execute the query
        // store owner list
        // let owners = rows;

        res.render('owners', {data: rows});                 // Render the owners.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

app.get('/team_ownerships', function(req, res)
{  
    let query1 = `SELECT ownership_id AS 'ID', (SELECT team_name FROM Teams WHERE Teams.team_id = Team_Ownerships.team_id ) AS 'Team', 
    (SELECT owner_name FROM Owners WHERE Owners.owner_id = Team_Ownerships.owner_id ) AS 'Owner' FROM Team_Ownerships
    INNER JOIN Teams ON Team_Ownerships.team_id = Teams.team_id INNER JOIN Owners ON Team_Ownerships.owner_id = Owners.owner_id
    ORDER BY ownership_id ASC;`;

    let query2 = `SELECT * FROM Teams ORDER BY team_name ASC;`;

    let query3 = `SELECT * FROM Owners ORDER BY owner_name ASC;`;

    // Run query 1
    db.pool.query(query1, function(error, rows, fields){    
        // Store query results
        let ownerships = rows;

        // Run query 2
        db.pool.query(query2, (error, rows, fields) => {
            // Store query results
            let teams = rows;

            // Run query 3
            db.pool.query(query3, (error, rows, fields) => {
                // Store query results
                let owners = rows;

                // Render team_ownerships.hbs file, and send renderer object where 'data' = 'ownerships', 'teams' = 'teams,
                // and 'owners' = 'owners' based on the rows received back from the 3 queries run
                res.render('team_ownerships', {data: ownerships, teams: teams, owners: owners}); 
            })        
        })    
    })                                                   
});                                                      

app.get('/coaches', function(req, res)
{  
    let query1 = `SELECT coach_id AS 'ID', coach_name AS 'Name', team_name AS 'Team', coach_role AS 'Role' FROM Coaches 
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
        })                                                  // Render the coaches.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'coaches' we
});                                                         // received back from query1 and 'teams' equals the 'teams' we received from query2

/*
Citation for the following route:
Date: 8/7/2022
Adapted from:
https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%206%20-%20Dynamically%20Filling%20Dropdowns%20and%20Adding%20a%20Search%20Box
*/
app.get('/players', function(req, res)
{  
    
    let query1;

    // If there is no query string, perform a basic SELECT
    if (req.query.player_name === undefined)
    {
        query1 = `SELECT player_id AS 'ID', player_name AS 'Name', player_age AS 'Age', position AS 'Position', 
        salary AS 'Salary', jersey_number AS 'Number', team_name AS 'Team' FROM Players 
        LEFT JOIN Teams ON Players.team_id = Teams.team_id ORDER BY player_id ASC;`;
    }

    // If there is a query string, return desired results as a search
    else
    {
        query1 = `SELECT player_id AS 'ID', player_name AS 'Name', player_age AS 'Age', position AS 'Position', 
        salary AS 'Salary', jersey_number AS 'Number', team_name AS 'Team' FROM Players 
        LEFT JOIN Teams ON Players.team_id = Teams.team_id WHERE position LIKE "${req.query.position}%" ORDER BY player_id ASC;` 
    }

    let query2 = `SELECT * FROM Teams ORDER BY team_name ASC;`;

    // Execute the first query
    db.pool.query(query1, function(error, rows, fields){    

        // Store query results
        let players = rows;

        // Execute the second query
        db.pool.query(query2, (error, rows, fields) => {
            let teams = rows;
            res.render('players', {data: players, teams: teams}); 
        })
                                                            // Render the players.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'players' we received back from 
});                                                         // the first query, and 'teams' is equal to 'teams' we received from the second query

app.get('/matches', function(req, res)
{  

    let query1 = `SELECT match_id, match_year, (SELECT team_name FROM Teams WHERE Teams.team_id = Matches.home_team_id ) AS 'home_team_name',
    (SELECT team_name FROM Teams WHERE Teams.team_id = Matches.away_team_id ) AS 'away_team_name',
    home_team_score, away_team_score FROM Matches INNER JOIN Teams ON Matches.home_team_id = Teams.team_id
    ORDER BY match_id ASC`;

    let query2 = `SELECT * FROM Teams ORDER BY team_name ASC;`;

    // Execute the first query
    db.pool.query(query1, function(error, rows, fields){    

        // Store query results
        let matches = rows;

        // Execute the second query
        db.pool.query(query2, (error, rows, fields) => {

            // Store query results
            let teams = rows;
            res.render('matches', {data: matches, teams: teams}); 
        })                                                  // Render the matches.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'matches' we
});                                                         // received back from the query, and 'teams' is equal to the 'teams' we received from the second query

app.get('/trophies', function(req, res)
{  
    let query1 = `SELECT trophy_id AS 'ID', trophy_name AS 'Trophy', trophy_year AS 'Year', team_name AS 'Victor' FROM Trophies 
    JOIN Teams ON Trophies.team_id = Teams.team_id 
    ORDER BY trophy_id ASC;`;

    let query2 = `SELECT * FROM Teams ORDER BY team_name ASC;`;

    // Execute the first query
    db.pool.query(query1, function(error, rows, fields){    

        // Store query results
        let trophies = rows;

        // Execute second query
        db.pool.query(query2, (error, rows, fields) => {

            // Store second query results
            let teams = rows;
            res.render('trophies', {data: trophies, teams: teams}); 
        })                                                  // Render the trophies.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'trophies' we
});                                                         // received back from the query, and 'teams' equals 'teams' received back from the second query

app.get('/teams', function(req, res)
{  
    let query1 = `SELECT team_id AS 'ID', team_name AS 'Name', play_ground AS 'Grounds' FROM Teams ORDER BY team_id ASC;`;

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('teams', {data: rows});                  // Render the teams.hbs file, and also send the renderer
    })                                                      // an object where 'data' is equal to the 'rows' we
});                                                         // received back from the query

app.get('/home', (req, res) => {
    res.render('home')                                      // render the home page
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
            // If there was no error, perform a SELECT on Teams
            query2 = `SELECT team_id AS 'ID', team_name AS 'Name', play_ground AS 'Grounds' FROM Teams ORDER BY team_id ASC;`;
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
            // If there was no error, perform a SELECT on Trophies
            query2 = `SELECT trophy_id AS 'ID', trophy_name AS 'Trophy', trophy_year AS 'Year', team_name AS 'Victor' FROM Trophies 
            JOIN Teams ON Trophies.team_id = Teams.team_id 
            ORDER BY trophy_id ASC;`;
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
    query1 = `INSERT INTO Coaches (coach_name, team_id, coach_role)
    VALUES ("${data.coach_name}", ${teamID}, "${data.coach_role}");`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        else
        {
            // If there was no error, perform a SELECT on Coaches
            query2 = `SELECT coach_id AS 'ID', coach_name AS 'Name', team_name AS 'Team', coach_role AS 'Role' FROM Coaches 
            JOIN Teams ON Coaches.team_id = Teams.team_id ORDER BY coach_id ASC;`;
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
    VALUES ("${data.player_name}", ${data.player_age}, '${data.position}', ${data.salary}, ${data.jersey_number}, ${teamID});`;

    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        else
        {
            // If there was no error, perform a SELECT on Players
            query2 = `SELECT player_id AS 'ID', player_name AS 'Name', player_age AS 'Age', position AS 'Position', 
            salary AS 'Salary', jersey_number AS 'Number', team_name AS 'Team' FROM Players 
            JOIN Teams ON Players.team_id = Teams.team_id ORDER BY player_id ASC;`;
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
            // If there was no error, perform a SELECT on Owners
            query2 = `SELECT owner_id AS 'ID', owner_name AS 'Name', owner_nationality AS 'Nationality', owner_age AS 'Age' FROM Owners;`;
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

// Create a new Ownership
app.post('/add-ownership-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let teamID = parseInt(data.team_id);
    let ownerID = parseInt(data.owner_id);

    // Create the query and run it on the database
    query1 = `INSERT INTO Team_Ownerships (team_id, owner_id)
    VALUES (${teamID}, ${ownerID})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        else
        {
            // If there was no error, perform a SELECT on Team_Ownerships
            query2 = `SELECT ownership_id AS 'ID', (SELECT team_name FROM Teams WHERE Teams.team_id = Team_Ownerships.team_id ) AS 'Team', 
            (SELECT owner_name FROM Owners WHERE Owners.owner_id = Team_Ownerships.owner_id ) AS 'Owner' FROM Team_Ownerships
            INNER JOIN Teams ON Team_Ownerships.team_id = Teams.team_id INNER JOIN Owners ON Team_Ownerships.owner_id = Owners.owner_id
            ORDER BY ownership_id ASC;`;
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

// Create a new Match    
app.post('/add-match-ajax', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let homeTeamID = parseInt(data.home_team_id);
    let awayTeamID = parseInt(data.away_team_id);
    let year = parseInt(data.match_year);

    // Create the insert query
    query1 = `INSERT INTO Matches (match_year, home_team_id, away_team_id, home_team_score, away_team_score)
    VALUES (${year}, ${homeTeamID}, ${awayTeamID}, ${data.home_team_score}, ${data.away_team_score});`;

    // Run insert query
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        else
        {
            // If there was no error, perform a SELECT on Matches
            query2 = `SELECT match_id, match_year, (SELECT team_name FROM Teams WHERE Teams.team_id = Matches.home_team_id ) AS 'home_team_name', home_team_score,
            (SELECT team_name FROM Teams WHERE Teams.team_id = Matches.away_team_id ) AS 'away_team_name', away_team_score
            FROM Matches INNER JOIN Teams ON Matches.home_team_id = Teams.team_id
            ORDER BY match_id ASC`;
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

// Delete an Owner
app.delete('/delete-owner-ajax/', function(req,res,next){
    let data = req.body;

    // Store ID to delete and establish delete query
    let ownerID = parseInt(data.owner_id);
    let deleteOwner = `DELETE FROM Owners WHERE owner_id = ?`;

          // Run the delete query
          db.pool.query(deleteOwner, [ownerID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                
              // If there was no error, perform a SELECT on Owners
              query2 = `SELECT owner_id AS 'ID', owner_name AS 'Name', owner_nationality AS 'Nationality', owner_age AS 'Age' FROM Owners;`;
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

// Delete a Team Ownership
app.delete('/delete-ownership-ajax/', function(req,res,next){
    let data = req.body;

    // Store ID to delete and establish delete query
    let ownershipID = parseInt(data.ownership_id);
    let deleteOwnership = `DELETE FROM Team_Ownerships WHERE ownership_id = ?`;

          // Run the delete query
          db.pool.query(deleteOwnership, [ownershipID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                
              // If there was no error, perform a SELECT on Team_Ownerships
              query2 = `SELECT ownership_id AS 'ID', (SELECT team_name FROM Teams WHERE Teams.team_id = Team_Ownerships.team_id ) AS 'Team', 
              (SELECT owner_name FROM Owners WHERE Owners.owner_id = Team_Ownerships.owner_id ) AS 'Owner' FROM Team_Ownerships
              INNER JOIN Teams ON Team_Ownerships.team_id = Teams.team_id INNER JOIN Owners ON Team_Ownerships.owner_id = Owners.owner_id
              ORDER BY ownership_id ASC;`;
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

// Update an Owner
app.put('/put-owner-ajax', function(req,res,next){
    let data = req.body;
  
    // Store update data
    let owner = parseInt(data.owner_id);
    let age = parseInt(data.owner_age);
  
    // Establish update query
    let queryUpdateOwner = `UPDATE Owners SET owner_age = ? WHERE owner_id = ?`;
  
          // Run the update query
          db.pool.query(queryUpdateOwner, [age, owner], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the Owners's
              // table on the front-end
              else
              {
                
              // If there was no error, perform a SELECT * on Owner
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

// Update a Player
app.put('/put-player-ajax', function(req,res,next){
    let data = req.body;
  
    // Store update data
    let player = parseInt(data.player_id);
    let age = parseInt(data.player_age);
    let salary = parseInt(data.salary);
    let jersey = parseInt(data.jersey_number);
    let team = parseInt(data.team_id);

    // Account for null values
    if (isNaN(salary)) 
    {
        salary = null;
    }
    if (isNaN(jersey)) 
    {
        jersey = null;
    }
    if (isNaN(team)) 
    {
        team = null;
    }
  
    // Establish update query
    let queryUpdatePlayer = `UPDATE Players SET player_age = ?, position = "${data.position}", salary = ?, jersey_number = ?, team_id = ? WHERE player_id = ?`;
  
          // Run the update query
          db.pool.query(queryUpdatePlayer, [age, salary, jersey, team, player], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the players's
              // table on the front-end
              else
              {
                
              // If there was no error, perform a SELECT * on Players
              query2 = `SELECT * FROM Players;`;
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
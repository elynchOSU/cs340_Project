/*
Citation for the following file:
Date: 7/26/2022
Adapted from:
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/add_person.js
*/

// Get the objects we need to modify
let addMatchForm = document.getElementById('add-match-form-ajax');

// Modify the objects we need
addMatchForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputMatchYear = document.getElementById("input-year");
    let inputHomeTeamId = document.getElementById("mySelectHome");
    let inputAwayTeamId = document.getElementById("mySelectAway");
    let inputHomeScore = document.getElementById("input-home_score");
    let inputAwayScore = document.getElementById("input-away_score");

    // Get the values from the form fields
    let matchYearValue = inputMatchYear.value;
    let homeTeamValue = inputHomeTeamId.value;
    let awayTeamValue = inputAwayTeamId.value;
    let homeScoreValue = inputHomeScore.value;
    let awayScoreValue = inputAwayScore.value;

    // Put data we want to send in a javascript object
    let data = {
        match_year: matchYearValue,
        home_team_id: homeTeamValue,
        away_team_id: awayTeamValue,
        home_team_score: homeScoreValue,
        away_team_score: awayScoreValue
    }
    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-match-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {

        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputMatchYear.value = '';
            inputHomeTeamId.value = '';
            inputAwayTeamId.value = '';
            inputHomeScore.value = '';
            inputAwayScore.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Matches
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out
    let currentTable = document.getElementById("match-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);

    // Store new row data
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 6 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let matchYearCell = document.createElement("TD");
    let homeTeamCell = document.createElement("TD");
    let awayTeamCell = document.createElement("TD");
    let homeScoreCell = document.createElement("TD");
    let awayScoreCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.match_id;
    matchYearCell.innerText = newRow.match_year;
    homeTeamCell.innerText = newRow.home_team_name;
    awayTeamCell.innerText = newRow.away_team_name;
    homeScoreCell.innerText = newRow.home_team_score;
    awayScoreCell.innerText = newRow.away_team_score;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(matchYearCell);
    row.appendChild(homeTeamCell);
    row.appendChild(homeScoreCell);
    row.appendChild(awayTeamCell);
    row.appendChild(awayScoreCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
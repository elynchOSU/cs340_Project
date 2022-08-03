/*
Citation for the following file:
Date: 7/26/2022
Adapted from:
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/add_person.js
*/

// Get the objects we need to modify
let addTrophyForm = document.getElementById('add-player-form-ajax');

// Modify the objects we need
addTrophyForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPlayerName = document.getElementById("input-name");
    let inputAge = document.getElementById("input-age");
    let inputPosition = document.getElementById("input-position");
    let inputSalary = document.getElementById("input-salary");
    let inputJerseyNumber = document.getElementById("input-jersey_number");
    let inputTeamId = document.getElementById("mySelect");

    // Get the values from the form fields
    let playerNameValue = inputPlayerName.value;
    let ageValue = inputAge.value;
    let positionValue = inputPosition.value;
    let salaryValue = inputSalary.value;
    let jerseyNumberValue = inputJerseyNumber.value;
    let teamIdValue = inputTeamId.value;

    // Put our data we want to send in a javascript object
    let data = {
        player_name: playerNameValue,
        player_age: ageValue,
        position: positionValue,
        salary: salaryValue,
        jersey_number: jerseyNumberValue,
        team_id: teamIdValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-player-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {

        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputTrophyName.value = '';
            inputYear.value = '';
            inputTeamId = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("player-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);

    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let playerNameCell = document.createElement("TD");
    let ageCell = document.createElement("TD");
    let positionCell = document.createElement("TD");
    let salaryCell = document.createElement("TD");
    let jerseyNumberCell = document.createElement("TD");
    let teamIdCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.player_id;
    playerNameCell.innerText = newRow.player_name;
    ageCell.innerText = newRow.player_age;
    salaryCell.innerText = newRow.salary;
    positionCell.innerText = newRow.position;
    jerseyNumberCell.innerText = newRow.jersey_number;
    teamIdCell.innerText = newRow.team_id;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(playerNameCell);
    row.appendChild(ageCell);
    row.appendChild(positionCell);
    row.appendChild(salaryCell);
    row.appendChild(jerseyNumberCell);
    row.appendChild(teamIdCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);
    
    // Add the row to the table
    currentTable.appendChild(row);


    // End of new step 8 code.
}
/*
Citation for the following file:
Date: 7/26/2022
Adapted from:
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/add_person.js
*/

// Get the objects we need to modify
let addPlayerForm = document.getElementById('add-player-form-ajax');

// Modify the objects we need
addPlayerForm.addEventListener("submit", function (e) {
    
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

    // Put data we want to send in a javascript object
    let data = {
        player_name: playerNameValue,
        player_age: ageValue,
        position: positionValue,
        salary: salaryValue,
        jersey_number: jerseyNumberValue,
        team_id: teamIdValue
    }
    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-player-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {

        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputPlayerName.value = '';
            inputAge.value = '';
            inputPosition.value = '';
            inputSalary.value = '';
            inputJerseyNumber.value = '';
            inputTeamId.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Players
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("player-table");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);

    // Store new row data
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 7 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let playerNameCell = document.createElement("TD");
    let ageCell = document.createElement("TD");
    let positionCell = document.createElement("TD");
    let salaryCell = document.createElement("TD");
    let jerseyNumberCell = document.createElement("TD");
    let teamCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.ID;
    playerNameCell.innerText = newRow.Name;
    ageCell.innerText = newRow.Age;
    salaryCell.innerText = newRow.Salary;
    positionCell.innerText = newRow.Position;
    jerseyNumberCell.innerText = newRow.Number;
    teamCell.innerText = newRow.Team;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(playerNameCell);
    row.appendChild(ageCell);
    row.appendChild(positionCell);
    row.appendChild(salaryCell);
    row.appendChild(jerseyNumberCell);
    row.appendChild(teamCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);
    
    // Add the row to the table
    currentTable.appendChild(row);
} 
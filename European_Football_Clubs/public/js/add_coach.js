/*
Citation for the following file:
Date: 7/26/2022
Adapted from:
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/add_person.js
*/

// Get the objects we need to modify
let addTrophyForm = document.getElementById('add-coach-form-ajax');

// Modify the objects we need
addTrophyForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCoachName = document.getElementById("input-name");
    let inputHeadCoach = document.getElementById("input-is_head_coach");
    let inputTeamId = document.getElementById("mySelect");

    // Get the values from the form fields
    let coachNameValue = inputCoachName.value;
    let teamId = inputTeamId.value;
    let headCoachValue = inputHeadCoach.value;

    // Put our data we want to send in a javascript object
    let data = {
        coach_name: coachNameValue,
        team_id: teamId,
        is_head_coach: headCoachValue
        
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-coach-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        console.log(inputTeamId)
        console.log(xhttp.readyState)
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputCoachName.value = '';
            inputHeadCoach.value = '';
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
    let currentTable = document.getElementById("coach-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);

    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let coachNameCell = document.createElement("TD");
    let teamCell = document.createElement("TD");
    let headCoachCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.trophy_id;
    coachNameCell.innerText = newRow.coach_name;
    teamCell.innerText = newRow.team_id;
    headCoachCell.innerText = newRow.is_head_coach;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(coachNameCell);
    row.appendChild(teamCell);
    row.appendChild(headCoachCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);
    
    // Add the row to the table
    currentTable.appendChild(row);


    // End of new step 8 code.
}
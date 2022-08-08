/*
Citation for the following file:
Date: 7/26/2022
Adapted from:
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/add_person.js
*/

// Get the objects we need to modify
let addOwnershipForm = document.getElementById('add-ownership-form-ajax');

// Modify the objects we need
addOwnershipForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTeamId = document.getElementById("mySelectTeam");
    let inputOwnerId = document.getElementById("mySelectOwner");

    // Get the values from the form fields
    let teamIdValue = inputTeamId.value;
    let ownerIdValue = inputOwnerId.value;

    // Put data we want to send in a javascript object
    let data = {
        team_id: teamIdValue,
        owner_id: ownerIdValue
    }
    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-ownership-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {

        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputTeamId.value = '';
            inputOwnerId.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from Team_Ownerships
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("ownership-table");

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);

    // Store new row data
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 3 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let teamNameCell = document.createElement("TD");
    let ownerNameCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.ID;
    teamNameCell.innerText = newRow.Team;
    ownerNameCell.innerText = newRow.Owner;

    /*
    Citation for the following code block creating Delete button for new row:
    Date: 7/26/2022
    Adapted from:
    Source URL: https://stackoverflow.com/questions/15315315/how-do-i-add-a-button-to-a-td-using-js
    */
    let btn = document.createElement('input');
    btn.type = "button";
    btn.className = "btn";
    btn.value = "Delete";
    btn.onclick = function(){
        deleteOwnership(newRow.ID);
    };
    
    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(teamNameCell);
    row.appendChild(ownerNameCell);
    row.appendChild(btn);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.ID);
    
    // Add the row to the table
    currentTable.appendChild(row);
}
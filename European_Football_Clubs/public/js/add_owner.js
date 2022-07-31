/*
Citation for the following file:
Date: 7/26/2022
Adapted from:
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/add_person.js
*/

// Get the objects we need to modify
let addOwnerForm = document.getElementById('add-owner-form-ajax');

// Modify the objects we need
addOwnerForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOwnerName = document.getElementById("input-name");
    let inputNationality = document.getElementById("input-nationality");
    let inputAge = document.getElementById("input-age");


    // Get the values from the form fields
    let ownerNameValue = inputOwnerName.value;
    let nationalityValue = inputNationality.value;
    let ageValue = inputAge.value;

    // Put our data we want to send in a javascript object
    let data = {
        owner_name: ownerNameValue,
        owner_nationality: nationalityValue,
        owner_age: ageValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-owner-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputOwnerName.value = '';
            inputNationality.value = '';
            inputAge.value = '';
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
    let currentTable = document.getElementById("owner-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let ownerNameCell = document.createElement("TD");
    let nationalityCell = document.createElement("TD");
    let ageCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.owner_id;
    ownerNameCell.innerText = newRow.owner_name;
    nationalityCell.innerText = newRow.owner_nationality;
    ageCell.innerText = newRow.owner_age;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteOwner(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(ownerNameCell);
    row.appendChild(nationalityCell);
    row.appendChild(ageCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.owner_name;
    option.value = newRow.owner_id;
    selectMenu.add(option);
    // End of new step 8 code.
}
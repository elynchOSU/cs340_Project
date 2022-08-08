/*
Citation for the following file:
Date: 7/26/2022
Adapted from:
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/update_person.js
*/

// Get the objects to modify
let updateOwnerForm = document.getElementById('update-owner-form-ajax');

// Modify the objects
updateOwnerForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields to get data from
    let inputOwnerID = document.getElementById("mySelect");
    let inputAge = document.getElementById("input-age-update");

    // Get the values from the form fields
    let ownerIdValue = inputOwnerID.value;
    let ageValue = inputAge.value;
    
    // Abort if being bassed NULL for Age - DB does not allow NULL Age value

    if (isNaN(ageValue)) 
    {
        return;
    }

    // Put data we want to send in a javascript object
    let data = {
        owner_id: ownerIdValue,
        owner_age: ageValue,
    }
    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-owner-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, ownerIdValue);
            
            // Clear the input fields for another transaction
            inputOwnerID.value = '';
            inputAge.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, ownerId){
    let parsedData = JSON.parse(data);

    let table = document.getElementById("owner-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       //console.log(parsedData[i].owner_age);
       if (table.rows[i].getAttribute("data-value") == ownerId) {

            // Get the location of the row where we found the matching owner ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of age value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign owner age to our value we updated to
            td.innerHTML = parsedData[i-1].owner_age;
       }
    }
}

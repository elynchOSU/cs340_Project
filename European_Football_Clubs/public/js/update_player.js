/*
Citation for the following file:
Date: 7/26/2022
Adapted from:
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/update_person.js
*/

// Get the objects we need to modify
let updatePlayerForm = document.getElementById('update-player-form-ajax');

// Modify the objects we need
updatePlayerForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputPlayerID = document.getElementById("mySelectPlayer");
    let inputAge = document.getElementById("input-age-update");
    let inputPosition = document.getElementById("input-position-update");
    let inputSalary = document.getElementById("input-salary-update");
    let inputJersey = document.getElementById("input-jersey_number-update");
    let inputTeam = document.getElementById("mySelectTeam");

    // Get the values from the form fields
    let playerIdValue = inputPlayerID.value;
    let ageValue = inputAge.value;
    let positionValue = inputPosition.value;
    let salaryValue = inputSalary.value;
    let jerseyValue = inputJersey.value;
    let teamValue = inputTeam.value;
    
    // Abort if being bassed NULL for Age - DB does not allow NULL Age value

    if (isNaN(ageValue)) 
    {
        return;
    }

    // Put data we want to send in a javascript object
    let data = {
        player_id: playerIdValue,
        player_age: ageValue,
        position: positionValue,
        salary: salaryValue,
        jersey_number: jerseyValue,
        team_id: teamValue
    }
    
    // Setup AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-player-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, playerIdValue);
            
            // Clear the input fields for another transaction
            inputPlayerID.value = '';
            inputAge.value = '';
            inputPosition.value = '';
            inputSalary.value = '';
            inputJersey.value = '';
            inputTeam.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, playerId){
    let parsedData = JSON.parse(data);

    let table = document.getElementById("player-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       if (table.rows[i].getAttribute("data-value") == playerId) {

            // Get the location of the row where we found the matching owner ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of age value and update value
            let tdAge = updateRowIndex.getElementsByTagName("td")[2];
            tdAge.innerHTML = parsedData[i-1].player_age;

            // Get td of position value and update value
            let tdPos = updateRowIndex.getElementsByTagName("td")[3];
            tdPos.innerHTML = parsedData[i-1].position;

            // Get td of salary value and update value
            let tdSalary = updateRowIndex.getElementsByTagName("td")[4];
            tdSalary.innerHTML = parsedData[i-1].salary;

            // Get td of jersey value and update value
            let tdJersey = updateRowIndex.getElementsByTagName("td")[5];
            tdJersey.innerHTML = parsedData[i-1].jersey_number;

            // Get td of team value and update value
            let tdTeam = updateRowIndex.getElementsByTagName("td")[6];
            tdTeam.innerHTML = parsedData[i-1].team_id;
       }
    }
}

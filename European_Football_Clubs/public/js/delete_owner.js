/*
Citation for the following file:
Date: 7/26/2022
Adapted from:
Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/blob/main/Step%208%20-%20Dynamically%20Updating%20Data/public/js/delete_person.js
*/

function deleteOwner(ownerID) {
    let link = '/delete-owner-ajax/';
    let data = {
      owner_id: ownerID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(ownerID);
      }
    });
  }
  
  function deleteRow(ownerID){
      let table = document.getElementById("owner-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         //iterate through rows
         //rows would be accessed using the "row" variable assigned in the for loop
         if (table.rows[i].getAttribute("data-value") == ownerID) {
              table.deleteRow(i);
              break;
         }
      }
  }
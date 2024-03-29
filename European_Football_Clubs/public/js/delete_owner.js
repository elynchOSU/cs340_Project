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
  
    // Execute Deletion based on provided ID
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        // Call function to update UI
        deleteRow(data.owner_id);
      }
    });
  }
  
  // Update UI with row removal
  function deleteRow(ownerID){
      let table = document.getElementById("owner-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         //iterate through rows
         if (table.rows[i].getAttribute("data-value") == ownerID) {
              table.deleteRow(i);
              break;
         }
      }
  }
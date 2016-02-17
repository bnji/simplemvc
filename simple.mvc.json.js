/**
 * An extension of the JSON object.
 *
 * @module JSON
 */
var JSON = {
  /**
   * save
   *
   * Saves a JSON object on a remote server.
   *
   * @method save
   * @param {Object} jsonData The JSON object
   * @param {Object} onSuccess
   * @return {Object} jsonData The JSON object
   */
  save : function(jsonData, onSuccess) {
    $.ajax({
      type : "POST",
      url : "//sprotin.azurewebsites.net/simplemvc/savejson.php",
      crossDomain: true,
      dataType : 'json',
      data : {
          json : jsonData
      },
      success : function(result) {
        onSuccess(result);
      },
      error: function (r, t, e) {
        console.log(r);
        console.log(t);
        console.log(e);
        alert('ERROR! See console...');
      }
    });
    return jsonData;
  }
}

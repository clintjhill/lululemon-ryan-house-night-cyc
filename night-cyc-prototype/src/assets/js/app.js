Parse.initialize('oHvIaEjqPA5s3QiQ2DYtT6TxXBhOU97V1EzMptQD', 'c3IeV15NBVtpKgISMbUqKmsu1M2VpV5DoxCseKRS');

$(document).foundation();

var EventInformation = Parse.Object.extend("EventInformation");
var eventInfoQuery = new Parse.Query(EventInformation);

eventInfoQuery.first({
  success: function(eventInfo){
    var bikesLeft = 400 - parseInt(eventInfo.get("participants"),10);
    var frontRowBikesLeft = 40 - parseInt(eventInfo.get("frontRowBikes"),10);
    if(bikesLeft > 0) {
      $(".bikes-left").html(bikesLeft + " left!");
      if(frontRowBikesLeft > 0){
        $(".front-row-bikes-left").html(frontRowBikesLeft + " left!");
      } else {
        $(".front-row-bikes-left").html("Sold Out!");
      }
    } else {
      $(".bikes-left").html("Sold Out!");
      $(".front-row-bikes-left").html("Sold Out!");
    }
  },
  error: function(err){
    console.log('Error', err);
  }
});

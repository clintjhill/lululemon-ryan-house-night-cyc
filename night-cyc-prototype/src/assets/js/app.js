Parse.initialize('oHvIaEjqPA5s3QiQ2DYtT6TxXBhOU97V1EzMptQD', 'c3IeV15NBVtpKgISMbUqKmsu1M2VpV5DoxCseKRS');

var eventInfoQuery = new Parse.Query(EventInformation);

var setEventInformation = function(eventInfo){
  $(".raised-so-far").html(eventInfo.raisedSoFarFormatted());
  $(".goal-amount").html(eventInfo.goalFormatted());
  $(".progress-meter").css({width: eventInfo.goalPercentage()});
  $(".progress-meter-text").html(eventInfo.goalPercentage());

  if(eventInfo.bikesLeft() > 0) {
    $(".bikes-left").html(eventInfo.bikesLeft() + " left!");
    if(eventInfo.frontRowBikesLeft() > 0){
      $(".front-row-bikes-left").html(eventInfo.frontRowBikesLeft() + " left!");
    } else {
      $(".front-row-bikes-left").html("Sold Out!");
    }
  } else {
    $(".bikes-left").html("Sold Out!");
    $(".front-row-bikes-left").html("Sold Out!");
  }
}

var signup = function(evt){
  evt.preventDefault();
  console.log(evt);
}

$(document).foundation();
$("form#sign-up").on('submit', signup);

$(document).ready(function(){
  eventInfoQuery.first({
    success: setEventInformation,
    error: function(err){
      console.log('Error', err);
    }
  });
});

Parse.initialize('oHvIaEjqPA5s3QiQ2DYtT6TxXBhOU97V1EzMptQD', 'c3IeV15NBVtpKgISMbUqKmsu1M2VpV5DoxCseKRS');
Stripe.setPublishableKey('pk_test_mnb2K52AawVfeFUmcuEV7CjJ');

var eventInfoQuery = new Parse.Query("EventInformation");
var eventInformation;

var setEventInformation = function(eventInfo){
  eventInformation = eventInfo; // make it globally available
  $(".raised-so-far").html(eventInfo.raisedSoFarFormatted());
  $(".goal-amount").html(eventInfo.goalFormatted());
  $(".progress-meter").css({width: eventInfo.goalPercentage()});
  $(".progress-meter-text").html(eventInfo.goalPercentage());

  if($(".bikes-left").length > 0){ // if it's on the page
    if(eventInfo.bikesLeft() > 0) { // if they're not sold out
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
}

var updateEventInformation = function(signUp){
  var newAmount = eventInformation.get("totalAmountRaised") + signUp.donationAmount;
  eventInformation.set("totalAmountRaised", newAmount);
  eventInformation.increment("participants");
  if(signUp.frontRow){
    eventInformation.increment("frontRowBikes");
  }
  eventInformation.save();
}

var validForm = function(){
  var invalids = $(".is-invalid-input").length + $(".is-invalid-label").length;
  if(!$("#card-month").val()) invalids ++;
  if(!$("#card-year").val()) invalids ++;
  return invalids === 0;
}

var createSignUpFromForm = function(){
  return {
    email: $("#email").val(),
    spinClass: $("input[data-toggle]:checked").val(),
    frontRow: $("input[name=front-row]:checked").length === 1,
    donationAmount: accounting.unformat($("#donation").val())
  }
}

var stripeResponseHandler = function(status, response){
  console.log("Stripe", status, response);
}

var saveSignUp = function(signUp){
  var SignUp = Parse.Object.extend("SignUp");
  var su = new SignUp();
  su.save(signUp, {
    success: function(signedUp){
      updateEventInformation(signUp);
      Stripe.card.createToken($("form#sign-up"), stripeResponseHandler);
      //window.location = "thanks.html?id=" + signedUp.id
    },
    error: function(signedUp, error){
      console.log("Failed", error, signedUp);
    }
  });
}

var signup = function(evt){
  evt.preventDefault();
  $(this).find('button').prop('disabled', true);

  if(validForm()){
    var signUp = createSignUpFromForm();
    saveSignUp(signUp);
  }
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

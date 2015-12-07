Parse.initialize('oHvIaEjqPA5s3QiQ2DYtT6TxXBhOU97V1EzMptQD', 'c3IeV15NBVtpKgISMbUqKmsu1M2VpV5DoxCseKRS');
Stripe.setPublishableKey('pk_test_mnb2K52AawVfeFUmcuEV7CjJ');

var eventInfoQuery = new Parse.Query("EventInformation");
var eventInformation;

/**
* Sets the event information in the view. Not up to Parse.
*/
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

/**
* Updates the event information up to Parse.
*/
var updateEventInformation = function(signUp){
  var newAmount = eventInformation.get("totalAmountRaisedInCents") + signUp.donationAmountInCents;
  eventInformation.set("totalAmountRaisedInCents", newAmount);
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

var signUpEmail = function(){
  return $("#email").val();
}

var signUpDonation = function(){
  return accounting.unformat($("#donation").val()) * 100; // converted to cents
}

/**
* This creates the object used by Parse to create a SignUp object.
*/
var createSignUpFromForm = function(){
  return {
    email: signUpEmail(),
    spinClass: $("input[data-toggle]:checked").val(),
    frontRow: $("input[name=front-row]:checked").length === 1,
    donationAmountInCents: signUpDonation()
  }
}

/**
* This creates the object used by our Sinatra app to send to Stripe.
*/
var createPayment = function(token){
  return {
    token: token,
    email: signUpEmail(),
    donation: signUpDonation()
  }
}

/**
* This handles the response from Stripes Token creation service.
* If it is successful it will call our /donation service to make
* the full payment to Stripe.
*/
var handleTokenResponseAndMakePayment = function(status, response){
  if(status === 200){
    var token = response.id;
    $.post('/api/donation', createPayment(token), function(response){
      if(response.status == "succeeded" || response.paid == true){
        console.log("Paid", response);
      } else {
        console.log("Failed", response);
      }
    });
  } else {
    console.log("Failed", status, response);
  }
}

/**
* First we call Parse to record signup.
* Second we call Stripe to create a Token.
* Payment is made inside the #handleTokenResponseAndMakePayment function.
*/
var saveSignUp = function(signUp){
  var SignUp = Parse.Object.extend("SignUp");
  var su = new SignUp();
  su.save(signUp, {
    success: function(signedUp){
      updateEventInformation(signUp);
      Stripe.card.createToken($("form#sign-up"), handleTokenResponseAndMakePayment);
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

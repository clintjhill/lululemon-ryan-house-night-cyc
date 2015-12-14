Parse.initialize('oHvIaEjqPA5s3QiQ2DYtT6TxXBhOU97V1EzMptQD', 'c3IeV15NBVtpKgISMbUqKmsu1M2VpV5DoxCseKRS');
Stripe.setPublishableKey('pk_test_mnb2K52AawVfeFUmcuEV7CjJ');

var eventInfoQuery = new Parse.Query("EventInformation");
var classInfoQuery = new Parse.Query("SignUp");
var classCounts = {};
var eventInformation;

/**
* Sets the event information in the view. Not up to Parse.
* Right now this is only on the Home page.
*/
var setEventInformation = function(eventInfo){
  eventInformation = eventInfo; // make it globally available
  $(".raised-so-far").html(eventInfo.raisedSoFarFormatted());
  $(".goal-amount").html(eventInfo.goalFormatted());
  $(".progress-meter").css({width: eventInfo.goalPercentage()});
  $(".progress-meter-text").html(eventInfo.goalPercentage());
  $("#totalBikes").html(eventInfo.get("totalBikes"));
  $("#totalFrontRowBikes").html(eventInfo.get("totalFrontRowBikes"));

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
* Queries a count for each spinClass SignUp object from Parse.
*/
var updateClassCounts = function() {
  var classes = ["madison-phoenix", "madison-tempe", "trucycle", "rpm-spin"];
  $.each(classes, function(index, value){
    delete classInfoQuery._where["spinClass"];
    var spinClass = classes[index];
    classInfoQuery.equalTo("spinClass", spinClass);
    classInfoQuery.count({
      success: function(count) {
        classCounts[spinClass] = count;
      },
      error: function(err) {
        console.log("Failed to get counts.", err);
      }
    });
  });

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

var isValidForm = function(){
  var invalids = $(".is-invalid-input").length + $(".is-invalid-label").length;
  if(!$("select#spin-class").val()) invalids ++;
  if(!$("select#card-month").val()) invalids ++;
  if(!$("select#card-year").val()) invalids ++;
  return invalids === 0;
}

var signUpEmail = function(){
  return $("#email").val();
}

var signUpDonation = function(){
  return accounting.unformat($("#donation-total").html()) * 100; // converted to cents
}

/**
* Collects the bike and front-row fee as well as any extra amount.
*/
var updateDonationForBikeFee = function(){
  var donationAmount = 0;
  var spinClass = $("select#spin-class").val() !== "";
  var frontRow = $("select#front-row").val() === "yes";
  var extraDonation = parseInt($("input#extra-donation").val(),10) || 0;
  if(spinClass) donationAmount += 25;
  if(frontRow) donationAmount += 25;
  donationAmount += extraDonation;
  $("span#donation-total").html(accounting.formatMoney(donationAmount));
}

/**
* Collects the straight donation amount with no bike fees.
*/
var updateDonationForStraightFee = function(){
  var donationAmount = 0;
  var donation = parseInt($("input#donation").val(), 10) || 0;
  donationAmount += donation;
  $("span#donation-total").html(accounting.formatMoney(donationAmount));
}

var changeDonation = function(evt, option) {
  var option = option[0].id;
  if(option === "donating"){
    updateDonationForStraightFee();
  } else {
    updateDonationForBikeFee();
  }
}

/**
* This creates the object used by Parse to create a SignUp object.
*/
var createSignUpFromForm = function(){
  return {
    email: signUpEmail(),
    spinClass: $("select#spin-class").val(),
    frontRow: $("select#front-row").val() === "yes",
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
        window.location = "/thanks";
      } else {
        window.location = "/failed";
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

  if(isValidForm()){
    $(this).find('button').prop('disabled', true);
    $(this).find('[data-abide-error]').css('display', 'none');
    var signUp = createSignUpFromForm();
    saveSignUp(signUp);
  } else {
    $(this).find('[data-abide-error]').css('display', 'block');
  }
}

/**
* These are all of the 'page ready' things to wire up
*/
$(document).foundation();
$(document).ready(function(){
  $("form#sign-up").on('submit', signup);
  $("select#spin-class").on('change', updateDonationForBikeFee);
  $("select#front-row").on('change', updateDonationForBikeFee);
  $("input#extra-donation").on('change', updateDonationForBikeFee);
  $("input#donation").on('change', updateDonationForStraightFee);
  $(".accordion").on('down.zf.accordion', changeDonation);
  eventInfoQuery.first({
    success: setEventInformation,
    error: function(err){
      console.log('Error', err);
    }
  });
  if($("select#spin-class").length){
    updateClassCounts();
  }
});

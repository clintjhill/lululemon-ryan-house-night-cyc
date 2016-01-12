var eventInfoQuery = new Parse.Query("EventInformation");
var classInfoQuery = new Parse.Query("SignUp");

var classes = ["madison-phoenix", "madison-tempe-1", "madison-tempe-2", "amb-bad-ass", "rpm-spin"];
var classCounts = {total: 0};
var eventInformation;
var currentSignup;

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
  var promises = [];
  $.each(classes, function(index, value){
    delete classInfoQuery._where["spinClass"];
    var spinClass = classes[index];
    classInfoQuery.equalTo("spinClass", spinClass);
    promises.push(classInfoQuery.find({
      success: function(results) {
        if(results.length > 0){
          var thisClass = results[0].get("spinClass");
          var count = results.length;
          var frontRow = 0;
          classCounts.total += count;
          for (var i = 0; i < count; i++) {
            frontRow += (results[i].get("frontRow")) ? 1 : 0;
          }
          classCounts[thisClass] = {count: count, frontRow: frontRow};
        } else {
          classCounts[spinClass] = {count: 0, frontRow: 0};
        }
      },
      error: function(err) {
        console.log("Failed to get counts.", err);
      }
    }));
  });
  Parse.Promise.when(promises).then(showAvailableOrRemoveBikes);
}

var showAvailableOrRemoveBikes = function(){
  if(classCounts.total < eventInformation.get("totalBikes")){
    updateClassAvailabilites();
  } else {
    removeBikesOption();
  }
}

var removeBikesOption = function(){
  $("a[href=#spinning]").html("We are sold out of bikes!");
  $("div#spinning").html("We are sold out of bikes!");
  $("a[href=#donating]").trigger("click");
}

/**
* Sets the dropdown with proper SOLD OUT notices and removes
* value of option so that it can't be validated.
*/
var updateClassAvailabilites = function(){
  var bikesPerClass = eventInformation.get("bikesPerClass");
  $.each(classCounts, function(key, value){
    if($("form#sign-up").length > 0){ // on the sign-up page
      if(value.count >= bikesPerClass){
        var original = $("select#spin-class").find("option[value="+key+"]").html();
        // set HTML before killing the value
        $("select#spin-class").find("option[value="+key+"]").html("SOLD OUT: " + original);
        $("select#spin-class").find("option[value="+key+"]").val("");
      }
    } else { // on the home page
      var soldOut = "&nbsp;<span class='label alert'>SOLD OUT!</span>";
      var bikesLeft = bikesPerClass - value.count;
      if(bikesLeft <= 0){
        $("strong#" + key).html(0);
        $("strong#" + key).parent().append(soldOut);
      } else {
        $("strong#" + key).html(bikesLeft);
      }
    }
  });
}

/**
* Updates the event information up to Parse.
*/
var updateEventInformation = function(signUp){
  var currentAmount = eventInformation.get("totalAmountRaisedInCents") || 0;
  var newAmount = currentAmount + signUp.donationAmountInCents;
  eventInformation.set("totalAmountRaisedInCents", newAmount);
  if(signUp.spinClass){
    eventInformation.increment("participants");
  }
  if(signUp.frontRow){
    eventInformation.increment("frontRowBikes");
  }
  eventInformation.save();
}

var isValidForm = function(){
  var invalids = $(".is-invalid-input").length + $(".is-invalid-label").length;
  if(isRiding()){
    if(!$("select#spin-class").val()) {
      $("select#spin-class").addClass("is-invalid-input");
      invalids ++;
    }
  } else {
    if(!$("input#donation").val()) {
      $("input#donation").addClass("is-invalid-input");
      invalids ++;
    }
  }
  if(!$("select#card-month").val()) {
    $("select#card-month").addClass("is-invalid-input");
    invalids ++;
  }
  if(!$("select#card-year").val()) {
    $("select#card-year").addClass("is-invalid-input");
    invalids ++;
  }
  return invalids === 0;
}

var isRiding = function(){
  return $("div[aria-hidden=false]")[0].id === "spinning";
}

var signUpEmail = function(){
  return $("#email").val();
}

var signUpDonation = function(){
  return accounting.unformat($("#donation-total").html()) * 100; // converted to cents
}

var changeClass = function(){
  showFrontRowAvailable();
  updateDonationForBikeFee();
}

var showFrontRowAvailable = function(){
  var selectedClass = $("#spin-class").val();
  if(selectedClass.length > 0){
    var frontRowCount = classCounts[selectedClass].frontRow;
    if(frontRowCount === eventInformation.get("frontRowPerClass")){
      $("#front-row").prop("disabled", true);
      $("#front-row").find("option[value='']").html("Sold Out!");
      $("#front-row").find("option[value='']").prop("selected", "selected");
    }
  }
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

/**
* When user changes the option to ride or not this updates donations.
*/
var changeDonation = function(evt, option) {
  var toggle = option[0].id;
  if(toggle === "donating"){
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
    var paymentObject = createPayment(token);
    makePayment(paymentObject);
  } else {
    goToPage("/failed");
  }
}

/**
* Sending the payment object our payment API.
*/
var makePayment = function(paymentObject){
  $.post('/api/donation', paymentObject, handlePaymentResponse);
}

var handlePaymentResponse = function(response){
  if(response.status == "succeeded" || response.paid == true){
    goToPage("/thanks/" + currentSignup.id);
  } else {
    goToPage("/failed");
  }
}

var signUpObject = function(){
  var SignUp = Parse.Object.extend("SignUp");
  return new SignUp();
}

/**
* First we call Parse to record signup.
* Second we call Stripe to create a Token.
* Payment is made inside the #handleTokenResponseAndMakePayment function.
*/
var saveSignUp = function(signUp){
  var su = signUpObject();
  su.save(signUp, {
    success: function(signedUp){
      currentSignup = signedUp;
      updateEventInformation(signUp);
      Stripe.card.createToken($("form#sign-up"), handleTokenResponseAndMakePayment);
    },
    error: function(signedUp, error){
      goToPage("/failed");
    }
  });
}

var signup = function(evt){
  evt.preventDefault();

  if(isValidForm()){
    $(this).find('button').prop('disabled', true);
    $(this).find('button').addClass('disabled');
    $(this).find('[data-abide-error]').css('display', 'none');
    var signUp = createSignUpFromForm();
    saveSignUp(signUp);
  } else {
    $(this).find('[data-abide-error]').css('display', 'block');
  }
}

var goToPage = function(page){
  window.location = page;
}

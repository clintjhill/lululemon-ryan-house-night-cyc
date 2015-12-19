Parse.initialize('oHvIaEjqPA5s3QiQ2DYtT6TxXBhOU97V1EzMptQD', 'c3IeV15NBVtpKgISMbUqKmsu1M2VpV5DoxCseKRS');
// Stripe is added via script tag - not npm'd into this project.
Stripe.setPublishableKey('pk_test_mnb2K52AawVfeFUmcuEV7CjJ');

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
  if($("form#sign-up").length){
    updateClassCounts();
  }
});

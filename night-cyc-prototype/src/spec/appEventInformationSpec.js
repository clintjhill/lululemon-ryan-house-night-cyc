describe("event information (Parse)", function(){

  beforeEach(function(){
    window.eventInformation = jasmine.createSpyObj("eventInfo", ["set", "increment", "save"]);
    window.eventInformation.get = function(){}
    spyOn(window.eventInformation, "get").and.returnValue(24);
  });

  it("should increment participants", function(){
    window.updateEventInformation({donationAmountInCents: 3200, spinClass: "yes", frontRow: false});
    expect(window.eventInformation.get).toHaveBeenCalled();
    expect(window.eventInformation.set).toHaveBeenCalledWith("totalAmountRaisedInCents", 3224);
    expect(window.eventInformation.increment).toHaveBeenCalledWith("participants");
    expect(window.eventInformation.increment).not.toHaveBeenCalledWith("frontRowBikes");
    expect(window.eventInformation.save).toHaveBeenCalled();
  });

  it("should increment front row", function(){
    window.updateEventInformation({donationAmountInCents: 3200, spinClass: "yes", frontRow: true});
    expect(window.eventInformation.get).toHaveBeenCalled();
    expect(window.eventInformation.set).toHaveBeenCalledWith("totalAmountRaisedInCents", 3224);
    expect(window.eventInformation.increment).toHaveBeenCalledWith("frontRowBikes");
    expect(window.eventInformation.increment).toHaveBeenCalledWith("participants");
    expect(window.eventInformation.save).toHaveBeenCalled();
  });

});

describe("event information with bikes left (On screen)", function(){
  var eventInfo = {
    raisedSoFarFormatted: function(){ return "$5.00"; },
    goalFormatted: function(){ return "$3,000"; },
    goalPercentage: function(){ return 45; },
    get: function(which) { return (which === "totalBikes") ? 50 : 5; },
    bikesLeft: function() { return 2; },
    frontRowBikesLeft: function(){ return 3; }
  };

  beforeEach(function(){
    window.document.body.innerHTML =
      '<span class="raised-so-far"></span>' +
      '<span class="goal-amount"></span>' +
      '<span class="progress-meter-text"></span>' +
      '<span id="totalBikes"></span>' +
      '<span id="totalFrontRowBikes"></span>' +
      '<span class="bikes-left"></span>' +
      '<span class="front-row-bikes-left"></span>';
    window.setEventInformation(eventInfo);
  });

  it("should show money raised so far", function(){
    expect($(".raised-so-far")).toHaveHtml("$5.00");
    expect($(".goal-amount")).toHaveHtml("$3,000");
  });

  it("should show correct bike counts", function(){
    expect($("#totalBikes")).toHaveHtml("50");
    expect($("#totalFrontRowBikes")).toHaveHtml("5");
    expect($(".bikes-left")).toHaveHtml("2 left!");
    expect($(".front-row-bikes-left")).toHaveHtml("3 left!");
  });
});

describe("event information with no bikes left (On screen)", function(){
  var eventInfo = {
    raisedSoFarFormatted: function(){ return "$5.00"; },
    goalFormatted: function(){ return "$3,000"; },
    goalPercentage: function(){ return 45; },
    get: function(which) { return (which === "totalBikes") ? 50 : 5; },
    bikesLeft: function() { return 0; },
    frontRowBikesLeft: function(){ return 0; }
  };

  beforeEach(function(){
    window.document.body.innerHTML =
      '<span class="raised-so-far"></span>' +
      '<span class="goal-amount"></span>' +
      '<span class="progress-meter-text"></span>' +
      '<span id="totalBikes"></span>' +
      '<span id="totalFrontRowBikes"></span>' +
      '<span class="bikes-left"></span>' +
      '<span class="front-row-bikes-left"></span>';
    window.setEventInformation(eventInfo);
  });

  it("should show money raised so far", function(){
    expect($(".raised-so-far")).toHaveHtml("$5.00");
    expect($(".goal-amount")).toHaveHtml("$3,000");
  });

  it("should show correct bike counts", function(){
    expect($("#totalBikes")).toHaveHtml("50");
    expect($("#totalFrontRowBikes")).toHaveHtml("5");
    expect($(".bikes-left")).toHaveHtml("Sold Out!");
    expect($(".front-row-bikes-left")).toHaveHtml("Sold Out!");
  });
});

describe("app form donation", function(){

  describe("toggling riding/donating", function(){

    beforeEach(function(){
      window.document.body.innerHTML =
        '<div id="donating" class="accordion"></div>' +
        '<div id="riding" class="accordion"></div>';
      // make these wired by a function that is called in init.js
      $(".accordion").on('down.zf.accordion', window.changeDonation);
    });

    it("should change when riding/donating toggled", function(){
      expect($("div#donating")).toHandleWith('down.zf.accordion', window.changeDonation);
    });

  });

  describe("changing donation type on toggle", function(){

    beforeEach(function(){
      spyOn(window, "updateDonationForBikeFee");
      spyOn(window, "updateDonationForStraightFee");
    });

    it("should call straight fee when toggled", function(){
      window.changeDonation({}, [{id:'donating'}]);
      expect(window.updateDonationForStraightFee).toHaveBeenCalled();
    });

    it("should call bike fee when toggled", function(){
      window.changeDonation({}, [{id:'riding'}]);
      expect(window.updateDonationForBikeFee).toHaveBeenCalled();
    });

  });

  describe("updating donation for riding", function(){

    beforeEach(function(){
      window.document.body.innerHTML = '<span id="donation-total"></span>';
    });

    it("should total with front row", function(){
      window.document.body.innerHTML +=
        '<select id="spin-class"><option value="x">x</option></select>' +
        '<select id="front-row"><option value="yes">x</option></select>';
      window.updateDonationForBikeFee();
      expect($("#donation-total")).toHaveText("$50.00");
    });

    it("should total without front row", function(){
      window.document.body.innerHTML +=
        '<select id="spin-class"><option value="x">x</option></select>' +
        '<select id="front-row"><option value="no">x</option></select>';
      window.updateDonationForBikeFee();
      expect($("#donation-total")).toHaveText("$25.00");
    });

    it("should total with extra donation", function(){
      window.document.body.innerHTML +=
        '<select id="spin-class"><option value="x">x</option></select>' +
        '<select id="front-row"><option value="no">x</option></select>' +
        '<input id="extra-donation" value="3" />';
      window.updateDonationForBikeFee();
      expect($("#donation-total")).toHaveText("$28.00");
    });

  });

  describe("updating donation without riding", function(){

    beforeEach(function(){
      window.document.body.innerHTML = '<span id="donation-total"></span>';
    });

    it("should show the correct amount in the total", function(){
      window.document.body.innerHTML += '<input id="donation" value="4"/>';
      window.updateDonationForStraightFee();
      expect($("#donation-total")).toHaveText("$4.00");
    });

  });

  describe("donation amount", function(){

    it("should unformat from currency", function(){
      window.document.body.innerHTML =
        '<span id="donation-total">$43.00</span>';
      expect(window.signUpDonation()).toEqual(4300);
    });

    it("should convert to cents", function(){
      window.document.body.innerHTML =
        '<span id="donation-total">$43.05</span>';
      expect(window.signUpDonation()).toEqual(4305);
    });

  });

});

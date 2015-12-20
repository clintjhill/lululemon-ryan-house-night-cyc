describe("app form signup", function(){

  describe("signUp model", function(){
    it("should return complete signUp model", function(){
      window.document.body.innerHTML =
        '<input id="email" value="clint.hill@gmail.com" />' +
        '<select id="spin-class"><option value="madison">madison</option></select>' +
        '<select id="front-row"><option value="yes">Yes</option></select>' +
        '<span id="donation-total">$40.00</span>';

      var signUp = window.createSignUpFromForm();

      expect(signUp.email).toBe("clint.hill@gmail.com");
      expect(signUp.spinClass).toBe("madison");
      expect(signUp.frontRow).toBe(true);
      expect(signUp.donationAmountInCents).toBe(4000);
    });
  });

  describe("saving signup", function(){
    var mockSave = jasmine.createSpyObj("mockSave", ["save"]);
    window.signUpObject = jasmine.createSpy("signUpObject").and.returnValue(mockSave);

    beforeEach(function(){
      window.saveSignUp(window.createSignUpFromForm());
    });

    it("should call Parse save on Signup", function(){
      expect(window.signUpObject).toHaveBeenCalled();
      expect(mockSave.save).toHaveBeenCalled();
      expect(mockSave.save.calls.argsFor(0)[0]).toEqual({
        email: "clint.hill@gmail.com",
        spinClass: "madison",
        frontRow: true,
        donationAmountInCents: 4000
      });
    });

    describe("Parse save success", function(){

      beforeEach(function(){
        var success = mockSave.save.calls.argsFor(0)[1].success;
        spyOn(window, "updateEventInformation");
        spyOn(Stripe.card, "createToken");
        success({});
      });

      it("should update event information", function(){
        expect(window.updateEventInformation).toHaveBeenCalled();
      });

      it("should call Stripe for token", function(){
        expect(Stripe.card.createToken).toHaveBeenCalled();
      });

    });

    describe("Parse save error", function(){

      beforeEach(function(){
        var error = mockSave.save.calls.argsFor(0)[1].error;
        spyOn(window, "goToPage");
        error({}, "Fake Error");
      });

      it("should send user to failed page", function(){
        expect(window.goToPage).toHaveBeenCalledWith("/failed");
      });

    });

  });
});

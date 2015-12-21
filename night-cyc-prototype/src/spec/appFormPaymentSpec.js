describe("app form payment", function(){

  it("should create proper token", function(){
    window.document.body.innerHTML =
      '<span id="donation-total">$39.00</span>' +
      '<input id="email" value="clint.hill@gmail.com"/>';
    var paymentObject = window.createPayment("clint");
    expect(paymentObject.token).toEqual("clint");
    expect(paymentObject.email).toEqual("clint.hill@gmail.com");
  });

  describe("handling the response from Stripe token creation", function(){

    beforeEach(function(){
      spyOn(window, "goToPage");
      spyOn(window, "makePayment");
      spyOn(window, "createPayment").and.returnValue({
        token: "test",
        email: "clint.hill@gmail.com",
        donation: 390000
      });
      window.currentSignup = {id: "testing" };
    });

    it("should post payment for success", function(){
      window.handleTokenResponseAndMakePayment(200, {id: "test"});
      expect(window.createPayment).toHaveBeenCalledWith("test");
      expect(window.makePayment).toHaveBeenCalledWith({
        token: "test",
        email: "clint.hill@gmail.com",
        donation: 390000
      });
    });

    it("should handle payment response", function(){
      window.handlePaymentResponse({status: "succeeded"});
      expect(window.goToPage).toHaveBeenCalledWith("/thanks/testing");
    });

    it("should go to failed page on error", function(){
      window.handleTokenResponseAndMakePayment(111, {});
      expect(window.goToPage).toHaveBeenCalledWith("/failed");
    });

  });

});

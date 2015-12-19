describe("app form validation", function(){

  beforeEach(function(){
    // really doesn't matter - could be tre
    window.isRiding = jasmine.createSpy("isRiding").and.returnValue(true);
  });

  it("should be invalid if email is missing", function(){
    window.document.body.innerHTML =
      '<input id="email" class="is-invalid-input" />' +
      '<select id="card-month"><option value="x">Month</option></select>' +
      '<select id="card-year"><option value="x">Year</option></select>';
    expect(window.isValidForm()).toBe(false);
  });

  it("should be invalid if cardholder is missing", function(){
    window.document.body.innerHTML =
      '<input id="cardholder-name" class="is-invalid-input" />' +
      '<select id="card-month"><option value="x">Month</option></select>' +
      '<select id="card-year"><option value="x">Year</option></select>';
    expect(window.isValidForm()).toBe(false);
  });

  it("should be invalid if card is missing", function(){
    window.document.body.innerHTML =
      '<input id="credit-card" class="is-invalid-input" />' +
      '<select id="card-month"><option value="x">Month</option></select>' +
      '<select id="card-year"><option value="x">Year</option></select>';
    expect(window.isValidForm()).toBe(false);
  });

  it("should be invalid if CVC is missing", function(){
    window.document.body.innerHTML =
      '<input id="card-csc" class="is-invalid-input" />' +
      '<select id="card-month"><option value="x">Month</option></select>' +
      '<select id="card-year"><option value="x">Year</option></select>';
    expect(window.isValidForm()).toBe(false);
  });

  it("should be invalid if missing credit card month", function(){
    window.document.body.innerHTML =
      '<select id="spin-class"><option value="x">x</option></select>' +
      '<select id="card-month"><option value>Month</option></select>' +
      '<select id="card-year"><option value="x">Year</option></select>';
    expect(window.isValidForm()).toBe(false);
  });

  it("should be invalid if missing credit card year", function(){
    window.document.body.innerHTML =
      '<select id="spin-class"><option val="x">x</option></select>' +
      '<select id="card-month"><option value>Month</option></select>' +
      '<select id="card-year"><option value>Year</option></select>';
    expect(window.isValidForm()).toBe(false);
  });

});

describe("app form while riding", function(){

  beforeEach(function(){
    window.isRiding = jasmine.createSpy("isRiding").and.returnValue(true);
  });

  it("should be valid if class chosen", function(){
    window.document.body.innerHTML =
      '<select id="spin-class"><option value="x">x</option></select>' +
      '<select id="card-month"><option value="x">Month</option></select>' +
      '<select id="card-year"><option value="x">Year</option></select>';
    expect(window.isValidForm()).toBe(true);
  });

  it("should be invalid if no class chosen", function(){
    window.document.body.innerHTML =
      '<select id="spin-class"><option value>x</option></select>' +
      '<select id="card-month"><option value="x">Month</option></select>' +
      '<select id="card-year"><option value="x">Year</option></select>';
    expect(window.isValidForm()).toBe(false);
  });

});

describe("app form while donating", function(){

  beforeEach(function(){
    window.isRiding = jasmine.createSpy("isRiding").and.returnValue(false);
  });

  it("should be invalid if no donation", function(){
    window.document.body.innerHTML =
      '<input id="donation" type="text" class="is-invalid-input" />' +
      '<select id="card-month"><option value="x">Month</option></select>' +
      '<select id="card-year"><option value="x">Year</option></select>';
    expect(window.isValidForm()).toBe(false);
  });

});

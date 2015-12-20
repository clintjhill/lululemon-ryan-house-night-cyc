describe("front-row availability", function(){

  beforeEach(function(){
    window.document.body.innerHTML =
      '<select id="spin-class">' +
        '<option value="madison-phoenix">x</option>' +
      '</select>' +
      '<select id="front-row">' +
        '<option value>Front Row?</option>' +
        '<option value="yes">Yes</option>' +
        '<option value="no">No</option>' +
      '</select>';

  });

  it("should show available per class", function(){
    window.classCounts = {
      "madison-phoenix": { count: 50, frontRow: 5 }
    };
    window.showFrontRowAvailable();
    expect($("#front-row")).not.toBeDisabled();
  });

  it("should show sold out per class", function(){
    window.classCounts = {
      "madison-phoenix": { count: 50, frontRow: 18 }
    };
    window.showFrontRowAvailable();
    expect($("#front-row")).toBeDisabled();
    expect($("#front-row").find("option[value='']")).toBeSelected();
    expect($("#front-row").find("option[value='']")).toHaveHtml("Sold Out!");
  });

});

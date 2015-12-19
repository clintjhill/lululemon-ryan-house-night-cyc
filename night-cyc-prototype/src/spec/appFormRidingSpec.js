describe("app form riding toggle", function(){

  it("should be riding if toggled for Hell Yeah", function(){
    window.document.body.innerHTML =
      '<div id="spinning" aria-hidden=false></div>' +
      '<div id="donating" aria-hidden=true></div>';
    expect(window.isRiding()).toBe(true);
  });

  it("should be not riding if toggled for Make it Rain", function(){
    window.document.body.innerHTML =
      '<div id="spinning" aria-hidden=true></div>' +
      '<div id="donating" aria-hidden=false></div>';
    expect(window.isRiding()).toBe(false);
  });
});

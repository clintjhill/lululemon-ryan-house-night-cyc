describe("app bike availability", function(){

  beforeEach(function(){
    window.eventInformation = { get: function(){} };
    spyOn(window.eventInformation, "get").and.returnValue(60);
  });

  describe("no bikes available", function(){

    beforeEach(function(){
      window.document.body.innerHTML =
        '<a href="#spinning"></a>' +
        '<div id="spinning"></div>' +
        '<a href="#donating"></a>';
      spyOnEvent($("a[href=#donating]"), "click");
    });

    it("should change section title", function(){
      window.removeBikesOption();
      expect($("a[href=#spinning]")).toHaveHtml("We are sold out of bikes!");
      expect($("div#spinning")).toHaveHtml("We are sold out of bikes!");
      expect("click").toHaveBeenTriggeredOn($("a[href=#donating]"));
    });

  });

  describe("all bikes available", function(){

    var spinClass;
    beforeEach(function(){
      window.document.body.innerHTML =
        '<select id="spin-class">' +
          '<option value="madison-tempe">Madison Tempe</option>' +
          '<option value="madison-phx">Madison Phoenix</option>' +
          '<option value="rpm-spin">RPM Spin</option>' +
        '</select>';

      spinClass = $("select#spin-class");
      window.classCounts = {
        "madison-tempe": { count: 5, frontRow: 2 },
        "madison-phx": { count: 10, frontRow: 1 },
        "rpm-spin": { count: 20, frontRow: 0 }
      };
      window.updateClassAvailabilites();
    });

    it("should show available when less event total per class", function(){
      expect(spinClass.find("option[value=madison-tempe]")).toHaveHtml("Madison Tempe");
      expect(spinClass.find("option[value=madison-phx]")).toHaveHtml("Madison Phoenix");
      expect(spinClass.find("option[value=rpm-spin]")).toHaveHtml("RPM Spin");
    });

  });

  describe("some bikes available", function(){

    var spinClass, madisonTempe, madisonPhoenix, rpmSpin;
    beforeEach(function(){
      window.document.body.innerHTML =
        '<select id="spin-class">' +
          '<option value="madison-tempe">Madison Tempe</option>' +
          '<option value="madison-phx">Madison Phoenix</option>' +
          '<option value="rpm-spin">RPM Spin</option>' +
        '</select>';

      spinClass = $("select#spin-class");
      window.classCounts = {
        "madison-tempe": { count: 5, frontRow: 0 },
        "madison-phx": { count: 60, frontRow: 0 },
        "rpm-spin": { count: 20, frontRow: 1 }
      };
      madisonTempe = spinClass.find("option[value=madison-tempe]");
      madisonPhoenix = spinClass.find("option[value=madison-phx]");
      rpmSpin = spinClass.find("option[value=rpm-spin]");
      window.updateClassAvailabilites();
    });

    it("should show SOLD OUT for class", function(){
      expect(madisonTempe).toHaveHtml("Madison Tempe");
      expect(madisonPhoenix).toHaveHtml("SOLD OUT: Madison Phoenix");
      expect(madisonPhoenix).toHaveValue("");
      expect(rpmSpin).toHaveHtml("RPM Spin");
    });

  });

});

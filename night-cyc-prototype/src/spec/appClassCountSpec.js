describe("app class count", function(){

  beforeEach(function(){
    spyOn(window.Parse.Promise, "when").and.returnValue({then: function(){}});
    spyOn(window.classInfoQuery, "find");
  });

  it("should update classCount object with count and frontRow", function(){
    window.updateClassCounts();
    var madPhx = window.classInfoQuery.find.calls.first().args[0].success;
    var rpm = window.classInfoQuery.find.calls.mostRecent().args[0].success;
    madPhx([
      {spinClass: "madison-phoenix", frontRow: true},
      {spinClass: "madison-phoenix", frontRow: true},
      {spinClass: "madison-phoenix", frontRow: true},
      {spinClass: "madison-phoenix", frontRow: true},
      {spinClass: "madison-phoenix", frontRow: false}
    ]);
    rpm([
      {spinClass: "rpm-spin", frontRow: true},
      {spinClass: "rpm-spin", frontRow: false}
    ]);
    expect(window.classCounts["madison-phoenix"].count).toEqual(5);
    expect(window.classCounts["madison-phoenix"].frontRow).toEqual(4);

    expect(window.classCounts["rpm-spin"].count).toEqual(2);
    expect(window.classCounts["rpm-spin"].frontRow).toEqual(1);
  });

});

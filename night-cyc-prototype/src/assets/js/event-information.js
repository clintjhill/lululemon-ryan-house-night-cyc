var EventInformation = Parse.Object.extend("EventInformation", {
  bikesLeft: function(){
    var totalBikes = this.get("totalBikes");
    var participants = this.get("participants");
    return totalBikes - participants;
  },
  frontRowBikesLeft: function(){
    var totalFrontRowBikes = this.get("totalFrontRowBikes");
    var frontRowBikes = this.get("frontRowBikes");
    return totalFrontRowBikes - frontRowBikes;
  },
  raisedSoFar: function(){
    return this.get("totalAmountRaisedInCents") / 100; // converted from cents to dollars
  },
  raisedSoFarFormatted: function(){
    return accounting.formatMoney(this.raisedSoFar());
  },
  goal: function(){
    return this.get("totalAmountGoal");
  },
  goalFormatted: function(){
    return accounting.formatMoney(this.goal());
  },
  goalPercentage: function(){
    var raised = this.get("totalAmountRaisedInCents") / 100; //converted from cents to dollars
    var goal = this.get("totalAmountGoal");
    if(raised > 0){
      var str = parseInt(raised/goal*100,10);
      return str + "%";
    } else {
      return "0%";
    }
  }
});

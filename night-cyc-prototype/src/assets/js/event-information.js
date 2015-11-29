var EventInformation = Parse.Object.extend("EventInformation", {
  bikesLeft: function(){
    return 400 - parseInt(this.get("participants"), 10);
  },
  frontRowBikesLeft: function(){
    return 40 - parseInt(this.get("frontRowBikes"), 10);
  },
  raisedSoFar: function(){
    return parseInt(this.get("totalAmountRaised"), 10);
  },
  raisedSoFarFormatted: function(){
    return this.raisedSoFar().toLocaleString('en-US', {style: 'currency', currency: 'USD'});
  },
  goal: function(){
    return parseInt(this.get("totalAmountGoal"), 10);
  },
  goalFormatted: function(){
    return this.goal().toLocaleString('en-US', {style: 'currency', currency: 'USD'});
  },
  goalPercentage: function(){
    var raised = this.get("totalAmountRaised");
    var goal = this.get("totalAmountGoal");
    if(raised > 0){
      var str = parseInt(raised/goal*100, 10);
      return str + "%";
    } else {
      return "0%";
    }
  }
});

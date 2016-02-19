var Pot = Pot || {}; // Pot: Class, Worker, Monatsplan

Pot.Plan = function(data) {
    this.year = data.year;
    this.days = data.days;
    this.month = data.month;
    this.list = data.list;
    this.worker = data.worker;
};  

Pot.Plan.prototype = {
    constructor: Pot.Plan,
    
};
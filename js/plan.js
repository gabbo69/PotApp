var Pot = Pot || {}; // Pot: Class, Worker, Monatsplan

Pot.Plan = function(data) {
    this.days = data.days;
    this.maxDays = 31;
    this.month = data.month;
    
    var i = 0;
    this.worker = [];
    
    for(i = 0; i < data.worker.length; i++){
        var currentWorker = data.worker[i];
        this.worker[i] = new Pot.Worker(currentWorker.id, currentWorker.name, currentWorker.role); 
    }
    
    this.worker = data.worker;
};  

Pot.Plan.prototype = {
    constructor: Pot.Plan,
    getDay: function(day) {
        return this.days[day-1];
    }
};
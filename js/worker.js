var Pot = Pot || {}; // Pot: Class, Worker, Monatsplan

Pot.Worker = function(id,name, role) {
    this.id=id;
    this.name = name;
    this.role = role;
    this.text = "";
    this.min = 0;
    this.max = 0;
}  

Pot.Worker.prototype = {
    constructor: Pot.Worker,
    getName: function() {
        return this.name;
    },
    setAttr: function (text, min, max) {
        this.text = text;
        this.min = min;
        this.max = max;
    },
    sayHello: function(){
        console.log("Hello");
    }
}


Pot.Koch = function(name, role, meals) {
    this.base = Pot.Worker;
    this.base(name, role);
    
    this.meals = meals;
}  

Pot.Koch.prototype = {
    constructor: Pot.Koch,
    getName: function() {
        return this.name;
    }
}
var Pot = Pot || {}; // Pot: Class, Worker, Monatsplan

Pot.Worker = function(id,name,text,min,max) {
    this.id=id;
    this.name = name;
    
    this.text = text;
    this.min = min;
    this.max = max;
};  

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
};


Pot.Koch = function(name, role, meals) {
    this.base = Pot.Worker;
    this.base(name, role);
    
    this.meals = meals;
};  

Pot.Koch.prototype = {
    constructor: Pot.Koch,
    getName: function() {
        return this.name;
    }
};
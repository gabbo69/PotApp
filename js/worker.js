var Pot = Pot || {}; // Pot: Class, Worker, Monatsplan

Pot.Worker = function(id,name,text,max) {
    this.id=id;
    this.name = name;    
    this.text = text;
    this.max = max;
    this.rezepte = {};
};  

Pot.Worker.prototype = {
    constructor: Pot.Worker,
    getName: function() {
        return this.name;
    },
    setAttr: function (text, max) {
        this.text = text;
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
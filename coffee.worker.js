var Koch, Pot,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Pot = Pot || {};

Pot.Worker = (function() {
  function Worker(id, name, role, text, min, max) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.text = text != null ? text : "";
    this.min = min != null ? min : 0;
    this.max = max != null ? max : 0;
  }

  Worker.prototype.getName = function() {
    return this.name;
  };

  Worker.prototype.setAttr = function(text, min, max) {
    this.text = text;
    this.min = min;
    this.max = max;
  };

  return Worker;

})();

Koch = (function(_super) {
  __extends(Koch, _super);

  function Koch(meals) {
    this.meals = meals;
  }

  Koch.prototype.getName = function() {
    return this.name;
  };

  return Koch;

})(Worker);

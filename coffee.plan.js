var Pot;

Pot = Pot || {};

Pot.Plan = (function() {
  function Plan(data, maxDays) {
    var worker, _i, _len, _ref;
    this.data = data;
    this.maxDays = maxDays != null ? maxDays : 31;
    this.days = this.data.days;
    this.month = this.data.month;
    this.worker = this.data.worker;
    _ref = this.worker;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      worker = _ref[_i];
      worker = new Pot.Worker(worker.id, worker.name, worker.role);
    }
  }

  Plan.prototype.getDay = function() {
    return this.day;
  };

  Plan.prototype.setDay = function(day) {
    return this.day = day;
  };

  return Plan;

})();

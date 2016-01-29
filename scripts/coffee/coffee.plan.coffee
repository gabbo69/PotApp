Pot = Pot or {}

class Pot.Plan
    constructor: (@data, @maxDays = 31) ->
        @days = @data.days
        @month = @data.month
        
        @worker = @data.worker
        
        for worker in @worker
            worker = new Pot.Worker worker.id, worker.name, worker.role
        
    getDay: -> @day
    
    setDay: (day) -> @day = day
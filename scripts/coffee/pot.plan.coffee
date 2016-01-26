# coffeelint: disable=max_line_length

###
*
* pot.plan.coffee
*
* PotApp
*
* Created by Julian Kleine on 26. Jan 2016
* Copyright Potschamperl 2016. All rights reserved.
*
###

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
# coffeelint: disable=max_line_length

###
*
* pot.worker.coffee
*
* PotApp
*
* Created by Julian Kleine on 26. Jan 2016
* Copyright Potschamperl 2016. All rights reserved.
*
###

Pot = Pot or {}

class Pot.Worker
  constructor: (@id, @name, @role, @text = "", @min = 0, @max = 0) ->

  getName: -> @name

  setAttr: (text, min, max) ->
    @text = text
    @min = min
    @max = max
    return


class Koch extends Worker
  constructor: (@meals) ->

  getName: -> @name
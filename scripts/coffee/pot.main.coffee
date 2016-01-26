# coffeelint: disable=max_line_length

###
*
* pot.main.coffee
*
* PotApp
*
* Created by Julian Kleine on 26. Jan 2016
* Copyright Potschamperl 2016. All rights reserved.
*
###

Pot = Pot or {}

Pot.App = Pot.App or {}
Pot.App.Plan = Pot.App.Plan or {}

$(document).ready ->

  mainContent = $('div#content').load 'partials/inputDate.html', ->
    now = moment()
    year = now.year()
    month = now.month() + 2

    $("input#year").val year
    $("input#month").val month

    return

  # click event bind to toplevel element
  # click event: button#createButton
  $('div#content').on 'click', 'button#createButton', ->
    month = $('input#month').val()
    year =  $('input#year').val()

    $('div#content').load 'partials/inputWorker.html', ->
      getTable().done (data) ->
        createMainObject data.pot
        Pot.App.Table = $('body').potTable worker: Pot.App.Plan.worker, month: month, year: year
        Pot.App.Table.potTable 'loadWorker'
        console.log "loadWorker"
        return
      return
    return

  # click event: button#inserButton
  .on 'click', 'button#insertButton', ->
    Pot.App.Table.potTable "readWorker"

    $('div#content').load 'partials/tableUser.html', ->
      Pot.App.Table.potTable "loadTable"
    return

  # click event: table#tableUser li.workers
  .on 'click', 'table#tableUser li.workers', ->
    if $(this).hasClass "active"
      Pot.App.Table.potTable "setNotActive", this
    else
      Pot.App.Table.potTable "setActive", this
      Pot.App.Table.potTable "preSetTable"
    return

  # click event: button#reloadButton
  .on 'click', 'button#reloadButton', ->
    Pot.App.Table.potTable "reloadTable"
    return

  # click event: table#inputTable input.inputK
  .on 'click', 'table#inputTable input.inputK', ->
    if this.checked
      Pot.App.Table.potTable "addMealRow", $(this).closest 'tr'
    else
      Pot.App.Table.potTable "deleteMealRow", $(this).closest 'tr'
    return

  # click event: table#inputTable input.inputMax
  .on 'click', 'table#inputTable input.inputMax', ->
    $( "table#inputTable input.inputMax" ).keydown()
    return

  # keydown event: table#inputTable input.inputMax
  .on 'keydown', 'table#inputTable input.inputMax', (event) ->
    if event.which == 13
      event.preventDefault
      element = $(this).closest('tr').find('td input.inputK').prop 'checked'
      console.log element

      if $(this).closest('tr').find('td input.inputK').prop 'checked'
        Pot.App.Table.potTable "addMealRow", $(this).closest 'tr'
        console.log "success"
    return

  # click event: table#inputTable input.inputMax
  .on 'click', 'button#saveJSONButton', (event) ->
    file = Pot.App.Table.potTable "getList"
    json = JSON.stringify file

    data = "text/json;charset=utf-8," + encodeURIComponent file
    console.log data
    a = document.createElement 'a'
    a.href = 'data:' + data
    a.download = 'data.json'
    a.innerHTML = 'download'

    container = document.getElementById 'saveJSON'
    container.appendChild a
    return

  # Buttons & Stuff
  $('li#link1').on 'click', ->
    $(this).addClass 'active'
    $('li#link2').removeClass 'active'
    $('html, body').animate scrollTop: $('h1#link1').offset().top, 0
    return


  getTable = ->
    data = $.getJSON '../lib/json/data.json', (json) ->
      console.log 'App starting..'

  createMainObject = (data) ->
    Pot.App.Plan = new Pot.Plan(data)
    return
var Pot, createMainObject, getTable;

Pot = Pot || {};

Pot.App = Pot.App || {};

Pot.App.Plan = Pot.App.Plan || {};

$(document).ready(function() {
  var mainContent;
  mainContent = $('div#content').load('partials/inputDate.html', function() {
    var month, now, year;
    now = moment();
    year = now.year();
    month = now.month() + 2;
    $("input#year").val(year);
    $("input#month").val(month);
  });
  $('div#content').on('click', 'button#createButton', function() {
    var month, year;
    month = $('input#month').val();
    year = $('input#year').val();
    $('div#content').load('partials/inputWorker.html', function() {
      getTable().done(function(data) {
        createMainObject(data.pot);
        Pot.App.Table = $('body').potTable({
          worker: Pot.App.Plan.worker,
          month: month,
          year: year
        });
        Pot.App.Table.potTable('loadWorker');
        console.log("loadWorker");
      });
    });
  }).on('click', 'button#insertButton', function() {
    Pot.App.Table.potTable("readWorker");
    $('div#content').load('partials/tableUser.html', function() {
      return Pot.App.Table.potTable("loadTable");
    });
  }).on('click', 'table#tableUser li.workers', function() {
    if ($(this).hasClass("active")) {
      Pot.App.Table.potTable("setNotActive", this);
    } else {
      Pot.App.Table.potTable("setActive", this);
      Pot.App.Table.potTable("preSetTable");
    }
  }).on('click', 'button#reloadButton', function() {
    Pot.App.Table.potTable("reloadTable");
  }).on('click', 'table#inputTable input.inputK', function() {
    if (this.checked) {
      Pot.App.Table.potTable("addMealRow", $(this).closest('tr'));
    } else {
      Pot.App.Table.potTable("deleteMealRow", $(this).closest('tr'));
    }
  }).on('click', 'table#inputTable input.inputMax', function() {
    $("table#inputTable input.inputMax").keydown();
  }).on('keydown', 'table#inputTable input.inputMax', function(event) {
    var element;
    if (event.which === 13) {
      event.preventDefault;
      element = $(this).closest('tr').find('td input.inputK').prop('checked');
      console.log(element);
      if ($(this).closest('tr').find('td input.inputK').prop('checked')) {
        Pot.App.Table.potTable("addMealRow", $(this).closest('tr'));
        console.log("success");
      }
    }
  }).on('click', 'button#saveJSONButton', function(event) {
    var a, container, data, file, json;
    file = Pot.App.Table.potTable("getList");
    json = JSON.stringify(file);
    data = "text/json;charset=utf-8," + encodeURIComponent(file);
    console.log(data);
    a = document.createElement('a');
    a.href = 'data:' + data;
    a.download = 'data.json';
    a.innerHTML = 'download';
    container = document.getElementById('saveJSON');
    container.appendChild(a);
  });
  return $('li#link1').on('click', function() {
    $(this).addClass('active');
    $('li#link2').removeClass('active');
    $('html, body').animate({
      scrollTop: $('h1#link1').offset().top
    }, 0);
  });
});

getTable = function() {
  var data;
  return data = $.getJSON('../lib/json/data.json', function(json) {
    return console.log('App starting..');
  });
};

createMainObject = function(data) {
  Pot.App.Plan = new Pot.Plan(data);
};

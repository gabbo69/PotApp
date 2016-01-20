var Pot = Pot || {}; // Pot: Class, Worker, Monatsplan

Pot.App = Pot.App || {};
Pot.App.Plan = Pot.App.Plan || {};

$(document).ready(function () {

    // jQuery loaded

    // Buttons & Stuff
    $('li#link1').on("click", function () {
        $(this).addClass('active');
        $('li#link2').removeClass('active');
        $('html, body').animate({
            scrollTop: ($('h1#link1').offset().top)
        }, 0);
    });
    
    $('li#link2').on("click", function () {
        $(this).addClass('active');
        $('li#link1').removeClass('active');
        $('html, body').animate({
            scrollTop: ($('h1#link2').offset().top)
        }, 100);
    });
    
    $('button#createButton').click(function () {
        // show success on button
        $(this).removeClass('btn-default');
        $(this).addClass('btn-success');
        createDates();
    });
    
    $('button#insertButton').click(function () {
        // show success on button
        $(this).removeClass('btn-default');
        $(this).addClass('btn-success');
        getDates();
    });

    // Functions
    function createTableRow(i) {
        // Append a row to table in html
        var row = Pot.App.Plan.days[i];
        var worker = Pot.App.Plan.worker;

        var table = $('table#tableUser tbody');

        var date = new Date(2016, Pot.App.Plan.month-1, row.day);
        var weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

        var startRow = '<tr id="tableDay' + date.getDate() + '"><th scope="row">';
        /*var currDay = row.day > 9 ? "" + row.day: "0" + row.day;
        var currMonth = Pot.App.Plan.month > 9 ? "" + Pot.App.Plan.month: "0" + monatsplan.month;*/

        var th = ("0" + date.getDate()).slice(-2) + '.' + ("0" + (date.getMonth()+1)).slice(-2) + ' - ' + weekdays[date.getDay()] + '</th>';
        
        startRow += th;
        
        var baseDropdown =
            '<td>' +
                '<ul class="workerList">' +
                    // LI ELEMENT
                '</ul>' +
            '</td>';

        var endRow = '</tr>';
        
        table.append(startRow + baseDropdown + baseDropdown + endRow);
        
    }

    function getTable() {
        // get json file
        var data = $.getJSON("../lib/json/2015-dezember.json", function (json) {
            console.log(json);
        });
        return data;
    }

    function createMainObject(data) {
        Pot.App.Plan = new Pot.Plan(data);
    }

    getTable().done(function (data) {
        createMainObject(data.pot);

        for (var i = 0; i < Pot.App.Plan.maxDays; i++) {
            createTableRow(i);
        }
        createDates();
        
        $("ul.workerList").each(function(){
            $(this).sortable({
                revert: true
//                create: function (event, ui) {
//                    sortWorker();
//                }
            });
        });
        
        $('ul.workerList').on("click", "li", function (event) {
            alert($(this).data('worker').name);
        });
        
        $('ul.workerList').sortable("refresh");
    });
});

//creates row
function addDatesRow(worker, maxDays) {

    var table = $('table#inputTable');
    var name = '<tr  id="row' + worker.id + '" ><td>' + worker.name + '</td>';
    var dates = '<td><input class="inputText" type="text"/></td>';
    var times = '<td><input type="number" class="inputMin" min="0"/></td><td><input  type="number" class="inputMax" min="0"/></td></tr>';
    table.append(name + dates + times);
    table.find('input.inputText').val("mo,di,mi,do,fr,sa,so");
}

//creates row in inputTable for every worker
function createDates() {
    var worker = Pot.App.Plan.worker;
    var mlength = worker.length;
    var maxDays = Pot.App.Plan.maxDays;
    for (var i = 0; i < mlength; i++) {
        addDatesRow(worker[i], maxDays);
    };
}

//get the dates from each worker
function getDates() {
    var table = $('table#inputTable tbody tr');
    table.each(function () {
        var id = $(this).attr("id").replace("row", "");
        var text = $(this).find(".inputText").val();
        var min = $(this).find(".inputMin").val();
        var max = $(this).find(".inputMax").val();

        // clear html markup
        saveDates(id,text,min,max);
        
    });
    
    var tableUser = $('table#tableUser ul.workerList');
    
    tableUser.empty();
    
    insertDates();
}

function sortWorker() {
    var tableUser = $('table#tableUser ul.workerList');
    var tableUserLi = tableUser.children('li');
    
    tableUserLi.sort(function(a,b){
        var id1 = $(a).data('worker').id;
        var id2 = $(b).data('worker').id;

        if(id1 < id2) {
            return 1;
        }
        if(id1 > id2) {
            return -1;
        }
        return 0;
    });
    
//    tableUser.append(tableUserLi);
//    tableUser.sortable("refresh");
}

//saves the dates frome each worker
function saveDates(id, text, min, max) {
    var str = id;
    var workerid = str.replace("row", "");
    var worker = Pot.App.Plan.worker[workerid];
    worker.text = text;
    worker.min = min;
    worker.max = max;
    
}
//iserts the Dates from each worker
function insertDates() {
    var month = {};
    var currentMonth = moment("01-01-2016");
    
    
    // <-- create weekdays **
    // 0 - sunday, 1 - monday ....
    var weekdays = {
            "so" : [],
            "mo" : [],
            "di" : [],
            "mi" : [],
            "do" : [],
            "fr" : [],
            "sa" : []
    };
    
    // iterate all days of the current month
    for(var i = 1; i < 31+1; i++) {
        month[i] = {workers: [], notWorkers: []};
//        weekdays[i] = {};
        currentMonth.date(i);
        var numberToWeek = ["so","mo","di","mi","do","fr","sa"];
        var currWeekday = numberToWeek[currentMonth.weekday()];
        weekdays[currWeekday].push(currentMonth.date());
    }

//    console.log("Weekdays: Montage " + weekdays["mo"]);
    // ** create weekdays -->
    
    // <-- all the shit with the worker ** 
    worker = Pot.App.Plan.worker;
    // iterate workers
    for(var j = 0; j < worker.length; ++j) {
        var currentWorker = worker[j];
        var dates = currentWorker.text.split(",");
        var min = currentWorker.min;
        var max = currentWorker.max;
        
//        console.log("Current Worker: " + worker[j].name + " length: " + dates.length);
        
        // <-- work on input **
        var isNot = false;
        var isChar = false;
        var currentWord = "";
        // iterate string containing dates
        for(var i = 0; i < dates.length; i++) {
            // set variables
            currentDay = dates[i];
            isNot = false;
            isChar = false;
            
            console.log("Current Day (" + i + "): " + currentDay);

            // check on negation
            if(dates[i].charAt(0)=="!") {
                // ** negiert
                isNot = true;
                // change currentDay, abandon "!"
                currentDay = currentDay.substr(1,2);
                
                console.log("New String: " + currentDay);
            } 
            
            // check on char
            if(isNaN(currentDay)) {
                // ** its a weekday                
                console.log("currDayWord: " + weekdays[currentDay]);
                
                // set currentDay to an array of days
                isChar = true;
                currentDay = weekdays[currentDay];
            }
            
            console.log("Result: " + currentMonth.format());
            
            // save
            if(isChar) {
                // its an array        
                for(var k = 0; k < currentDay.length; k++) {
                    saveMonth(month, currentDay[k], currentWorker, isNot);
                }
            } else {
                // its not
                saveMonth(month, currentDay, currentWorker, isNot);
            }
            
        }
        // ** work on input -->
    }
    console.log("done");
    
//    printMonth(month);
    // ** all the shit with the worker -->
}

function saveMonth(month, day, worker, isNot) {
    
    var isDouble = false;
    
    var list = {};
    var className = {false : "workers", true : "notWorkers"};
    
    if(isNot) {
        list = month[day].notWorkers;
//        isNot = 1;
    } else {
        list = month[day].workers;
//        isNot = 0;
    }
    
    for(var h = 0; h < list.length; h++) {
        if(list[h].id == worker.id) {
            isDouble = true;
        }
    }

    if(!isDouble) {
        list.push(worker);
        
        // add html call
        var element = $("#tableDay" + day + " ul.workerList");
        var listItem = jQuery('<li class="' + className[isNot] + '">' + worker.name + '</li>');
        listItem.data('worker', worker);
        element.append(listItem);
        
//        element.sortable("refresh");
        sortWorker();
        
        
        console.log("Saved a day. " + listItem.data('worker').name);
    }
}

function printMonth(month) {
    for(var i = 1; i < 31+1; i++) {
        console.log("Day: " + i);
        for(var k = 0; k < month[i].workers.length; ++k) {
            console.log("Worker: " + month[i].workers[k].name);
        }
    }
}
    



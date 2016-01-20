/*
 *  jquery.potTable.js
 *  
 *	 Pot App pot.potTable
 *
 *  Created by Julian Kleine on 15. Jan 2016.
 *  Copyright Gabriel Seitz. All rights reserved.
 *
 */

$.widget("pot.potTable", {
    
    // Variables/Options
    options: {
        inputTable: "inputTable", 
        worker: {},
        weekdays : {"so": [], "mo": [], "di": [], "mi": [], "do": [], "fr": [], "sa": []},
        days : 31,
        month : 1,
        list : []
    },
    
    // Initial function
    _create: function() {
        var month = {};
        var currentMonth = moment("01 01 2016", "DD MM YYYY");


        // create weekdays
        this._weekdays(currentMonth);            
        this._createHtml();

        // reset
        this._reset();
    },
    
    // ** private functions **
    _weekdays: function(currentMonth) {
        // iterate all days of the current month
        for(var i = 1; i < this.options.days+1; i++) {
            currentMonth.date(i);
            var numberToWeek = ["so","mo","di","mi","do","fr","sa"];
            var currWeekday = numberToWeek[currentMonth.weekday()];
            this.options.weekdays[currWeekday].push(currentMonth.date());
        }
    },

    _plan: function() {
        for(var j = 0; j < this.options.worker.length; ++j) {
            var currentWorker = this.options.worker[j];
            var dates = currentWorker.text.split(",");
            var min = currentWorker.min;
            var max = currentWorker.max;

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

                // check on negation
                if(dates[i].charAt(0)=="!") {
                    // ** negiert
                    isNot = true;
                    // change currentDay, abandon "!"
                    currentDay = currentDay.substr(1,2);
                } 

                // check on char
                if(isNaN(currentDay)) {
                    isChar = true;
                    currentDay = this.options.weekdays[currentDay];
                }

                // save
                if(isChar) {
                    // its an array        
                    for(var k = 0; k < currentDay.length; k++) {
                        this._save(currentDay[k], currentWorker, isNot);
                    }
                } else {
                    // its not
                    this._save(currentDay, currentWorker, isNot);
                }
            }
        }
    },

    _createTableRow: function(day) {
        var date = new Date(2016, this.options.month-1, day);
        var weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
        
        var startRow = '<tr id="tableDay' + date.getDate() + '"><th scope="row">';
        var th = ("0" + date.getDate()).slice(-2) + '.' + ("0" + (date.getMonth()+1)).slice(-2) + ' - ' + weekdays[date.getDay()] + '</th>';

        startRow += th;

        var baseDropdown =
            '<td>' +
                '<ul class="workerList">' +
                    // LI ELEMENT
                '</ul>' +
            '</td>';

        var endRow = '</tr>';

        return startRow + baseDropdown + baseDropdown + endRow;
    },

    _createInputRow: function(theWorker) {
        var name = '<tr  id="row' + theWorker.id + '" ><td>' + theWorker.name + '</td>';
        var dates = '<td><input class="inputText" type="text"/></td>';
        var times = '<td><input type="number" class="inputMin" min="0"/></td><td><input  type="number" class="inputMax" min="0"/></td></tr>';
        return name + dates + times;
    },

    _createHtml: function() {
        var table = this.element.find('tbody');
        for(var i = 0; i < this.options.days; i++) {
            var row = this._createTableRow(i + 1);
            table.append(row);                
        }

        table = $('table#' + this.options.inputTable + ' tbody');
        for(var i = 0; i < this.options.worker.length; i++) {
            var row = this._createInputRow(this.options.worker[i]);
            table.append(row);                
        }

    },

    _resetHtml: function() {
        for(var i = 0; i < this.options.days; i++) {
            var table = $("#tableDay" + (i+1) + " ul.workerList");
            table.empty();
        }
    },
    
    _reset: function() {
        // reset all necessary stuff
        
        // fill plan
        for(var i = 0; i < this.options.days; i++) {
            this.options.list[i+1] = {workers: [], notWorkers: []};
        }
    },

    _read: function() {
        var table = $('table#' + this.options.inputTable + ' tbody tr');
        var base = this;
        
        table.each(function () {
            var id = $(this).attr("id").replace("row", "");
            var text = $(this).find(".inputText").val();
            var min = $(this).find(".inputMin").val();
            var max = $(this).find(".inputMax").val();

            base.options.worker[id].text = text;
            base.options.worker[id].min = min;
            base.options.worker[id].max = max;
        });
    },
        
    _save: function(day, theWorker, isNot) {
        var list = this.options.list;
        var isDouble = false;
        var entry = {};
        var className = {false : "workers", true : "notWorkers"};

        if(isNot) {
            entry = list[day].notWorkers;
        } else {
            entry = list[day].workers;
        }

        for(var h = 0; h < entry.length; h++) {
            if(entry[h].id == theWorker.id) {
                isDouble = true;
            }
        }

        if(!isDouble) {
            entry.push(theWorker);

            var element = $("#tableDay" + day + " ul.workerList");
            var listItem = jQuery('<li class="' + className[isNot] + '">' + theWorker.name + '</li>');
            listItem.data('worker', theWorker);
            element.append(listItem);
        }

    },
    
    // ** public functions **
    refresh: function() {
        // read input
        this._read();
        
        // reset frontend & backend
        this._reset();
        this._resetHtml();
        
        // rerun plan
        this._plan(); 
        
        console.log("potTable refreshed.")
    }
});
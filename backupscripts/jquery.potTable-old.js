/*
 *  jquery.potTable.js
 *  
 *	 Pot App pot.potTable
 *
 *  Created by Julian Kleine on 15. Jan 2016.
 *  Copyright Gabriel Seitz. All rights reserved.
 *
 */

(function($){
    $.potTable = function(el, method, worker, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("potTable", base);
        
        // Sample Function, Uncomment to use
        // base.functionName = function(paramaters){
        // 
        // };
        if( typeof( worker ) === "undefined" || worker === null ) worker = Pot.App.Plan.worker;
        base.worker = worker;
        base.options = $.extend({},$.potTable.defaultOptions, options);
        
        // own functions
        base.methods = {
            
            init: function(){
                base.methods.create();
            },
        
            weekdays: function(currentMonth) {

                // iterate all days of the current month
                for(var i = 1; i < base.options.days+1; i++) {
                    currentMonth.date(i);
                    var numberToWeek = ["so","mo","di","mi","do","fr","sa"];
                    var currWeekday = numberToWeek[currentMonth.weekday()];
                    base.options.weekdays[currWeekday].push(currentMonth.date());
                }

            },

            // inserts the dates in table
            plan: function() {
                for(var j = 0; j < worker.length; ++j) {
                    var currentWorker = worker[j];
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
                            isChar = true;
                            currentDay = base.options.weekdays[currentDay];
                        }


                        // save
                        if(isChar) {
                            // its an array        
                            for(var k = 0; k < currentDay.length; k++) {
                                base.methods.save(currentDay[k], currentWorker, isNot);
                            }
                        } else {
                            // its not
                            base.methods.save(currentDay, currentWorker, isNot);
                        }

                    }
                    // ** work on input -->
                }

            },

            createTableRow: function(day) {

                var date = new Date(2016, base.options.month-1, day);
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

            createInputRow: function(theWorker) {
                var name = '<tr  id="row' + theWorker.id + '" ><td>' + theWorker.name + '</td>';
                var dates = '<td><input class="inputText" type="text"/></td>';
                var times = '<td><input type="number" class="inputMin" min="0"/></td><td><input  type="number" class="inputMax" min="0"/></td></tr>';
                return name + dates + times;
            },

            createHtml: function() {
                var table = base.$el.find('tbody');
                for(var i = 0; i < base.options.days; i++) {
                    var row = base.methods.createTableRow(i + 1);
                    table.append(row);                
                }

                table = $('table#' + base.options.inputTable + ' tbody');
                for(var i = 0; i < worker.length; i++) {
                    var row = base.methods.createInputRow(worker[i]);
                    table.append(row);                
                }

            },
            
            clearHtml: function() {
                var table = base.$el.find('tbody ul.workerList');
                table.empty();
            },

            create: function() {
                var month = {};
                var currentMonth = moment("01-01-2016");


                // create weekdays
                base.methods.weekdays(currentMonth);            
                base.methods.createHtml();
                
                // fill plan
                for(var i = 0; i < base.options.days; i++) {
                    base.options.list[i+1] = {workers: [], notWorkers: []};
                }
            },
            
            read: function() {
                var table = $('table#' + base.options.inputTable + ' tbody tr');
                table.each(function () {
                    var id = $(this).attr("id").replace("row", "");
                    var text = $(this).find(".inputText").val();
                    var min = $(this).find(".inputMin").val();
                    var max = $(this).find(".inputMax").val();
                    
                    worker[id].text = text;
                    worker[id].min = min;
                    worker[id].max = max;
                });
            },

            refresh: function() {
                base.methods.read();
                base.methods.clearHtml();
                base.methods.plan();                
                console.log("refresh done");

            },

            save: function(day, theWorker, isNot) {
                var list = base.options.list;
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

                    // add html call
                    var element = $("#tableDay" + day + " ul.workerList");
                    var listItem = jQuery('<li class="' + className[isNot] + '">' + theWorker.name + '</li>');
                    listItem.data('worker', theWorker);
                    element.append(listItem);

                    console.log("Saved a day. " + listItem.data('worker').name);
                }

            }
        };

         if (base.methods[method]) {
            return base.methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return base.methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.potTable');
        }
    };
    
    $.potTable.defaultOptions = {
        method: 'init', 
        inputTable: "inputTable", 
        worker: {},
        // 0 - sunday, 1 - monday ....
        weekdays : {
                "so" : [],
                "mo" : [],
                "di" : [],
                "mi" : [],
                "do" : [],
                "fr" : [],
                "sa" : []
        },
        day : 1,
        days : 31,
        month : 1,
        list : []
    
        

    };
    
    $.fn.potTable = function(method, inputTable, worker, options){
        return this.each(function(){
            (new $.potTable(this, method, inputTable, worker, options));

		   // HAVE YOUR PLUGIN DO STUFF HERE
			
	
		   // END DOING STUFF

        });
    };
    
})(jQuery);
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
        list : [],
        plan : []
    },
    
    // Initial function
    _create: function() {
        var month = {};
        var currentMonth = moment("01 01 2016", "DD MM YYYY");

        // set up plan[]
        for(var i = 0; i < this.options.days; i++) {
            this.options.plan[i+1] = {theke: {}, koch: {} };
        }
        
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

        var baseDropdownTheke =
            '<td>' +
                '<ul class="workerListTheke">' +
                    // LI ELEMENT Theke
                '</ul>' +
            '</td>';
        
        var baseDropdownKoch =
            '<td>' +
                '<ul class="workerListKoch">' +
                    // LI ELEMENT Koch
                '</ul>' +
            '</td>';


        var endRow = '</tr>';

        return startRow + baseDropdownTheke + baseDropdownKoch + endRow;
    },

    _createInputRow: function(theWorker) {
        var name = '<tr  id="row' + theWorker.id + '" ><td>' + theWorker.name + '</td>';
        var dates = '<td><input class="inputText" type="text"/></td>';
        var times = '<td><input type="number" class="inputMin" min="0"/></td><td><input  type="number" class="inputMax" min="0"/></td>';
        var theke = '<td><input class="inputT" type="checkbox"/></td>';
        var kueche = '<td><input class="inputK" type="checkbox"/></td>/tr>';
        return name + dates + times + theke + kueche;
    },

    _createHtml: function() {
        var table = this.element.find('tbody');
        for(var i = 0; i < this.options.days; i++) {
            var row = this._createTableRow(i + 1);
            table.append(row);                
        }

        table = $('table#' + this.options.inputTable + ' tbody');
        for(var i = 0; i < this.options.worker.length; i++) {
            worker = this.options.worker[i];
            var row = this._createInputRow(worker);
            table.append(row);
            
            // set default value on checkboxes
            table.find('tr#' + "row"+worker.id + ' td' + ' input.inputT').prop("checked", worker.theke);
            table.find('tr#' + "row" + worker.id + ' td' + ' input.inputK').prop("checked", worker.koch);
            
            // TEST VARIABLES
            table.find('tr#' + "row" + worker.id + ' td' + ' input.inputMin').val('2');
            table.find('tr#' + "row" + worker.id + ' td' + ' input.inputMax').val('2');
            table.find('tr#' + "row" + worker.id + ' td' + ' input.inputText').val('mo,di,mi,do,fr');
            
        }

    },

    _resetHtml: function() {
        for(var i = 0; i < this.options.days; i++) {
            var table = $("#tableDay" + (i+1) + " ul.workerListTheke");
            table.empty();
            var table = $("#tableDay" + (i+1) + " ul.workerListKoch");
            table.empty();
            
        }
        
    },
    
    _reset: function() {
        // reset all necessary stuff
        
        // fill plan
        for(var i = 0; i < this.options.days; i++) {
            this.options.list[i+1] = {theke: {workers: [], notWorkers: []}, koch: {workers: [], notWorkers: []} };
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
            var theke = $(this).find(".inputT").is(":checked");
            var kueche = $(this).find(".inputK").is(":checked");

            base.options.worker[id].text = text;
            base.options.worker[id].min = min;
            base.options.worker[id].max = max;
            base.options.worker[id].theke = theke;
            base.options.worker[id].koch = kueche;
        });
    },
        
    _save: function (day, theWorker, isNot) {
        var list = this.options.list;
        var isDouble = false;
        var entry = {};
        var className = {
            false: "workers",
            true: "notWorkers"
        };
        var theke = false;
        var koch = false;

        if (isNot) {
            if (theWorker.theke) {
                theke = true;
                entry = list[day].theke.notWorkers;
            }

            if (theWorker.koch) {
                koch = true;
                entry = list[day].koch.notWorkers;
            }
        } else {
            if (theWorker.theke) {
                theke = true;
                entry = list[day].theke.workers;
            }

            if (theWorker.koch) {
                koch = true;
                entry = list[day].koch.workers;
            }
        }

        for (var h = 0; h < entry.length; h++) {
            if (entry[h].id == theWorker.id) {
                isDouble = true;
            }
        }

        if (!isDouble) {
            entry.push(theWorker);

            if (theke) {
                var element = $("#tableDay" + day + " ul.workerListTheke");
                var listItem = jQuery('<li class="' + className[isNot] + '">' + theWorker.name + '</li>');
                listItem.data('worker', theWorker);
                element.append(listItem);
            }

            if (koch) {
                var element = $("#tableDay" + day + " ul.workerListKoch");
                var listItem = jQuery('<li class="' + className[isNot] + '">' + theWorker.name + '</li>');
                listItem.data('worker', theWorker);
                element.append(listItem);
            }
        }


    },
    
    _clearDay: function (theWorker, day, list){
        plan = this.options.list;        
        // set to notWorkers in other role
        if(list == "Theke"){
            for(var i = 0; i < plan[day].koch.workers.length; i++){
                if(this.id == worker.id){
                    plan[day].koch.notWorkers.push(worker);
                }
            }
        }
        if(list == "Koch"){
            for(var i = 0; i < plan[day].theke.workers.length; i++){
                if(this.id == worker.id){
                    plan[day].theke.notWorkers.push(worker);
                }
            }
        }
        
    },
    
    _maxReached: function(worker, day, role){
        plan = this.options.list;  
        
        // delete from all other days
        for(i = 0; i < this.options.days; i++){
             
        }
    },
    
    _activateWorker: function(worker, day, list){
        
    },
    
    
    // ** public functions **
    reload: function() {
        // read input
        this._read();
        
        // reset frontend & backend
        this._reset();
        this._resetHtml();
        
        // rerun plan
        this._plan();
        
        
        console.log("potTable refreshed.");
    },
    
    setActive: function (worker, day, list) {
        worker.min = worker.min - 1;
        worker.max = worker.max - 1;
        
        role = list.replace("workerList","").toLowerCase();
                
        this.options.plan[day.replace("tableDay","")].role = worker;
        this._reset();
        this._resetHtml();
        
        element = $("#" + day + ' ul.' + list + ' li');
        
        // deactivate other worker
        element.each(function (){
            if ($(this).attr('class') == "active") {
                currWorker = $(this).data("worker");
                
                if(currWorker.max == 0){                
                    //this._activateWorker(worker, day, list);
                }
                $(this).removeClass('active');
                $(this).attr('class', "workers")
                
                
                currWorker.min = worker.min + 1;
                currWorker.max = worker.max + 1;
                
            }
        });
        
        // set classes of listItems
        element.each(function () {
            if ($(this).data('worker').id == worker.id) {              
                $(this).removeClass("workers");
                $(this).attr('class', "active"); 
            } else{
                $(this).hide();
            }
        });
        
        // delete from the other role if necessary
        this._clearDay(worker,day.replace("tableDay",""),list.replace("workerList",""));
        
        // delete from other days if necessary
        if(worker.max == 0){
            this._maxReached(worker,day,list.replace("workerList",""));
        }
        for(var i = 0; i < this.options.worker.length; i++){
            console.log(this.options.worker[i].name + " - Anzahl: " +this.options.worker[i].min + " - " + this.options.worker[i].max);                      
        }

        
        var counter = 0;
        var firstData;
        var activeData = worker;
        
        
        /*
        // set and sort listitem-classes
        element.each(function () {

            if (counter == 0) {
                firstData = $(this).data('worker');
                $(this).data('worker', activeData);
                $(this).attr('class', "active");
                
            }

            if ($(this).data('worker').id != worker.id) {
                $(this).removeClass("active");
            } else {
                $(this).data('worker', firstData);
                $(this).attr('class', "active");
                          
                
            }
            counter = counter + 1;
            
        });*/

        day = day.replace("tableDay", "");
        this.options.plan[day - 1] = worker;
        console.log("Geplant fuer " + day + " ten : " + this.options.plan[day - 1].name + "!");
    },
    
    show: function (list) {
        list.find(":hidden").each(function(){
                $(this).show(); 
        });
    }
});
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
        plan : [],
        classes: {'workerList': "workerList"}
    },
    
    // Initial function
    _create: function() {
        var month = {};
        var currentMonth = moment('01'+' 0'+this.options.month+' 2016', "DD MM YYYY");

        for(var i = 0; i < this.options.days; i++) {
            this.options.list[i+1] = {workers: {theke: [], koch: []}, notWorkers: {theke: [], koch: []}, active: {theke: {}, koch: {}} };
        }
        
        // create weekdays
        this._weekdays(currentMonth);            

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

    _plan: function () {
     for (var j = 0; j < this.options.worker.length; ++j) {
         var currentWorker = this.options.worker[j];
         var dates = currentWorker.text.split(",");
         var min = currentWorker.min;
         var max = currentWorker.max;
             // <-- work on input **
         var isNot = false;
         var isChar = false;
         var currentWord = "";
         // iterate string containing dates
         for (var i = 0; i < dates.length; i++) {
             // set variables
             currentDay = dates[i];
             isNot = false;
             isChar = false;

             // check on negation
             if (dates[i].charAt(0) == "!") {
                 // ** negiert
                 isNot = true;
                 // change currentDay, abandon "!"
                 currentDay = currentDay.substr(1, 2);
             }

             // check on char
             if (isNaN(currentDay)) {
                 isChar = true;
                 currentDay = this.options.weekdays[currentDay];
             }

             // save
             if (isChar) {
                 // its an array        
                 for (var k = 0; k < currentDay.length; k++) {
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
        var gericht = '<td><select id="gericht'+day+'"</select></td>';

        var theke =
            '<td>' +
                '<ul class="' + this.options.classes.workerList + ' theke">' +
                    // LI ELEMENT Theke
                '</ul>' +
            '</td>';
        
        var koch =
            '<td>' +
                '<ul class="' + this.options.classes.workerList + ' koch">' +
                    // LI ELEMENT Koch
                '</ul>' +
            '</td>';


        var endRow = '</tr>';

        return startRow + gericht + theke + koch + endRow;
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
        var table = $('table#tableUser tbody');
        
        for(var i = 0; i < this.options.days; i++) {
            var row = this._createTableRow(i + 1);
            table.append(row);                
        }
    },

    _resetHtml: function() {
        for(var i = 0; i < this.options.days; i++) {
            var table = $("#tableDay" + (i+1) + " ul." + this.options.classes.workerList);
            table.empty();
        }
    },
    
    _reset: function() {
        // reset all necessary stuff
        for(var i = 0; i < this.options.days; i++) {
            //var lastActive = this.options.list[i+1].active;
            this.options.list[i+1].workers = {theke: [], koch: []};
            this.options.list[i+1].notWorkers = {theke: [], koch: []};
        }
    },

    _read: function() {
        var table = $('table#' + this.options.inputTable + ' tbody tr');
        var base = this.options;
        
        // read in
        table.each(function (i) {
            var id = $(this).attr("id").replace("row", "");
            var text = $(this).find(".inputText").val();
            var min = $(this).find(".inputMin").val();
            var max = $(this).find(".inputMax").val();
            var theke = $(this).find(".inputT").is(":checked");
            var kueche = $(this).find(".inputK").is(":checked");

            base.worker[i].text = text;
            base.worker[i].min = min;
            base.worker[i].max = max;
            base.worker[i].theke = theke;
            base.worker[i].koch = kueche;
            base.worker[i].count = 0;
        });
        
        // read rezepte
        table = $('table#mealTable' + ' tbody tr td .inputText');
        table.each(function(i){
            var worker = $(this).closest('tr').data('worker');
            worker.rezepte.push($(this).val());
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
        
        var isTheke = theWorker.theke;
        var isKoch = theWorker.koch;

        if (isNot) {
            
            if (isTheke) {
                entry = list[day].notWorkers.theke;
            } else {
                entry = list[day].notWorkers.koch;
            }
            
        } else {
            
            if (isTheke) {
                entry = list[day].workers.theke;
            } else {
                entry = list[day].workers.koch;
            }
        }

        for (var h = 0; h < entry.length; h++) {
            if (entry[h].id == theWorker.id) {
                isDouble = true;
            }
        }

        if (!isDouble) {
            
            var workerClass = {true: "theke", false: "koch"};
            
            if (theWorker.count < theWorker.max || list[day].active[workerClass[isTheke]].id == theWorker.id) {
                entry.push(theWorker);



                var element = $("#tableDay" + day + " ul." + this.options.classes.workerList + "." + workerClass[isTheke]);

                var listItem = jQuery('<li class="' + className[isNot] + '">' + theWorker.name +' '+ theWorker.count+'/'+ theWorker.max +'</li>');
                listItem.data('worker', theWorker);
                element.append(listItem);

                if (theWorker.id == list[day].active[workerClass[isTheke]].id) {
                    element.find('li').each(function () {

                        if ($(this).data('worker').id == theWorker.id) {
                            $(this).addClass('active');
                        }
                    });
                }
            }
        }
        
        
    },
    
    _loadMeals: function(){
        for(var i = 1; i < this.options.days; i++){
            var koch = this.options.list[i].active.koch;
            var element = $('table#tableUser tbody tr').find('#gericht'+i);
            if(!jQuery.isEmptyObject(koch)){
                for(var j = 0; j < koch.rezepte.length; j++){
                    element.append( new Option(koch.rezepte[j],koch.rezepte[j]));
                }                
            }
        }
    },
    
    _updateTable: function () {
        
        // reset 
        this._reset();
        this._resetHtml();
        
        //append rest of worker
        this._plan();
        this._loadMeals();
        console.log("potTable refreshed.")

    },
       
    // ** public functions **
    reloadTable: function() {
        // reset frontend & backend
        this._reset();
        for(var i=1; i < this.options.days; i++){
            this.options.list[i+1].active = {theke: {}, koch: {}};
        }
        
        this._createHtml();
        
        // rerun plan
        this._plan();
        
        
        console.log("potTable reloaded.");
    },
    
    setActive: function (item) {
        var theWorker = $(item).data('worker');
        
        var currentDay = $(item).closest('tr').prop('id').replace("tableDay", "");
        var role = $(item).parent().hasClass('theke') ? "theke" : "koch";
        
        var currentWorker = this.options.list[currentDay].active;
        
        theWorker.count++;
        
        if (role == "theke") {
            if(!jQuery.isEmptyObject(currentWorker.theke)){
                currentWorker.theke.count--;
            }
            this.options.list[currentDay].active.theke = theWorker;
        }

        if (role == "koch") {
            currentWorker.koch.count--;
            this.options.list[currentDay].active.koch = theWorker;
        }

        // update
        this._updateTable();
    },
    
    setNotActive: function (item) {
        
        var theWorker = $(item).data('worker');
        var currentDay = $(item).closest('tr').prop('id').replace("tableDay", "");
        theWorker.count --;
        
        if($(item).closest('ul').hasClass("theke")){
            this.options.list[currentDay].active.theke = {};
        }else{
            this.options.list[currentDay].active.koch = {};            
        }
        
        //update
        this._updateTable();
        
    },
        
    createMealInput: function(){
        var element = $("#inputTable" + ' tr');
        var go = false;
        element.each( function(){
            if($(this).find('input.inputK').prop("checked")){
                var worker = $(this).data('worker');
                var name = '<tr  id="rezeptRow' + worker.id + '" ><td>' + worker.name + '</td>';
                var rezept = "<td>";
                for (var i = 0; i < $(this).find('.inputMax').val(); i ++){
                    rezept = rezept + '<input class="inputText" type="text"/>';
                }
                rezept = rezept + "</td>";
                var item = jQuery(name + rezept);
                item.data('worker', worker);
                
                $("#mealTable" + ' tbody').append(item);
            }
        });
    },
    
    loadWorker: function() {
        var table = $('table#' + this.options.inputTable + ' tbody');
        for(var i = 0; i < this.options.worker.length; i++) {
            worker = this.options.worker[i];
            var row = this._createInputRow(worker);
            table.append(row);
            row = table.find("tr#"+ "row" + i);
            row.data('worker', worker);
            
            // set default value on checkboxes
            table.find('tr#' + "row"+ worker.id + ' td' + ' input.inputT').prop("checked", worker.theke);
            table.find('tr#' + "row" + worker.id + ' td' + ' input.inputK').prop("checked", worker.koch);
            
            // TEST VARIABLES
            table.find('tr#' + "row" + worker.id + ' td' + ' input.inputMin').val('2');
            table.find('tr#' + "row" + worker.id + ' td' + ' input.inputMax').val('2');
            table.find('tr#' + "row" + worker.id + ' td' + ' input.inputText').val('mo,di,mi,do,fr');
            
        }
    },
    
    readWorker: function() {
        // read input
        this._read();
    }
});
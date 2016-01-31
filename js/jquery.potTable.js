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
        month : 0,
        year : 0,
        
        list : [],
        plan : [],
        classes: {'workerList': "workerList"}
    },
    
    // Initial function
    _create: function() {
        var month = {};
        var currentMonth = moment('01'+' 0'+this.options.month+' '+this.options.year, "DD MM YYYY");
        
        //set days with moments.js
        var lastDayOfMonth = currentMonth.endOf('month').date();
        this.options.days = lastDayOfMonth;
        console.log("Jahr: " + this.options.year + " Monat: " + this.options.month + " Tage: " + this.options.days);
        
       

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
        
     //call save function every date from every worker
     for (var j = 0; j < this.options.worker.length; ++j) {
         var currentWorker = this.options.worker[j];
         var dates = currentWorker.text.split(",");
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
        var meal = 	'<td class="col-md-4">' +
					'<div class="dropdown">' +
      				'<button class="btn btn-pot dropdown-toggle" type="button" id="dropdownMenuX" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' +
        			'Meals<span class="caret"></span>' +
					'</button>' + 
					  '<ul class="dropdown-menu" aria-labelledby="dropdownMenuX">' + 
						'<li><a href="#">some meal</a></li>' +
					  '</ul>' + 
					'</div></td>';

        var theke =
            '<td class="col-md-3">' +
                '<ul class="' + this.options.classes.workerList + ' theke">' +
                    // LI ELEMENT Theke
                '</ul>' +
            '</td>';
        
        var koch =
            '<td class="col-md-3">' +
                '<ul class="' + this.options.classes.workerList + ' koch">' +
                    // LI ELEMENT Koch
                '</ul>' +
            '</td>';


        var endRow = '</tr>';
		
		return startRow + meal + theke + koch + endRow;
    },

    _createInputRow: function(theWorker) {
        var name = '<tr  id="row' + theWorker.id + '" ><td>' + theWorker.name + '</td>';
        var dates = '<td><input class="inputText" type="text"/></td>';
        var times = '<td><input  type="number" class="inputMax" min="0"/></td>';
        var theke = '<td><input class="inputT" type="checkbox"/></td>';
        var kueche = '<td><input class="inputK" type="checkbox"/></td>';
        var rezepte = '<td>';
        
        if (theWorker.koch){
            for(var i = 0; i < theWorker.max; i++){
                rezepte = rezepte + '<input id="gericht' + i +'" type="text"/>';
            }
        }
        rezepte = rezepte + '</td></tr>'
        return name + dates + times + theke + kueche + rezepte;
    },

    _createHtml: function() {
        var table = $('table#tableUser tbody');
        
        for(var i = 0; i < this.options.days; i++) {
            var row = this._createTableRow(i + 1);
            table.append(row);                
        }
    },

    _resetHtml: function() {
        
        // reset workerList, notWorkerList, meal
        for(var i = 0; i < this.options.days; i++) {
            var table = $("#tableDay" + (i+1) + " ul." + this.options.classes.workerList);
            table.empty();
            table  = $('table#tableUser tbody tr').find('#meal'+ (i+1));
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
        
        // read 
        table.each(function (i) {
            var id = $(this).attr("id").replace("row", "");
            var text = $(this).find(".inputText").val();
            var max = $(this).find(".inputMax").val();
            var theke = $(this).find(".inputT").is(":checked");
            var kueche = $(this).find(".inputK").is(":checked");

            base.worker[i].text = text;
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
        var entryK = {};
        var entryT = {};
        var className = {
            false: "workers",
            true: "notWorkers"
        };
        
        var isTheke = theWorker.theke;
        var isKoch = theWorker.koch;
        
       // if(!(isTheke && isKoch)){
            
            // if its a "can not" entry
            if (isNot) {

                if (isTheke) {
                    entryT = list[day].notWorkers.theke;
                }
                
                if (isKoch) {
                    entryK = list[day].notWorkers.theke;
                }

            } else {

                if (isTheke) {
                    entryT = list[day].workers.theke;
                } 
                
                if(isKoch) {
                    entryK = list[day].workers.koch;
                }
            }

            
            // check if entry is already there
            if(isTheke) {
                for (var h = 0; h < entryT.length; h++) {
                        if (entryT[h].id == theWorker.id) {
                            isDouble = true;
                        }
                }
            } else {
                for (var h = 0; h < entryK.length; h++) {
                        if (entryK[h].id == theWorker.id) {
                            isDouble = true;
                        }
                }
            }
            

            // if worker isnt set on this day
            if (!isDouble) {

                var workerClass = {true: "theke", false: "koch"};
                
                // see if its special case
                
                if(!(isTheke && isKoch)){
                    // if the worker has dates left or if he's active
                    if (list[day].active[workerClass[isTheke]].id == theWorker.id) {
                        if(isTheke){
                            entryT.push(theWorker);
                        } else {
                            entryK.push(theWorker);
                        }
                        
                        var element = $("#tableDay" + day + " ul." + this.options.classes.workerList + "." + workerClass[isTheke]);

                        // append to table if its not a "can't" day
                        if(!isNot){
                            var listItem = jQuery('<li class="' + className[isNot] +' active'+ '">' + theWorker.name +' '+ theWorker.count+'/'+ theWorker.max +'</li>');
                            listItem.data('worker', theWorker);
                            element.append(listItem);
                        }
                        
                    } else {
                        if (theWorker.count < theWorker.max){
                            if(isTheke){
                                entryT.push(theWorker);
                            } else {
                                entryK.push(theWorker);
                            }

                            var element = $("#tableDay" + day + " ul." + this.options.classes.workerList + "." + workerClass[isTheke]);

                            // append to table if its not a "can't" day
                            if(!isNot){
                                var listItem = jQuery('<li class="workers">' + theWorker.name +' '+ theWorker.count+'/'+ theWorker.max +'</li>');
                                listItem.data('worker', theWorker);
                                element.append(listItem);
                            }
                        }
                    }
                    
            // special case theke and koch are true
            } else {
                
                var elementT = $("#tableDay" + day + " ul.workerList.theke");
                var elementK = $("#tableDay" + day + " ul.workerList.koch");
                
                // if worker has dates left
                if (theWorker.count < theWorker.max) {
                        
                        entryT.push(theWorker);
                        entryK.push(theWorker);
                        
                        // append to table if its not a "can't" day
                        if(!isNot){
                            var listItemT = jQuery('<li class="workers">' + theWorker.name +' '+ theWorker.count+'/'+ theWorker.max +'</li>');
                            listItemT.data('worker', theWorker);
                            elementT.append(listItemT);
                            var listItemK = jQuery('<li class="workers">' + theWorker.name +' '+ theWorker.count+'/'+ theWorker.max +'</li>');
                            listItemK.data('worker', theWorker);
                            elementK.append(listItemK);
                            
                            // set active if necessary
                            if (list[day].active.theke.id == theWorker.id){
                                elementT.find('li').each(function () {
                                    if ($(this).data('worker').id == theWorker.id) {
                                        $(this).addClass('active');
                                    }
                                });
                            }

                            if (list[day].active.koch.id == theWorker.id){
                                elementK.find('li').each(function () {
                                    if ($(this).data('worker').id == theWorker.id) {
                                        $(this).addClass('active');
                                    }
                                });
                            }
                            
                            
                            
                        }

                } else {

                    // set active if necessary
                    if (list[day].active.theke.id == theWorker.id){
                        entryT.push(theWorker);
                        var listItemT = jQuery('<li class="workers active">' + theWorker.name +' '+ theWorker.count+'/'+ theWorker.max +'</li>');
                        listItemT.data('worker', theWorker);
                        elementT.append(listItemT);                            
                    }

                    if (list[day].active.koch.id == theWorker.id){
                        var listItemK = jQuery('<li class="workers active">' + theWorker.name +' '+ theWorker.count+'/'+ theWorker.max +'</li>');
                        listItemK.data('worker', theWorker);
                        elementK.append(listItemK);
                    }
                }
                
            }            
        }
        
    },
    
    _loadMeals: function() {
    },    
    
    _updateTable: function () {
        
        // reset 
        this._reset();
        this._resetHtml();
        
        //append rest of worker
        this._plan();
        this.preSetTable();
        this._loadMeals();
        
        console.log("potTable refreshed.");

    },
    
    // ** public functions ** 
    
    preSetTable: function () {
        // if only one worker available set active
       for(var i = 1; i < this.options.days; i++){
            var workers = this.options.list[i].workers
            if(workers.theke.length == 1 ){
                this.setActive($('tr#tableDay' + i+' ul.theke li.workers'));
            }
            if(workers.koch.length == 1 ){
                this.setActive($('tr#tableDay' + i+' ul.koch li.workers'));
            }
            if(workers.theke.length == 0){
                $('tr#tableDay' + i).addClass("danger");
                window.alert("Keine Thekenkraft am: "+i+". !");
            }
            if(workers.koch.length == 0){
                $('tr#tableDay' + i).addClass("danger");
                window.alert("Keine Küchenkraft am: "+i+". !");
            }
        }
    },
       
    loadTable: function() {
        
        this._createHtml();
        
        // rerun plan
        this._plan();
        
        //preset table
        this.preSetTable();
        
        console.log("potTable loaded.");
    
    },
    
    reloadTable: function() {
        
        // reset workerlist
        this._reset();
        
        // reset html
        this._resetHtml();
        
        // reset active
        for(var i=0; i < this.options.days; i++){
            this.options.list[i+1].active = {theke: {}, koch: {}};
        }
        
        // reset count
        for(var i=0; i < this.options.worker.length; i++){
            this.options.worker[i].count = 0;
        }
        
        // reload table
        this._plan();
        
        //preset table
        this.preSetTable();
        
         console.log("potTable reloaded.");
    },
    
    setActive: function (item) {
        var theWorker = $(item).data('worker');
        
        var currentDay = $(item).closest('tr').prop('id').replace("tableDay", "");
        var role = $(item).parent().hasClass('theke') ? "theke" : "koch";
        
        var currentWorker = this.options.list[currentDay].active;
        
        theWorker.count++;
        
        if (role == "theke") {
            if (!jQuery.isEmptyObject(currentWorker.theke)) {
                currentWorker.theke.count--;
                
                
            }
            
            //  if worker works at theke and koch
            if (!jQuery.isEmptyObject(currentWorker.koch) && currentWorker.koch.id == theWorker.id) {
                    currentWorker.koch = {};
                    theWorker.count --;
                    //this.setNotActive(double);               
            }
            this.options.list[currentDay].active.theke = theWorker;
        }

        if (role == "koch") {
             if (!jQuery.isEmptyObject(currentWorker.koch)){ 
                 currentWorker.koch.count--;                
                }
            
            if (!jQuery.isEmptyObject(currentWorker.theke) && currentWorker.theke.id == theWorker.id){
                    currentWorker.theke = {};
                    theWorker.count --;
            }
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
        
    
    addMealRow: function(item){
        var theWorker = item.data('worker');
        var times = item.find('.inputMax').val();
        var name = '<tr  id="rezeptRow' + theWorker.name + '" ><td>' + theWorker.name + '</td>';
        
        // add input for every meal
        var rezept = "<td>";        
        for (var i = 0; i < times ; i ++){
            rezept = rezept + '<input class="inputText" type="text"/>';
        }
        rezept = rezept + "</td>";
        var row = jQuery(name + rezept);
        row.data('worker', theWorker);                
        $("#mealTable" + ' tbody').append(row);
        
        
        
    },
    
    deleteMealRow: function(item){
        var theWorker = item.data('worker');
        var deleteRow = $("#mealTable" + ' tbody').find('tr#rezeptRow'+theWorker.name);
        if(!jQuery.isEmptyObject(deleteRow)){
            deleteRow.remove();
        }
        
    },
    
    loadWorker: function () {
    var table = $('table#' + this.options.inputTable + ' tbody');
        for (var i = 0; i < this.options.worker.length; i++) {
            worker = this.options.worker[i];
            var row = this._createInputRow(worker);
            table.append(row);
            row = table.find("tr#" + "row" + i);
            row.data('worker', worker);

            // set default value on checkboxes
            table.find('tr#' + "row" + worker.id + ' td' + ' input.inputT').prop("checked", worker.theke);
            table.find('tr#' + "row" + worker.id + ' td' + ' input.inputK').prop("checked", worker.koch);

            // TEST VARIABLES
            table.find('tr#' + "row" + worker.id + ' td' + ' input.inputMax').val(worker.max);
            table.find('tr#' + "row" + worker.id + ' td' + ' input.inputText').val(worker.dates);
        }
    },
    
    readWorker: function() {
        // read input
        this._read();
    }
});
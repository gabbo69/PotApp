/*
 *  main.js
 *  
 *	 Pot App Main
 *
 *  Created by Julian Kleine on 03. Jan 2016.
 *  Copyright Gabriel Seitz. All rights reserved.
 *
 */

var Pot = Pot || {}; // Pot: Class, Worker, Monatsplan

Pot.App = Pot.App || {};
Pot.App.Plan = Pot.App.Plan || {};

$(document).ready(function () {

    // jQuery loaded
    
    // load html
    var mainContent = $('div#content');
    mainContent.load("partials/inputDate.html", function () {
        // @Gabo - Besser hierhin, du willst das ja auch ausführen nachdem der html teil geladen wurde.. ;)
        var now = moment();
        year = now.year();
        month = now.month() + 2;
        $("input#year").val(year);
        $("input#month").val(month);
    });
    
   

    // Buttons & Stuff
    $('li#link1').on("click", function () {
        $(this).addClass('active');
        $('li#link2').removeClass('active');
        $('html, body').animate({
            scrollTop: ($('h1#link1').offset().top)
        }, 0);
    });
    
    // load widget on click
    $('div#content').on("click", "button#createButton", function() {
        var month = $("input#month").val();
        var year = $("input#year").val();
        $('div#content').load("partials/inputWorker.html", function() {    
            
            // get data from backend 
            getTable().done(function (data) {
                createMainObject(data.pot);        
                Pot.App.Table = $('body').potTable({worker: Pot.App.Plan.worker, month: month, year: year});
                console.log("App running.");
                Pot.App.Table.potTable("loadWorker");
            });
        });
        
    })
    
    // create and fill userTable on click
    .on("click", "button#insertButton", function () {
        Pot.App.Table.potTable("readWorker");
        
        $('div#content').load("partials/tableUser.html", function() {
            Pot.App.Table.potTable("loadTable");
        });       
        
    })
    
    // activate or deactivate worker on click
    .on("click", 'table#tableUser li.workers',function() {
        if($(this).hasClass("active")){
            Pot.App.Table.potTable("setNotActive", this);           
        }else{
            Pot.App.Table.potTable("setActive", this);
        }
        
        
    })
    
    // reload userTable on click
    .on("click", 'button#reloadButton',function() {
        Pot.App.Table.potTable("reloadTable");
    })
    
    // add or delete mealRow on check/uncheck inputK
    .on("click", 'table#inputTable input.inputK',function() {
        if (this.checked){
            Pot.App.Table.potTable("addMealRow", $(this).closest('tr'));
        } else {
            Pot.App.Table.potTable("deleteMealRow", $(this).closest('tr'));
        }
    })
    
    // add mealRow if koch is true, inputK is clicked and return is pressed
    .on("keydown", 'table#inputTable input.inputMax', function(event) {
            if (event.which == 13) {
                event.preventDefault();
                var element = ($(this).closest('tr').find('td input.inputK').prop('checked'));
                if(element) {
                    Pot.App.Table.potTable("addMealRow", $(this).closest('tr'));
                }
            }
    })
    .on("click", 'table#inputTable input.inputMax',function() {
          $( "table#inputTable input.inputMax" ).keydown();
    })
   
});

// load json file
function getTable() {
        
        // get json file
        var data = $.getJSON("../lib/json/data.json", function (json) {
            console.log("App starting..");
        });
        return data;
}

function createMainObject(data) {
        Pot.App.Plan = new Pot.Plan(data);
}



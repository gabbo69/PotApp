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
    $('div#row2').hide();
    $('div#row3').hide();
    $('div#row4').hide();
    $('div#row5').hide();
    $('div#row6').hide();
    
    // Buttons & Stuff
    $('button#createButton').click(function(){
        $(this).removeClass('btn-default');
        $(this).addClass('btn-success');
        
        
    });
    
    $('li#link1').on("click", function () {
        $(this).addClass('active');
        $('li#link2').removeClass('active');
        $('html, body').animate({
            scrollTop: ($('h1#link1').offset().top)
        }, 0);
    });
    
    $('button#mealButton').click(function() {
        Pot.App.Table.potTable("createMealInput");
        
        //design stuff
        $(this).removeClass('btn-default');
        $(this).addClass('btn-success');
        $('table#mealTable').show();
        $('button#insertButton').show();
        $(this).remove();
        
        
    });
    
    $('button#insertButton').click(function () {
        Pot.App.Table.potTable("reloadTable");
        
        // design stuff
        $(this).removeClass('btn-default');
        $(this).addClass('btn-lg');
        $(this).text("Neu Laden");
        
        $('table#tableUser').show();       
        $('table#mealTable').hide();
        $('#row3').hide();
        
    });
    
    $('table#tableUser').on("click", 'li.workers',function() {
        if($(this).hasClass("active")){
            Pot.App.Table.potTable("setNotActive", this);
            console.log("deactivate");           
        }else{
            Pot.App.Table.potTable("setActive", this);
            console.log("setActive");
        }
    });
    
    getTable().done(function (data,currMonth,currDays) {
        createMainObject(data.pot);

        Pot.App.Table = $('table#tableUser').potTable({worker: Pot.App.Plan.worker, month: currMonth, days: currDays});
        console.log("App running.");
    });
    
});

function getTable(date,time) {
    // get json file
    var data = $.getJSON("../lib/json/data.json", function (json) {
        console.log("App starting..");
    });
    return data;
}

function createMainObject(data) {
    Pot.App.Plan = new Pot.Plan(data);
}
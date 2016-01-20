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
    
    var mainContent = $('div#content');
    mainContent.load("partials/inputDate.html");

    // Buttons & Stuff
    $('li#link1').on("click", function () {
        $(this).addClass('active');
        $('li#link2').removeClass('active');
        $('html, body').animate({
            scrollTop: ($('h1#link1').offset().top)
        }, 0);
    });
    
    
    $('div#content').on("click", "button#createButton", function() {
        $('div#content').load("partials/inputWorker.html", function() {
            Pot.App.Table.potTable("loadWorker");
        });
        
    })
    .on("click", "button#insertButton", function () {
        Pot.App.Table.potTable("readWorker");
        
        $('div#content').load("partials/tableUser.html", function() {
            Pot.App.Table.potTable("reloadTable");   
        });    
        
        // design stuff
        $(this).removeClass('btn-default');
        $(this).addClass('btn-lg');
        $(this).text("Neu Laden");
        
        
    })
    .on("click", 'table#tableUser li.workers',function() {
        if($(this).hasClass("active")){
            Pot.App.Table.potTable("setNotActive", this);
            console.log("deactivate");           
        }else{
            Pot.App.Table.potTable("setActive", this);
            console.log("setActive");
        }
    });

    // Functions
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
    
    getTable().done(function (data) {
            createMainObject(data.pot);        
            Pot.App.Table = $('body').potTable({worker: Pot.App.Plan.worker, month: 1});
            console.log("App running.");
    });

});

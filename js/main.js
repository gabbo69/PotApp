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


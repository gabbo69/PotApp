

var Pot = Pot || {}; // Pot: Class, Worker, Monatsplan

Pot.App = Pot.App || {};
Pot.App.Termine = Pot.App.Termine || {};
Pot.App.Mitarbeiter= Pot.App.Mitarbeiter|| {};


$(document).ready(function() {
    getTable();
    createDates();
   
});

//buttons

$('button#createButton').click(function() {
    // show success on button
    $(this).removeClass('btn-default');
    $(this).addClass('btn-success');
    console.log("create Button")
    createfile();
});
    

//functions    
    
function addRow(name,counter){
    var c=counter;
    var table=$('table#inputTable')
    var row= '<tr><td>'+name+'</td><td><form id="row'+ c +'" ><input type="text"></td><td><input type="number"></form></td></tr>';
    table.append(row);
}

function createDates(){   
    for (var i = 0; i < 5; i++) { 
        var counter=i+1;
        addRow(Pot.Mitarbeiter[i].name,counter);
       
    };
};

function getTable() {
        // get json file
        var data = $.getJSON("../lib/json/mitarbeiter.json", function(json) {
                console.log(json);
            });
        return data;
    }
    
function createMainObject(data) {
    Pot.App.Mitarbeiter = new Pot.Mitarbeiter(data);
}
    
getTable().done(function(data) {
    createMainObject(data.pot);
});

function createfile(){
    
};
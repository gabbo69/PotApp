$(document).ready(function() {
    $('input#days').val(31);
    $('input#month').val(12);
    
    $('input#month').focus().keypress(function(e) {
        if (e.keyCode == '13') {
            e.preventDefault();
            //your code here
            $('button#createButton').removeClass('btn-default');
            $('button#createButton').addClass('btn-success');
            
            var maxDays = $('input#days').val();
            var month = $('input#month').val();

            createMonatsplan(maxDays, month);
        }
    });

    
    $('button#createButton').click(function() {
        // show success on button
        $(this).removeClass('btn-default');
        $(this).addClass('btn-success');
        
        var maxDays = $('input#days').val();
        var month = $('input#month').val();
        
        createMonatsplan(maxDays, month);
    }); 
    
    // Functions
    function createMonatsplan(maxDays, month){
        var data = {};
        
        var worker = {
            0: {
                name: "Gabo",
                role: "theke"
            },
            1: {
                name: "Julian",
                role: "koch"
            }
        };
        
        data.pot = {
            month: month,
            worker: worker,
            days: []
        };
        
        var days = data.pot.days;
        
        for (var i = 0; i < maxDays; i++) {
            days[i] = {
                day: (i+1),
                theke: 0,
                koch: 1,
                gericht: "Gericht"            
            };
        }
    
        $('p#jsonResult').text(JSON.stringify(data));
        console.log("JSON: " + JSON.stringify(data));
        
        SelectText('jsonResult');
    }
});

function SelectText(element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;    
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
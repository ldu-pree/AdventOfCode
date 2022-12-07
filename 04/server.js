const fs = require('fs');
var colors = require('colors');
colors.enable();
var PF = "Finchoice".blue+": ";

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};
  
Array.prototype.min = function() {
    return Math.min.apply(null, this);
};

function copy(arr){
    return JSON.parse(JSON.stringify(arr));
}

colors.setTheme({
    black: 'black',
    red: 'red',
    green: 'green',
    yellow: 'yellow',
    blue: 'blue',
    magenta: 'magenta',
    cyan: 'cyan',
    white: 'white',
    gray: 'gray',
    grey: 'grey'
});


console.log(PF+"Startup".cyan);
function readInputFile(){
    return new Promise(async(result) => {
        console.log(PF+"Read File".yellow);
        fs.readFile('./input.txt', 'utf8', (err, data) => {
            if (err) {
                console.log(PF+"Read File Error".red);
                console.error(err);
                result(err);
            }
            console.log(PF+"Read File Success".green);
            result(data);
        });
    });
}

readInputFile().then(res => {
    console.log(PF+"Process Data".yellow);
    res = res.replace(/(?:\\[r]|[\r]+)+/g, "");
    var rows = res.split('\n');
    var pairs = new Array()
    rows.forEach(row => {
        var section1 = row.split(",")[0];
        var section2 = row.split(",")[1];

        var i = parseInt(section1.split("-")[0]);
        var end = parseInt(section1.split("-")[1]);
        var arr1 = new Array();
        while (i <= end) {arr1.push(i);i++;}
        var i = parseInt(section2.split("-")[0]);
        var end = parseInt(section2.split("-")[1]);
        var arr2 = new Array();
        while (i <= end) {arr2.push(i);i++;}
        var pair = {
            section1: {
                items: arr1,
                section: section1
            },
            section2: {
                items: arr2,
                section: section2
            }
        }
        pairs.push(pair);
    })
    console.log(PF+"Process Data Result: ".green + `Pairs[${pairs.length}]`);
    console.log(PF,"PART ONE".rainbow);
    var items = part1(copy(pairs));
    console.log(PF,"PART TWO".rainbow);
    part2(copy(items));
});

function part1(pairs){
    var counter = 0;
    var finalItems = new Array();
    pairs.forEach(pair => {
        counter++;
        var s1 = "";
        var s2 = "";
        var i = 0;
        while (i <= 100){
            if (pair.section1.items.indexOf(i) > -1) s1 += "█";
            else s1 += "_";
            i++;
        }
        var i = 0;
        while (i <= 100){
            if (pair.section2.items.indexOf(i) > -1) s2 += "█";
            else s2 += "_";
            i++;
        }
        var consumed = false;
        var overlap = false;
        var ss1 = {
            start: pair.section1.items[0],
            end: pair.section1.items[pair.section1.items.length-1]
        }
        var ss2 = {
            start: pair.section2.items[0],
            end: pair.section2.items[pair.section2.items.length-1]
        }
        if (ss1.start >= ss2.start && ss1.end <= ss2.end) consumed = true;
        if (ss2.start >= ss1.start && ss2.end <= ss1.end) consumed = true;
        if (ss1.start >= ss2.start && ss1.start <= ss2.end) overlap = true;
        if (ss2.start >= ss1.start && ss2.start <= ss1.end) overlap = true;
        var s0 = `\n\n                                PAIR ${counter}   OVERLAP ${overlap}   CONSUMED ${consumed}`;

        
        var display = {
            s0: s0,
            s1: s1,
            s2: s2,
            overlap: overlap,
            consumed: consumed
        }
        finalItems.push(display);
    });

    // Visualize
    visualize(finalItems,false,true);
    return finalItems;
}

function part2(finalItems) {
    visualize(finalItems,true,false);
}

function visualize(finalItems,overlapped,consumed) {
        // Visualize
        var showOnlyOverlapped = overlapped;
        var showOnlyConsumed = consumed;
        var filterCount = 0;
        var printSections = false;
        finalItems.forEach(item => {
            if (showOnlyOverlapped && !showOnlyConsumed){
                if (item.overlap){
                    if (printSections) {
                        console.log(item.s0);
                        console.log(item.s1);
                        console.log(item.s2);
                    }
                    filterCount++;
                }
            } else if (showOnlyConsumed && !showOnlyOverlapped) {
                if (item.consumed){
                    if (printSections) {
                        console.log(item.s0);
                        console.log(item.s1);
                        console.log(item.s2);
                    }
                    filterCount++;
                }
            } else if (showOnlyConsumed && showOnlyOverlapped) {
                if (item.consumed && item.overlap){
                    if (printSections) {
                        console.log(item.s0);
                        console.log(item.s1);
                        console.log(item.s2);
                    }
                    filterCount++;
                }
            }
        });
        var totals = {FilterCount: filterCount};
        console.log(totals);
}
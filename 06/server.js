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
    rows.forEach(row => {
    })
    console.log(PF+"Process Data Result: ".green + `Chars[${rows.length}]`);
    console.log(PF,"PART ONE".rainbow);
    part1(copy(rows));
    console.log(PF,"PART TWO".rainbow);
    part2(copy(rows));
});
function part1(rows){
    var matches = new Array();
    var limit = 3;
    var i = 0;
    while (i < limit) {
        matches.push(rows[0][i]);
        i++;
    }
    while (i < rows[0].length) {
        matches.push(rows[0][i]);
        if (i > limit) {
            matches.shift();
        }
        var duplicates = matches.filter((item, index) => matches.indexOf(item) != index);
        if (duplicates.length == 0) {
            console.log(i+1,matches,duplicates);
            break;
        }
        i++;
    }
}

function part2(rows){
    var matches = new Array();
    var limit = 13;
    var i = 0;
    while (i < limit) {
        matches.push(rows[0][i]);
        i++;
    }
    while (i < rows[0].length) {
        matches.push(rows[0][i]);
        if (i > limit) {
            matches.shift();
        }
        var duplicates = matches.filter((item, index) => matches.indexOf(item) != index);
        if (duplicates.length == 0) {
            console.log(i+1,matches,duplicates);
            break;
        }
        i++;
    }
}
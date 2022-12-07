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
    var commands = new Array()
    rows.forEach(row => {
        row = row.replace(/ /g,"");
        row = row.replace("move", "");
        row = row.replace("from", "-");
        row = row.replace("to", "-");
        var items = row.split("-");
        var cmd = {
            from: items[1],
            to: items[2],
            amount: items[0]
        }
        commands.push(cmd);
    })
    console.log(PF+"Process Data Result: ".green + `Pairs[${commands.length}]`);
    console.log(PF,"PART ONE".rainbow);
    part1(copy(commands));
    console.log(PF,"PART TWO".rainbow);
    part2(copy(commands));
});

var Supplies = [
    ['B','L','D','T','W','C','F','M'],
    ['N','B','L'],
    ['J','C','H','T','L','V'],
    ['S','P','J','W'],
    ['Z','S','C','F','T','L','R'],
    ['W','D','G','B','H','N','Z'],
    ['F','M','S','P','V','G','C','N'],
    ['W','Q','R','J','F','V','C','Z'],
    ['R','P','M','L','H']
]

var Supplies2 = [
    ['B','L','D','T','W','C','F','M'],
    ['N','B','L'],
    ['J','C','H','T','L','V'],
    ['S','P','J','W'],
    ['Z','S','C','F','T','L','R'],
    ['W','D','G','B','H','N','Z'],
    ['F','M','S','P','V','G','C','N'],
    ['W','Q','R','J','F','V','C','Z'],
    ['R','P','M','L','H']
]

var Supplies1 = [
    ['Z','N'],
    ['M','C','D'],
    ['P']
]

function part1(commands){
    commands.forEach(command => {
        execute(command);
    })
    var msg = "";
    Supplies.forEach(row => {
        msg += row[row.length-1];
    })
    var totals = {Result: msg};
    console.log(totals);
}

function part2(commands) {
    commands.forEach(command => {
        moveCount(command.from-1,command.to-1,command.amount);
    })
    var msg = "";
    Supplies2.forEach(row => {
        msg += row[row.length-1];
    })
    var totals = {Result: msg};
    console.log(totals);
}

function execute(cmd) {
    var i = 0;
    while (i < cmd.amount) {
        move(cmd.from-1,cmd.to-1);
        i++;
    }
}

function move(from,to) {
    Supplies[to].push(Supplies[from][Supplies[from].length-1]);
    Supplies[from].pop();
}

function moveCount(from,to,amt) {
    var moved = new Array();
    var i = 0;
    while (i < amt) {
        moved.push(Supplies2[from][Supplies2[from].length -1]);
        Supplies2[from].pop();
        i++;
    }
    moved.reverse();
    moved.forEach(m1 => {
        Supplies2[to].push(m1);
    })
}
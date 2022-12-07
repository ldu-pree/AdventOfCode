const fs = require('fs');
var colors = require('colors');
colors.enable();
var PF = "Finchoice".blue+":";

Array.prototype.max = function() {
    return Math.max.apply(null, this);
};
  
Array.prototype.min = function() {
    return Math.min.apply(null, this);
};

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


console.log(PF,"Startup".cyan);
function readInputFile(){
    return new Promise(async(result) => {
        console.log(PF,"Read File".yellow);
        fs.readFile('./input.txt', 'utf8', (err, data) => {
            if (err) {
                console.log(PF,"Read File Error".red);
                console.error(err);
                result(err);
            }
            console.log(PF,"Read File Success".green);
            result(data);
        });
    });
}

readInputFile().then(res => {
    res.replace(/\\r/g,"");
    console.log(PF,"Process Data".yellow);
    var i = 0;
    var count = 0;
    var elves = new Array();
    var item = "";
    var elf = {
        snacks: new Array(),
        total: 0
    }
    while (i < res.length) {
        if (res[i] == '\n') {
            if (item.length == 1) {
                elves.push(elf);
                elf = {
                    snacks: new Array(),
                    total: 0
                }
            } else {
                elf.snacks.push(item);
                elf.total += parseInt(item);
            }
            count++;
            item = ""
        } else {
            item += res[i];
        }
        i++;
    }
    console.log(PF,"Process Data Result: ".green + `Iterate[${i}] Count[${count}]`);
    var total = 0;
    elves.forEach(elf1 => {
        if (elf1.total > total) total = elf1.total;
    });
    console.log(PF,"Most Snacks:".magenta,total);

    
    console.log(PF,"PART TWO".rainbow);

    var top1 = 0;
    var top2 = 0;
    var top3 = 0;
    elves.forEach(elf1 => {
        var comp = elf1.total;
        if (comp > top1) {
            top3 = top2;
            top2 = top1;
            top1 = comp;
        } else if (comp > top2) {
            top3 = top2;
            top2 = comp;
        } else if (comp > top3) {
            top3 = comp;
        }
    });
    console.log(PF,"Top3:".magenta,top1, top2, top3,"Total:".green, top1+top2+top3);
})
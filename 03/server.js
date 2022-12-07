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
    var bags = new Array()
    rows.forEach(row => {
        var section1 = row.substr(0,(row.length/2));
        var section2 = row.substr((row.length/2),row.length);
        var bag = {
            combined: row,
            compartment1: section1,
            compartment2: section2,
            shared: "",
            priority: 0
        }
        var i = 0;
        while (i <= section1.length) {
            if (section2.indexOf(section1[i]) > -1 && bag.shared.indexOf(section1[i]) == -1){
                bag.shared += section1[i];
                var prio = bag.shared.charCodeAt(0)-38;
                if (prio >= 59) prio -= 58;
                bag.priority = prio;
            }
            i++;
        }
        bags.push(bag);
    })
    console.log(PF+"Process Data Result: ".green + `bags[${bags.length}]`);
    console.log(PF,"PART ONE".rainbow);
    part1(copy(bags));
    console.log(PF,"PART TWO".rainbow);
    part2(copy(bags));
});

function part1(bags){
    var PrioSum = 0;
    var Count = 0;
    bags.forEach(bag => {
        if (bag.shared.length >= 1) {
            PrioSum += bag.priority;
            Count++;
        }
    })
    var totals = {Priority: PrioSum, BagsWithShared: Count, totalBags: bags.length-1};
    console.log(totals);
}

function part2(bags){
    var i = 0;
    var elfGroups = new Array()
    var elves = new Array();
    while (i < bags.length) {
        if ((i+1) % 3 == 0) {
            elves.push(bags[i]);
            var bag1 = elves[0].combined;
            var bag2 = elves[1].combined;
            var bag3 = elves[2].combined;
            var regex = new RegExp(`[${bag2}]`,'g');
            var shared = bag1.match(regex);
            console.log(shared,regex);
            var new2 = shared.toString();
            var regex2 = new RegExp(`[${bag3}]`,'g');
            var final = new2.match(regex2);
            console.log(final,regex2);
            if (!final) final = "a";
            final = final.toString().replace(/,/g,"");
            var prio = final.charCodeAt(0)-38;
            if (prio >= 59) prio -= 58;
            var group = {
                elves: elves,
                shared: shared.toString().replace(/,/g,""),
                final: final,
                priority: prio
            }
            elfGroups.push(group);
            elves = new Array();
        } else {
            elves.push(bags[i]);
        }
        i++;
    }
    var PrioSum = 0;
    var Count = 0;
    elfGroups.forEach(grop => {
        PrioSum += grop.priority;
        Count++;
        // console.log(grop.elves[0].combined,grop.elves[1].combined,grop.elves[2].combined,"\n1 : 2 Match",grop.shared,"\n2 : 3 Match",grop.final,"\nPrio",grop.priority);
    });
    var totals = {Priority: PrioSum, elfGroups: Count, totalBags: bags.length-1};
    console.log(totals);
}
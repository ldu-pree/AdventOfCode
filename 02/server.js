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
    res.replace(/(?:\\[r])+/g, "");
    console.log(PF+"Process Data".yellow);
    var i = 0;
    var count = 0;
    var plays = new Array();
    var item = "";
    while (i < res.length) {
        if (res[i] == '\n') {
            item = item.replace(/(?:\\[rn]|[\r\n]+)+/g, "");
            var play = {
                Them: {
                    Move: item[0],
                    Score: 0
                },
                Me: {
                    Move: item[2],
                    Score: 0
                }
            }
            plays.push(play);
            count++;
            item = ""
        } else {
            item += res[i];
        }
        i++;
    }
    console.log(PF+"Process Data Result: ".green + `Iterate[${i}] Count[${count}]`);

    //calculate scores
    var input = JSON.stringify(plays);
    var p1plays = part1(JSON.parse(input));
    var totals = {Me: 0, Them: 0, Plays: p1plays.length};
    p1plays.forEach(play => {
        totals.Me += play.Me.Score;
        totals.Them += play.Them.Score;
    });
    console.log(totals);
    var p2plays = part2(JSON.parse(input));
    var totals = {Me: 0, Them: 0, Plays: p2plays.length};
    p2plays.forEach(play => {
        totals.Me += play.Me.Score;
        totals.Them += play.Them.Score;
    });
    console.log(totals);
});

function part1(plays){
    plays.forEach(play => {
        switch (play.Them.Move) {
            case "A": // Rock 1
                play.Them.Score += 1;
                switch (play.Me.Move) {
                    case "X": // Rock 1
                        play.Me.Score += 1;
                        play.Them.Score += 3;
                        play.Me.Score += 3;
                    break;
                    case "Y": // Paper 2
                        play.Me.Score += 2;
                        play.Them.Score += 0;
                        play.Me.Score += 6;
                    break;
                    case "Z": // Scis 3
                        play.Me.Score += 3;
                        play.Them.Score += 6;
                        play.Me.Score += 0;
                    break;
                }
            break;
            case "B": // Paper 2
                play.Them.Score += 2;
                switch (play.Me.Move) {
                    case "X": // Rock 1
                        play.Me.Score += 1;
                        play.Them.Score += 6;
                        play.Me.Score += 0;
                    break;
                    case "Y": // Paper 2
                        play.Me.Score += 2;
                        play.Them.Score += 3;
                        play.Me.Score += 3;
                    break;
                    case "Z": // Scis 3
                        play.Me.Score += 3;
                        play.Them.Score += 0;
                        play.Me.Score += 6;
                    break;
                }
            break;
            case "C": // Scis 3
                play.Them.Score += 3;
                switch (play.Me.Move) {
                    case "X": // Rock 1
                        play.Me.Score += 1;
                        play.Them.Score += 0;
                        play.Me.Score += 6;
                    break;
                    case "Y": // Paper 2
                        play.Me.Score += 2;
                        play.Them.Score += 6;
                        play.Me.Score += 0;
                    break;
                    case "Z": // Scis 3
                        play.Me.Score += 3;
                        play.Them.Score += 3;
                        play.Me.Score += 3;
                    break;
                }
            break;
        }
    });
    return plays;
}


function part2(plays){
    var mapper = {
        Rock: 1,
        Paper: 2,
        Scissors: 3
    }
    var draw = 3;
    var loss = 0;
    var win = 6;
    plays.forEach(play => {
        switch (play.Them.Move) {
            case "A": // Rock 1
                play.Them.Score += mapper.Rock;
                switch (play.Me.Move) {
                    case "X": // Lose
                        play.Me.Score += mapper.Scissors;
                        play.Them.Score += win;
                        play.Me.Score += loss;
                    break;
                    case "Y": // Draw
                        play.Me.Score += mapper.Rock;
                        play.Them.Score += draw;
                        play.Me.Score += draw;
                    break;
                    case "Z": // Win
                        play.Me.Score += mapper.Paper;
                        play.Them.Score += loss;
                        play.Me.Score += win;
                    break;
                }
            break;
            case "B": // Paper 2
                play.Them.Score += mapper.Paper;
                switch (play.Me.Move) {
                    case "X": // Lose
                        play.Me.Score += mapper.Rock;
                        play.Them.Score += win;
                        play.Me.Score += loss;
                    break;
                    case "Y": // Draw
                        play.Me.Score += mapper.Paper;
                        play.Them.Score += draw;
                        play.Me.Score += draw;
                    break;
                    case "Z": // Win
                        play.Me.Score += mapper.Scissors;
                        play.Them.Score += loss;
                        play.Me.Score += win;
                    break;
                }
            break;
            case "C": // Scis 3
                play.Them.Score += mapper.Scissors;
                switch (play.Me.Move) {
                    case "X": // Lose
                        play.Me.Score += mapper.Paper;
                        play.Them.Score += win;
                        play.Me.Score += loss;
                    break;
                    case "Y": // Draw
                        play.Me.Score += mapper.Scissors;
                        play.Them.Score += draw;
                        play.Me.Score += draw;
                    break;
                    case "Z": // Win
                        play.Me.Score += mapper.Rock;
                        play.Them.Score += loss;
                        play.Me.Score += win;
                    break;
                }
            break;
        }
    });
    return plays;
}
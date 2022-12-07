const fs = require('fs');
var colors = require('colors');
colors.enable();
var PF = "FinchoiceAoC".blue+": ";

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
    var commands = new Array();
    var cmd = {
        command: "",
        result: []
    }
    var prevCmd = "";
    var finalCmd = "";
    var i = 0;
    rows.forEach(row => {
        if (row[0] == "$") {
            nextCmd = row;
            cmd.command = prevCmd;
            commands.push(copy(cmd));
            prevCmd = nextCmd;
            cmd.command = prevCmd;
            finalCmd = copy(cmd);
            cmd.result = [];
            i++;
        } else {
            cmd.result.push(row);
        }
    })
    commands.push(copy(cmd));
    console.log(PF+"Process Data Result: ".green + `Commands[${rows.length}]`);
    console.log(PF,"PART ONE".rainbow);
    part1(copy(commands));
    console.log(PF,"PART TWO".rainbow);
    part2();
});

class Directory {
    constructor(name,parent){
        this.name = name;
        this.size = 0;
        this.parent = parent;
        this.children = new Array();
        this.contents = new Array();
    }

    setDetails(name,parent) {
        this.name = name;
        this.parent = parent;
    }

    getParent() {
        return this.parent;
    }

    getName() {
        return this.name;
    }

    addDirectory(dir) {
        this.children.push(dir);
    }

    addFile(file) {
        this.contents.push(file);
        this.size += file.getSize();
    }

    gotoDir(name) {
        var res = this.children.filter(child => {return child.getName() == name});
        return res[0];
    }
}

class File {
    constructor(name,parent,size){
        this.name = name;
        this.size = size;
        this.parent = parent;
    }
    
    getSize() {
        return this.size;
    }
}

//#region GLOBALS
/*
**
*******GLOBALS*******
**
*/

var FileSystem = {
    Root: new Directory("/","")
}

var Directories = new Array();

var ShowTree = true;
var totalSystemCapacity = 70000000;
var neededCapacity = 30000000;
var maxFileThreshold = 100000;
var treeMSG = "";

//#endregion

function part1(commands){
    var currentDir = FileSystem.Root;
    commands.forEach(cmd => {
        if (cmd.command == '') return;
        var data = cmd.command.split(" ");
        switch (data[1]) {
            case "cd":
                if (data[2] == "/") return;
                if (data[2] == "..") {
                    currentDir = currentDir.getParent();
                } else {
                    currentDir = currentDir.gotoDir(data[2]);
                }
            break;
            case "ls":
                cmd.result.forEach(res => {
                    if (currentDir.getName == "") return;
                    var data2 = res.split(" ");
                    if (data2[0] == "dir") {
                        currentDir.addDirectory(new Directory(data2[1],currentDir));
                    } else {
                        currentDir.addFile(new File(data2[1],currentDir.getName(),parseInt(data2[0])));
                    }
                });
            break;
        }
    });
    FileSystem.Root.size += updateSize(FileSystem.Root);
    logDetails(FileSystem.Root,"  ");
    if (ShowTree) console.log(`${"> ".magenta}Is A Directory ${"> ".magenta}Name Size\n${"- ".cyan}Is A File      ${"- ".cyan}Name Size\n\n${"FILESYSTEM:".bold}`);
    if (ShowTree) console.log(`${"> ".magenta}${FileSystem.Root.name} ${FileSystem.Root.size}\n${treeMSG}${"Result:".bold}`);
    console.log({TotalDirectories: Directories.length});
    var below100 = Directories.filter(dir => {return dir.size <= maxFileThreshold});
    var totalSize = 0;
    below100.forEach(dir => {totalSize += dir.size});
    console.log({DirectoriesBelowThreshold: below100.length, SumOfSize: totalSize});
}

function logDetails(Directory,Spacer) {
    Directory.children.forEach(dir => {
        Directories.push(dir);
        if (ShowTree) treeMSG += `${Spacer}${"> ".magenta}${dir.name} ${dir.size}\n`;
        logDetails(dir,Spacer+" ");
    });
    Directory.contents.forEach(file => {
        if (ShowTree) treeMSG += `${Spacer}${"- ".cyan}${file.name} ${file.size}\n`;
    });
}


function updateSize(Directory) {
    var totalSize = 0;
    Directory.children.forEach(dir => {
        dir.size += updateSize(dir);
        totalSize += dir.size;
    });
    return totalSize;
}

function part2() {
    var availableCapacity = totalSystemCapacity - FileSystem.Root.size;
    var spaceNeeded = neededCapacity - availableCapacity;
    var selectedDir = FileSystem.Root;
    console.log({Available: availableCapacity, Needed: neededCapacity, NeedToFree: spaceNeeded});
    Directories.forEach(dir => {
        if (dir.size < selectedDir.size && dir.size >= spaceNeeded) {
            selectedDir = dir;
        }
    });
    console.log({DirectoryName: selectedDir.name, DirectorySize: selectedDir.size});
}
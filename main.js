/**
txt-markup txtFileDir
*/
"use strict";
let chokidar = require('chokidar'),
    fs = require('fs'),
    walk = require('walk'),
    path = require('path'),
    watchDir = process.argv[2].replace(/\//gi, "").replace(/\\/gi, ""),
    txtFiles = [];
function lineLimit(line, lineWidth){
    if(line.length <= lineWidth)
        return line;
    let split = line.split(/\s/gi),
        join = "",
        rJoin = "",
        toggle = false;
    if(split.length == 1)
        return line;
    for(let i = 0, l = split.length, s; i < l; i++){
        s = split[i];
        if(!toggle && ((join + " " + s).length <= lineWidth)){
            join += " " + s;
        } else {
            toggle = true; // all elements will now go to rJoin
            rJoin += " " + s;
        }
    }
    return [lineLimit(join, lineWidth).trim(), lineLimit(rJoin, lineWidth).trim()].join("\n");
}
function center(line, lineWidth){
    let idealPadding = lineWidth - line.length,
        lPadding = Math.floor(idealPadding / 2),
        rPadding = lineWidth - line.length - lPadding;
    for(;lPadding--;)
        line = " " + line;
    for(;rPadding--;)
        line += " ";
    return line;
}
function generate(char, num){
    let out = "";
    for(; num--;)
        out += char;
    return out;
}
function parseUp(content){
    let lines = content.split("\n"),
        linesOut = [];
    
    let lineWidth = 100;
    for(let _line of lines){
        let line = _line.trim();
        if(line.indexOf("\\%") == 0){
            linesOut.push(line.substr(1));
            continue;
        }
        if(line.indexOf("%") == 0) {
            let command = line.match(/^%.+%/)[0].replace(/%/gi, "").toLowerCase(),
                _line = line.replace(/^%.+%/, "");
            if(command == "c"){
                linesOut.push(center(_line.trim(), lineWidth));
                continue;
            }
            /*if(command == "h1"){
                let theLine = _line.trim();
                linesOut.push(center(generate("#", theLine.length+4), lineWidth));
                linesOut.push(center("# " + theLine + " #", lineWidth));
                linesOut.push(center(generate("#", theLine.length+4), lineWidth));
            }*/
            if(command == "h1"){
                let theLine = _line.trim();
                linesOut.push(center("# " + _line.trim() + " #", lineWidth));
            }
            if(command == "h2"){
                let theLine = _line.trim();
                linesOut.push("     " + _line.trim());
            }
            if(command.indexOf("docwidth") == 0){
                lineWidth = parseInt(command.split("=")[1]);
                continue;
            }
        } else {
            linesOut.push(lineLimit(line, lineWidth));
        }
    }
    return linesOut.join("\n");
}
function parseTxtFile(fpath){
    let txt = fs.readFileSync(fpath, 'utf8', () => {console.log(arguments)}),
        parsed = parseUp(txt);
    fs.writeFile(fpath.replace(/\.txtup$/gi, ".txt"), parsed, (err)=>{
        if (err)
            throw err;
        console.log("    Updated ", fpath.replace(/\.txtup$/gi, ".txt"));
    });
}
function init(){
    console.log("Init");
    let fileWalker = walk.walk(__dirname + "\\" + watchDir, { followLinks: false });
    fileWalker.on('file', (root, stat, next) => {
        let fExt = path.extname(stat.name).toLowerCase();
        // Aparently node-sass can't compile sass, lol
        if([".txtup"].indexOf(fExt) > -1){
            txtFiles.push((root + '/' + stat.name).replace(/\//, "\\"));
        }
        next();
    });
    // When everything is walked, watch the file, and re-compile if compileOnRun == true
    fileWalker.on('end', () => {
        for(let tfile of txtFiles){
            let watcher = chokidar.watch(tfile);
            watcher.on('change', (fpath) => {
                console.log("> Change detected to: ", fpath);
                parseTxtFile(fpath);
            });
            parseTxtFile(tfile);
        }
    });
}

init();

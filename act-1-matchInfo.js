// lib :- minimist, fs, axios, jsdom, excel4node, pdf-lib

// Isme m ek Aur task add krna chahta hu;
// Abhi ye jaise hamne starting activity m kiya hai na;
// Team-Wise Data, wahi chahiye mereko;

// Iske liye HashMap type structure required hai;
// Jo ki ES6 m ata hai end m;

// Jab vo ho jaye to plz ek XL sheet uski bhi bana dena;

let minimist = require("minimist");
let fs = require("fs");
let axios = require("axios");

let jsdom = require("jsdom");
let excel = require("excel4node");

// node act-1-matchInfo.js --download=downHtml.html --url="https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results" --dest=worldCup2019.xlsx

let args = minimist(process.argv);

// console.log(args);


// Task1 : Downloading data;

let dldPromise = axios.get(args.url);

dldPromise.then(function(response) {
    let h = response.data;
    fs.writeFileSync(args.download, h, "utf-8");
    // console.log(html);

    // Task2 : Parsing HTML to get the objects of data;

    let matches = [];

    let html = fs.readFileSync(args.download, "utf-8");

    // Bhai jo bhi read karo use DOM banane k liye use kro
    let dom = new jsdom.JSDOM(html);
    let document = dom.window.document;


    let card = document.querySelectorAll("div.match-score-block");

    // Ye sahi deta hai;
    // Isse vo garbage values nhi ayegi

    for (let i = 0; i < card.length; i++) {

        let match = {};

        let desc = card[i].querySelectorAll("div.match-info>div.description");

        let teams = card[i].querySelectorAll("div.team>div.name-detail>p");

        let score = card[i].querySelectorAll("div.team>div.score-detail>span.score");

        let results = card[i].querySelectorAll("div.match-info>div.status-text>span");


        match.desc = desc[0].textContent;
        match.t1 = teams[0].textContent;
        if (score[0] != undefined) {
            match.score1 = score[0].textContent;
        } else {
            match.score1 = '0/0';
        }
        match.t2 = teams[1].textContent;

        if (score[1] != undefined) {
            match.score2 = score[1].textContent;
        } else {
            match.score2 = '0/0';
        }
        match.res = results[0].textContent;

        // console.log(match);

        matches.push(match);

    }

    // console.log(matches);


    // Task3 : Making the Excel File

    let workbook = new excel.Workbook();

    let hstyle = workbook.createStyle({
        font: {
            size: 15,
            bold: true,
            color: "white"
        },
        fill: {
            type: "pattern",
            patternType: "solid",
            fgColor: "black"
        }
    });

    let nstyle = workbook.createStyle({
        font: {
            size: 15,
            bold: true,
        },
    });

    // Problem mil gyi guys;
    // Dekho parallel processing ki vajah se data matches m ata hi nhi hai;
    // Par ham xl file banane lagte jiki vajah no workSheets are created
    // Isliye hamne fs.readFile() ki jagah fs.readFileSync() use kiya.

    // Ab I hope ki ye sahi chalega;


    for (let i = matches.length - 1; i >= 0; i--) {


        let desc = matches[i].desc;

        let str = desc.split(", ");

        let matchNo = str[0];
        let loc = str[1];
        let date = str[2];


        let workSheet = workbook.addWorksheet(matchNo);

        workSheet.cell(1, 1).string("Location").style(hstyle);
        workSheet.cell(1, 2).string(loc).style(nstyle);
        workSheet.cell(2, 1).string("Date").style(hstyle);
        workSheet.cell(2, 2).string(date).style(nstyle);



        workSheet.cell(4, 1).string("Team").style(hstyle);
        workSheet.cell(4, 2).string("Score").style(hstyle);

        workSheet.cell(5, 1).string(matches[i].t1).style(nstyle);
        workSheet.cell(5, 2).string(matches[i].score1).style(nstyle);

        workSheet.cell(6, 1).string(matches[i].t2).style(nstyle);
        workSheet.cell(6, 2).string(matches[i].score2).style(nstyle);

        workSheet.cell(8, 1).string("Result").style(hstyle);
        workSheet.cell(8, 2).string(matches[i].res).style(nstyle);

    }

    workbook.write(args.dest);

}).catch(function(err) {
    console.log("Writing Failed");
});
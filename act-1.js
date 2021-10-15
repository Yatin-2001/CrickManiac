let minimist = require("minimist");
let fs = require("fs");
let axios = require("axios");

let jsdom = require("jsdom");
let excel = require("excel4node");

let pdf = require("pdf-lib");
let path = require("path");

// node act-1.js --download=downHtml.html --url="https://www.espncricinfo.com/series/icc-cricket-world-cup-2019-1144415/match-results" --dest=teams.xlsx --json=teams.json --template=template.pdf --folder=Teams

let args = minimist(process.argv);

/*

// Task1 : Downloading data;

let dldPromise = axios.get(args.url);

dldPromise.then(function(response) {

    let h = response.data;
    fs.writeFileSync(args.download, h, "utf-8");
    // console.log(html);

    
}).catch(function(err) {
    console.log("Writing Failed");
});
*/

// Task2 : Parsing HTML to get the objects of data;

let matches = [];

let html = fs.readFileSync(args.download, "utf-8");

// Bhai jo bhi read karo use DOM banane k liye use kro
let dom = new jsdom.JSDOM(html);
let document = dom.window.document;


let card = document.querySelectorAll("div.match-score-block");

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


// Ab ham teams k Hissab se data layenge;
// This will be done using the matches array;

let teams = [];

populateteams(teams, matches);

addingTeamMatches(teams, matches);

let json = JSON.stringify(teams);

fs.writeFileSync(args.json, json, "utf-8");

makeExcel(teams);

makingPDF(teams);


function populateteams(teams, matches) {

    for (let i = 0; i < matches.length; i++) {

        let pos1 = -1;

        for (let j = 0; j < teams.length; j++) {
            if (matches[i].t1 == teams[j].name) {
                pos1 = j;
                break;
            }
        }

        if (pos1 == -1) {
            teams.push({
                name: matches[i].t1,
                matches: []
            });
        }

        let pos2 = -1;

        for (let j = 0; j < teams.length; j++) {
            if (matches[i].t2 == teams[j].name) {
                pos2 = j;
                break;
            }
        }

        if (pos2 == -1) {
            teams.push({
                name: matches[i].t2,
                matches: []
            });
        }

    }

}


function addingTeamMatches(teams, matches) {

    for (let i = 0; i < matches.length; i++) {

        let pos1 = -1;

        for (let j = 0; j < teams.length; j++) {
            if (matches[i].t1 == teams[j].name) {
                pos1 = j;
                break;
            }
        }

        teams[pos1].matches.push({
            vs: matches[i].t2,
            selfScore: matches[i].score1,
            oppScore: matches[i].score2,
            res: matches[i].res
        });

        let pos2 = -1;

        for (let j = 0; j < teams.length; j++) {
            if (matches[i].t2 == teams[j].name) {
                pos2 = j;
                break;
            }
        }

        teams[pos2].matches.push({
            vs: matches[i].t1,
            selfScore: matches[i].score2,
            oppScore: matches[i].score1,
            res: matches[i].res
        });

    }

}

function makeExcel(teams) {
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

    for (let i = 0; i < teams.length; i++) {

        let workSheet = workbook.addWorksheet(teams[i].name);

        workSheet.cell(1, 1).string("Opponent").style(hstyle);
        workSheet.cell(1, 2).string("SelfScore").style(hstyle);
        workSheet.cell(1, 3).string("OppScore").style(hstyle);
        workSheet.cell(1, 4).string("Result").style(hstyle);

        for (let j = 0; j < teams[i].matches.length; j++) {

            let match = teams[i].matches[j];

            workSheet.cell(j + 2, 1).string(match.vs).style(nstyle);
            workSheet.cell(j + 2, 2).string(match.selfScore).style(nstyle);
            workSheet.cell(j + 2, 3).string(match.oppScore).style(nstyle);
            workSheet.cell(j + 2, 4).string(match.res).style(nstyle);

        }

    }

    workbook.write(args.dest);
}

function makingPDF(teams) {

    // First create the Forlders;

    for (let i = 0; i < teams.length; i++) {

        let folderName = path.join(args.folder, teams[i].name);
        // console.log(folderName);
        fs.mkdirSync(folderName);

        let numOpp = [];
        getRepName(teams[i].matches, numOpp);

        // console.log(numOpp);

        for (let j = 0; j < teams[i].matches.length; j++) {

            // Implementing a method to solve the problem of 
            // Match over writing and thus wrong data;

            let name = teams[i].matches[j].vs;

            let ind = -1;

            for (let k = 0; k < numOpp.length; k++) {
                if (numOpp[k].name == teams[i].matches[j].vs) {
                    ind = k;
                    break;
                }
            }

            if (numOpp[ind].rep > 1) {
                name = name + (numOpp[ind].rep - 1);
                numOpp[ind].rep = numOpp[ind].rep - 1;
            }



            let fileName = path.join(folderName, name + ".pdf");

            // let fileName = path.join(folderName, teams[i].matches[j].vs + ".pdf");

            createScoreCard(teams[i].matches[j], teams[i].name, fileName);

            // console.log(fileName);


        }

    }

}

function getRepName(teams, numOpp) {


    for (let i = 0; i < teams.length; i++) {
        let ind = -1;

        for (let j = 0; j < numOpp.length; j++) {
            if (teams[i].vs == numOpp[j].name) {
                ind = j;
                break;
            }
        }

        if (ind == -1) {
            numOpp.push({
                name: teams[i].vs,
                rep: 1
            });
        } else {
            numOpp[ind].rep++;
        }

    }

}


function createScoreCard(match, teamName, fileName) {

    // Ab pdf-lib use krni hai;

    let bytes = fs.readFileSync("Template.pdf");

    let promiseToLoad = pdf.PDFDocument.load(bytes);

    promiseToLoad.then(function(pdfDoc) {

        // now Pdf can have many pages, so we use .getPage()
        let page = pdfDoc.getPage(0);

        let name = teamName;

        page.drawText(name, {
            x: 320,
            y: 665,
            size: 12
        });

        page.drawText(match.selfScore, {
            x: 320,
            y: 650,
            size: 12
        });

        page.drawText(match.vs, {
            x: 320,
            y: 632,
            size: 12
        });

        page.drawText(match.oppScore, {
            x: 320,
            y: 615,
            size: 12
        });

        page.drawText(match.res, {
            x: 202,
            y: 574,
            size: 10
        });

        let promiseToSave = pdfDoc.save();

        promiseToSave.then(function(changedBytes) {

            fs.writeFileSync(fileName, changedBytes);

        });

    });


}


// Dekho We have a big problem in normal Code;
// This occurs because bhai we can't have 2 file names Same;
// So we need to make a check;
// Now we need to think about it carefully;

// And implement a system to account for that;
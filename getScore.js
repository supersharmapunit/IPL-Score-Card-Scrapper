let cheerio = require('cheerio');
let path = require('path');
let fs = require('fs')

function getData(html) {
    console.log('=========================================');
    let searchTool = cheerio.load(html);
    let teamNameEle = searchTool('.name-link');
    let inning = searchTool('.Collapsible')

    for (let i = 0; i < inning.length; i++) {
        let team = searchTool(teamNameEle[i]).find('.name').text();
        process.stdout.write(team);
        let winStat = searchTool('.match-info.match-info-MATCH.match-info-MATCH-half-width .score');
        let flag = true;
        for (let i = 0; i < winStat.length - 1; i++) {
            let t1S = searchTool(winStat[i]).text().split('/');
            let t2S = searchTool(winStat[i + 1]).text().split('/');
            if (t1S[0] < t2S[0]) flag = false;
        }

        if (flag == true && i == 0) {
            process.stdout.write(' (won)');
        }
        if (flag == false && i == 1) {
            process.stdout.write(' (won)');
        }

        console.log();
        for (let i = 0; i < team.length; i++) {
            process.stdout.write('-');
        }
        console.log();
        console.log();


        let batsManArray = searchTool(inning[i]).find('.Collapsible .batsman');


        let playerRow = searchTool(batsManArray).find('tbody tr')
        for (let j = 0; j < playerRow.length; j++) {
            let player = searchTool(playerRow[j]).find('td');

            if (player.length == 8) {
                let playerName = searchTool(player[0]).text();
                let run = searchTool(player[2]).text();
                let ball = searchTool(player[3]).text();
                let fours = searchTool(player[5]).text();
                let sixes = searchTool(player[6]).text();
                processPlayers(playerName, team, run, ball, fours, sixes);
            }
        }
        if (i == 0) console.log('***************  V/S  ***************');
    }
}

function processPlayers(playerName, teamName, run, ball, fours, sixes) {
    let obj = {
        playerName, teamName, run, ball, fours, sixes
    }

    let dirPath = path.join(__dirname, teamName);
    // folder
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }

    // playerFile
    let playerFilePath = path.join(dirPath, playerName + '.json');
    let playerArr = [];

    if (!fs.existsSync(playerFilePath)) playerArr.push(obj);
    else {
        // append
        playerArr = getContent(playerFilePath);
        playerArr.push(obj);
    }

    // write in the files
    writeContent(playerFilePath, playerArr);
}

function getContent(playerFilePath){
    let content = fs.readFileSync(playerFilePath);
    return JSON.parse(content);
}

function writeContent(playerFilePath, playerArr){
    let jsonData = JSON.stringify(playerArr);
    fs.writeFileSync(playerFilePath, jsonData);
}
module.exports = {
    fn: getData
}
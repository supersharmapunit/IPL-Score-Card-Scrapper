let cheerio = require('cheerio');
let request = require('request');

let url = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard';
request(url, cb);

function cb(error, response, html) {
    if (error) {
        console.log(error);
    } else if (response.statusCode == 404) {
        console.log('Page not found');
    } else {
        getData(html);
    }
}

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

        // show batsman
        for (let i = 0; i < inning.length; i++){
            let batsManArray = searchTool(inning[i]).find('.Collapsible .batsman tbody tr');
            for (let name = 0; name < batsManArray.length - 1; name++) {
                let playerRow = searchTool(batsManArray[name]).find('td');
                
                if (playerRow.length == 8) {
                    console.log(searchTool(playerRow[0]).text());
                }
    
            }
        }
        if (i < teamNameEle.length - 1) console.log('***************  V/S  ***************');
        else console.log();
    }
}
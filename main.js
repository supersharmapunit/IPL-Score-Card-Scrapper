let request = require("request");
let cheerio = require("cheerio");

let homePageLink = "https://www.espncricinfo.com/series/ipl-2020-21-1210595"

request(homePageLink, cb);

function cb(error, response, html) {
    if (error) {
        console.log(error);
    } else if (response.statusCode == 404) {
        console.log('Page not found');
    } else {
        viewAllClick(html);
    }
}

function viewAllClick(html) {
    let searchTool = cheerio.load(html);
    let viewAllEle = searchTool('.widget-items.cta-link>a');
    let viewAllEleLink = viewAllEle.attr("href").trim();

    let nextPageLink = `https://www.espncricinfo.com${viewAllEleLink}`;
    request(nextPageLink, scoreCardCB);
}

function scoreCardCB(error, response, html) {
    if (error) {
        console.log(error);
    } else if (response.statusCode == 404) {
        console.log('Page not found');
    } else {
        scoreCardTiles(html);
    }
}

function scoreCardTiles(html) {
    let searchTool = cheerio.load(html);
    let tileEle = searchTool('a[data-hover="Scorecard"]');
    for (let i = 0; i < tileEle.length; i++) {
        let scoreCardLink = searchTool(tileEle[i]).attr('href');
        let nextPageLink = `https://www.espncricinfo.com${scoreCardLink}`;
        request(nextPageLink, getTeamsCB);

    }
}

function getTeamsCB(error, response, html) {
    if (error) {
        console.log(error);
    } else if (response.statusCode == 404) {
        console.log('Page not found');
    } else {
        getTeamDetails(html);
    }
}

function getTeamDetails(html) {
    console.log('=========================================');
    let searchTool = cheerio.load(html);
    let teamNameEle = searchTool('.name-link');
    for (let i = 0; i < teamNameEle.length; i++) {
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
        let batsManArray = searchTool('.Collapsible__contentInner .table.batsman tbody tr');
        for (let name = 0; name < batsManArray.length - 1; name++) {
            let playerRow = searchTool(batsManArray[name]).find('td');

            if (playerRow.length == 8) {
                console.log(searchTool(playerRow[0]).text());
            }

        }
        if (i < teamNameEle.length - 1) console.log('***************  V/S  ***************');
        else console.log();
    }
}
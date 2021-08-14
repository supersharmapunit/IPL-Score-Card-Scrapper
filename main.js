let request = require("request");
let cheerio = require("cheerio");
let getData = require('./getScore')

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
        getData.fn(html);
    }
}

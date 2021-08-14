let cheerio = require('cheerio');

function getData(html) {
    console.log('=========================================');
    let searchTool = cheerio.load(html);
    let teamNameEle = searchTool('.name-link');
    console.log(teamNameEle.length);
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
    
                if (player.length >= 8) {
                    console.log(searchTool(player[0]).text());
                }
            }
    
    
    
            if (i == 0) console.log('***************  V/S  ***************');
        


        
    }
   

}
module.exports = {
    fn : getData
}
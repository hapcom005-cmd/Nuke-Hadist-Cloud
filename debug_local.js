const html = require('fs').readFileSync('test_tw.html', 'utf8');
const cheerio=require('cheerio');
const $ = cheerio.load(html);
$('h1, h2, h3, h4, h5, .title').each((i, el) => console.log($(el).prop('tagName') + ': ' + $(el).text()));

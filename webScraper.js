const requestPromise = require('request-promise');
const $ = require('cheerio');
const url = 'https://qz.com/1518545/price-lists-for-the-115-biggest-us-hospitals-new-transparency-law/';

requestPromise(url)
  .then(function(html){
    //success!
    
    const tableData = $('table > tbody > tr > td > a', html);
    const hospitalNames = [];
    const hospitalUrls = [];

    // loading hospital name and chargemaster url into data structures
    for (let i = 0; i < tableData.length; i++)
    {
      hospitalNames.push(tableData[i].children[0].data);
      hospitalUrls.push(tableData[i].attribs.href);
    }

    requestPromise(hospitalUrls[0])
      .then(function(hospitalHtml){
        console.log(hospitalHtml)
      })
      .catch(function(err){
        console.log(err)
      });



  })
  .catch(function(err){
    console.log(err)
  });
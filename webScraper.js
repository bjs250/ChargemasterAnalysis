const requestPromise = require('request-promise');
const $ = require('cheerio');
const url = 'https://qz.com/1518545/price-lists-for-the-115-biggest-us-hospitals-new-transparency-law/';


var hospitalDict = new Object();
    
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

    for (let j = 0; j < 10; j++)
    {
      //console.log(j, hospitalNames[j])

      requestPromise(hospitalUrls[j])
        .then(function(hospitalHtml){
          const aTags = $('a', hospitalHtml)
          let csvTag = "";

          for (let i = 0; i < aTags.length; i++)
          {
            const link = aTags[i].attribs.href;
            if (link !== undefined && (link.includes(".csv") || link.includes(".xlsx")) )
            {
              csvTag = link;
              //console.log(csvTag)
            }
          }
          //console.log(hospitalNames[j],csvTag)
          hospitalDict[hospitalNames[j]] = csvTag
          console.log(hospitalDict)

        })
        .catch(function(err){
          console.log(err)
        });
    }

  })
  .catch(function(err){
    console.log(err)
  });

console.log(hospitalDict)

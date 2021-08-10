const https = require("https");

// Pass in Url as System Variable
let url = process.argv[2];
if(!url){
  console.error("Link must be passed as an arguement")
  process.exit();
}

// Defining Global Variables used later.
let title = null;
let author = null;
let views = null;
let isLive = false;
let liveViewers = null;
let likes = null;
let dislikes = null;

// Main Https Request. Sends body in chunks based on promises
let siteRequest = https.get(url, (res) => {
  // Reading Error Codes
  console.log(`Status: ${res.statusCode}`);

  // Converting data to utf8 for readability
  res.setEncoding("utf8");

  // Promises that send chunks of the body
  res.on("data", (body) => {
    /*
    Regex for each attribute.
    You can find your own by looking at the source code via Postman
    */
    let titleRegex = /videoPrimaryInfoRenderer":\{"title":\{"runs":\[\{"text":"([^}]+)"/;
    let authorRegex = /author":"([\w\s]+)"/;
    let viewRegex = /viewCount":\{"simpleText":"([\d,]+ views)/;
    let isLiveRegex = /isLive":(\w+)/;
    let liveViewRegex = /"runs":\[\{"text":"([\d,]+)/;
    let likesRegex = /label":"([\d,]+ likes)/;
    let dislikesRegex = /label":"([\d,]+ dislikes)/;

    /*
    Nicer Implementation of showing data. Once found, it formats and prints to console.

    Property: Variable(Any) - Place to store the data for later use
    propertyName: String - Name of property for displaying
    propertyRegex: Regular Expression - Search through body code to find said property

    */
    let getData = (property, propertyName, propertyRegex) => {
      let propertyMatch = body.match(propertyRegex);
      if(propertyName == "likes"){
        console.log(propertyMatch);
      }

      if(!property && propertyMatch){
        // Youtube uses string formatting for special characters. This takes out those extra "\"'s
        property = propertyMatch[1].replaceAll("\\", "")
        console.log(`${propertyName}: ${property}`);
      }
      return property;
    };

    // Calling for each property needed.
    getData(title, "Title", titleRegex);
    getData(author, "Author", authorRegex);
    getData(views, "Views", viewRegex);
    if(getData(isLive, "Video is Live", isLiveRegex)){
      getData(liveViewers, "Live Viewers", liveViewRegex);
    };
    getData(likes, "Likes", likesRegex);
    getData(dislikes, "Dislikes", dislikesRegex)
  })
})

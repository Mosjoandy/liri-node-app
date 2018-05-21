require("dotenv").config();
///////////////////////////////////////////

// Spotify keys and junk
var Spotify = require('node-spotify-api');
 
var spotify = new Spotify({
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
});
///////////////////////////////////////////

// Twitter keys and junk
var Twitter = require('twitter');
 
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
///////////////////////////////////////////

// OMDB junk
var request = require("request");
///////////////////////////////////////////

// Turns user input into one string
var operator = process.argv[2];
var userInput = "";
var nodeArgs = process.argv;

for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
        userInput = userInput + " " + nodeArgs[i];
    } else {
        userInput += nodeArgs[i];
    }
}
///////////////////////////////////////////

// Controller
switch (operator) {
    case "spotify-this-song":
        spotifyMe(userInput);
        break;

    case "my-tweets":
        twitterMe(userInput);
        break;
    
    case "movie-this":
        movieMe(userInput);
        break;

    // case "do-what-it-says":
    //     doMe();
    //     break;
        
}


///////////////////////////////////////////
// Functions///////////////////////////////
///////////////////////////////////////////


///////////////////////////////////////////
// Spotify Search//////////////////////////
///////////////////////////////////////////
function spotifyMe(userInput) {

    // Initial console log
    console.log("Your song search was: " + userInput);
    console.log("==========Loading==========")

    // Spotify search method
    spotify.search({ 
        type: 'track', 
        limit: 1,
        query: userInput 
        }, function(error, spotifyData) {
           
        if (error) {
            return console.log('Error occurred: ' + error);
        }
    
        // Spotfiy Response:

        // console.log(JSON.stringify(spotifyData, null, 3));
        console.log("==========Results==========")
        console.log("Song Title: " + spotifyData.tracks.items[0].name);
        console.log("Artist: " + spotifyData.tracks.items[0].artists[0].name);
        console.log("Album: " + spotifyData.tracks.items[0].album.name);
        console.log("Preview Link: " + spotifyData.tracks.items[0].preview_url);
        console.log("==========End==========")
    });
}
  
///////////////////////////////////////////
// Twitter Search//////////////////////////
///////////////////////////////////////////

function twitterMe(userInput) {

    console.log("Your most recent Tweets: ")

    var params = {whothatchineze: 'nodejs'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            return console.log('Error occurred: ' + error);
            
        }
        for (var i=0; i < 7; i++) {

            console.log("===========================")
            console.log("Date: " + tweets[i].created_at);
            console.log("Content: " + tweets[i].text);
        }
    });
}

///////////////////////////////////////////
// Movie Search////////////////////////////
///////////////////////////////////////////

function movieMe(userInput) {

    console.log("Your movie search was: " + userInput);
    console.log("==========Loading==========");

    request("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy", function(error, response, movieData) {

        if (!error && response.statusCode === 200 ) {

            if (userInput === "") {
                console.log("Since you didn't pick a movie, you should try watching Mr. Nobody");
                console.log("Link: http://www.imdb.com/title/tt0485947/")
                console.log("It's on Netflix!");

            } else { 
            // console.log(JSON.parse(movieData));

            console.log("===========Movie Details===========");
            console.log("Title: " + JSON.parse(movieData).Title);
            console.log("Date Released: " + JSON.parse(movieData).Released);
            console.log("Actors: " + JSON.parse(movieData).Actors);
            console.log("Language: " + JSON.parse(movieData).Language);
            console.log("Produced In: " + JSON.parse(movieData).Country);
            console.log("===========Ratings===========");
            console.log("IMDB Rating: " + JSON.parse(movieData).Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(movieData).Ratings[1].Value);
            console.log("===========Plot==========="); 
            console.log("Plot: " + JSON.parse(movieData).Plot);   
            }
        } 
    });
}


require("dotenv").config();
var keys = require('./keys.js');
var fs = require("fs");
//////////////////////////////////////////////////////////////////////////////////////

// Spotify keys and junk
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);
//////////////////////////////////////////////////////////////////////////////////////


// Twitter keys and junk
var Twitter = require('twitter');
 
var client = new Twitter(keys.twitter);
//////////////////////////////////////////////////////////////////////////////////////


// OMDB junk
var request = require("request");
//////////////////////////////////////////////////////////////////////////////////////


// FS junk
var fs = require('file-system');
var file = require('file-system');
/////////////////////////////////////////////////////////////////////////////////////


// User inputs handlers:

// Turns user input into one string
var operator = process.argv[2];
var userInput = "";
var nodeArgs = process.argv;

    // forloop to turn user input argv[2] and greater into one string
    for (var i = 3; i < nodeArgs.length; i++) {
        if (i > 3 && i < nodeArgs.length) {
            userInput = userInput + " " + nodeArgs[i];
        } else {
            userInput += nodeArgs[i];
        }
    }
//////////////////////////////////////////////////////////////////////////////////////

// Controller
switch (operator) {
    case "spotify-this-song":
        spotifyMe(userInput);
        break;

    case "my-tweets":
        twitterMe();
        break;
    
    case "movie-this":
        movieMe(userInput);
        break;

    case "do-what-it-says":
        doMe();
        break;
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

    if (userInput === "") {
        console.log("You should type in a song next time!");
    } else {

    // Spotify search method
    spotify.search({ 
        type: 'track', 
        limit: 1,
        query: userInput 
        }, function(error, spotifyData) {

        if (error) {
            return console.log('Error occurred: ' + error);
         
            } else {
        
            // Results of Spotify Search

            // console.log(JSON.stringify(spotifyData, null, 3));
            console.log("==========Results==========")
            console.log("Song Title: " + spotifyData.tracks.items[0].name);
            console.log("Artist: " + spotifyData.tracks.items[0].artists[0].name);
            console.log("Album: " + spotifyData.tracks.items[0].album.name);
            console.log("Preview Link: " + spotifyData.tracks.items[0].preview_url);
            console.log("==========End==========")

            var appendArray = [
                "\n===========================",
                "\nSong Title: " + spotifyData.tracks.items[0].name,
                "\nArtist: " + spotifyData.tracks.items[0].artists[0].name,
                "\nAlbum: " + spotifyData.tracks.items[0].album.name,
                "\nPreview Link: " + spotifyData.tracks.items[0].preview_url
            ].join("\n")

                fs.appendFile("log.txt", appendArray, function(error) {
                    if (error) {
                        return error;
                    }
                });
            }
        });
    }
}
  
///////////////////////////////////////////
// Twitter Search//////////////////////////
///////////////////////////////////////////
function twitterMe() {

    // Initial console log
    console.log("Your most recent Tweets: ")
    console.log("==========Loading==========");

    // Twitter search method
    var params = {whothatchineze: 'nodejs'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            return console.log('Error occurred: ' + error);

        } else {
           
        // forloop for the last 7 tweets
            for (var i=0; i < 7; i++) {


                // Results of the search
                console.log("===========================")
                console.log("Date: " + tweets[i].created_at);
                console.log("Content: " + tweets[i].text);
                console.log("==========End==========")

                var appendArray = [
                    "\n===========================",
                    "\nDate: " + tweets[i].created_at,
                    "\nContent: " + tweets[i].text
                ].join("\n");

                fs.appendFile("log.txt", appendArray, function(error) {
                    if (error) {
                        return error;
                    }
                });
            }
        }
    });
}

///////////////////////////////////////////
// Movie Search////////////////////////////
///////////////////////////////////////////
function movieMe(userInput) {

    // Initial console log
    console.log("Your movie search was: " + userInput);
    console.log("==========Loading==========");

    // OMDB search method
    request("http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy", function(error, response, movieData) {

        if (error) {
            return console.log("You have an Error: " + error);

        } else {

            // Nested If statement in case user does not enter a string
            if (userInput === "") {
                console.log("Since you didn't pick a movie, you should try watching Mr. Nobody");
                console.log("Link: http://www.imdb.com/title/tt0485947/")
                console.log("It's on Netflix!");

            // Results of the search
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
                console.log("==========End==========")   

                var appendArray = [
                    "\n===========================",
                    "\nTitle: " + JSON.parse(movieData).Title,
                    "\nDate Released: " + JSON.parse(movieData).Released,
                    "\nActors: " + JSON.parse(movieData).Actors,
                    "\nLanguage: " + JSON.parse(movieData).Language,
                    "\nProduced In: " + JSON.parse(movieData).Country,
                    "\nIMDB Rating: " + JSON.parse(movieData).Ratings[0].Value,
                    "\nRotten Tomatoes Rating: " + JSON.parse(movieData).Ratings[1].Value,
                    "\nPlot: " + JSON.parse(movieData).Plot
                ].join("\n")

                fs.appendFile("log.txt", appendArray, function(error) {
                    if (error) {
                        return error;
                    }
                });
            }
        }
    });
}

///////////////////////////////////////////
// FS Function ////////////////////////////
///////////////////////////////////////////
function doMe(userInput) {

    console.log("Just do what it says and no one will get hurt");

    fs.readFile('random.txt', "utf-8", function(error, fileData) {

        if (error) {
            return console.log('Error occurred: ' + error);
            
        } else {

            // console.log(fileData);

            // Split entire string into array
            var dataArr = fileData.split(",");
            console.log(dataArr);

            spotifyMe(dataArr[1], dataArr[2]);
        
        }
    })
}

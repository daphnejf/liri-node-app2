require("dotenv").config();

var axios = require('axios');
var fs = require("fs");
var keys = require("./keys.js");
var moment = require('moment');
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var command = process.argv[2]; 
var string = process.argv[3];

userInputs(command, string);

function userInputs (command, string){
    switch (command) {
    case 'concert-this':
        concertThis(string);
        break;
    case 'spotify-this-song':
        spotifyThisSong(string);
        break;
    case 'movie-this':
        movieThis(string);
        break;
    case 'do-what-it-says':
        doWhatItSays();
        break;
    default: 
        console.log("Not an option. Please type any of the following options: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")
    }
}

function concertThis(string){
    axios.get("https://rest.bandsintown.com/artists/" + string + "/events?app_id=codingbootcamp")
        .then(function (response) {
            if (response.data[0] != undefined) {
                console.log("--------------------------------------------------------------------");
                console.log(`Venue Name: ${response.data[0].venue.name}`);
                console.log(`Venue City: ${response.data[0].venue.city}`);
                console.log(`Date of Event: ${moment(response.data[0].datetime).format("MM/DD/YYYY")}`);
                console.log("--------------------------------------------------------------------");
            } else {
                console.log("No events found.")
            }
        })
        .catch(function (error) {
            console.log(error);
        });
};

function spotifyThisSong(inputParameter) {
    if (string === undefined) {
        string = "The Sign"; 
    }
    spotify.search(
        {
            type: "track",
            query: string,
            limit: 1
        },
        function (err, data) {
            if (err) {
                return console.log("Error occurred: " + err);
            }
            console.log("--------------------------------------------------------------------");
            console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
            console.log(`Song's name: ${data.tracks.items[0].name}`);
            if (data.tracks.items[0].preview_url === null) {
                console.log("No preview available.");
            } else {
                console.log(`Preview URL: ${data.tracks.items[0].preview_url}`);
            }
            console.log(`Album: ${data.tracks.items[0].album.name}`);
            console.log("--------------------------------------------------------------------");
    });
};

function movieThis(string){
    if (string === undefined) {
        axios.get("http://www.omdbapi.com/?t=" + string + "&apikey=trilogy")
        .then(function (response) {
            let tempImdbID = response.data.Search[0].imdbID;
            axios.get("http://www.omdbapi.com/?t=" + tempImdbID + "&apikey=trilogy")
                .then(function (response2) {
                    console.log("--------------------------------------------------------------------");
                    console.log(`Title: ${response2.data.Title}`);
                    console.log(`Year: ${response2.data.Year}`);
                    console.log(`IMDB Rating: ${response2.data.imdbRating}`);
                    console.log(`Rotten Tomatoes Rating: ${response2.data.Ratings[1].Value}`)
                    console.log(`Country Produced: ${response2.data.Country}`);
                    console.log(`Language: ${response2.data.Language}`);
                    console.log(`Plot: ${response2.data.Plot}`);
                    console.log(`Actors: ${response2.data.Actors}`);
                    console.log("--------------------------------------------------------------------");
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
        .catch(function (error) {
            console.log(error);
        })
    }
};

function doWhatItSays(){
	fs.readFile('random.txt', 'utf8', function(err, data){
		if (err){ 
			return console.log(err);
		}
        var dataArray = data.split(',');
        command = dataArray[0];
        string = dataArray[1];
        spotifyThisSong(string);
	});
}

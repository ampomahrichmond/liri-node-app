var divider = "\n----------------------------------\n"

//Spotify Function
var Spotify = require('node-spotify-api');

var spotify = new Spotify ({
	id: 'df16d8312ed54b45b4d65dc32a81d78d',
	secret: '176efb35dedf483ebb4371809d847fdd'
});

function spotifyWrite () {

	var queryTerm;
	var comboTerm = "";

	for (var i = 3; i < process.argv.length; i++) {
		comboTerm += process.argv[i] + " ";
	}

	if (process.argv[2] == "spotify-this-song" && process.argv[3] != undefined) {
		queryTerm = comboTerm;
	}
	else if (process.argv[2] == "spotify-this-song" && process.argv[3] == undefined) {
		queryTerm = "The Sign, Ace of Base";
	}
	else if (process.argv[2] == "do-what-it-says") {
		queryTerm = readQuery;
	}

	spotify.search({type: 'track', query: queryTerm, limit: 1}, function (err, data) {

		if (data.tracks.items[0] == undefined) {
			console.log("No Song Found");
			return;
		}

		var artist = data.tracks.items[0].artists[0].name;

		for (var i = 1; i < data.tracks.items[0].artists.length; i++) {
			artist += ", " + data.tracks.items[0].artists[i].name;
		}

		// console.log(artist);

		var songMessage = "Song: " + data.tracks.items[0].name + "\nArtist: " + artist + "\nAlbum: " + data.tracks.items[0].album.name + "\nLink: " + data.tracks.items[0].external_urls.spotify;

		songMessage += divider;

		console.log(divider + songMessage);

		fs.appendFile("log.txt", songMessage, function (err) {
			if (err) {
				console.log(err);
			}
		})
	})
}

// spotifyWrite();

//OMDB Function
function movieWrite () {
	var request = require('request');

	var queryTerm;
	var comboTerm = "";

	for (var i = 3; i < process.argv.length; i++) {
		comboTerm += process.argv[i] + " ";
	}

	if (process.argv[2] == "movie-this" && process.argv[3] != undefined) {
		queryTerm = comboTerm;
	}
	else if (process.argv[2] == "movie-this" && process.argv[3] == undefined) {
		queryTerm = "Mr. Nobody";
	}
	else if (process.argv[2] == "do-what-it-says") {
		queryTerm = readQuery;
	}

	var queryURL = "http://www.omdbapi.com/?t=" + queryTerm + "&apikey=40e9cece"

	request(queryURL, function (error, response, body) {
		var obj = JSON.parse(body);

		if (error) {
			return console.log(error);
		}
		else if (obj.Response == "False") {
			return console.log("No Movie Found");
		}

		var movieMessage = "Title: " + obj.Title + "\nYear: " + obj.Year + "\nIMDB Rating: " + obj.Ratings[0].Value + "\nRotten Tomatoes Rating: " + obj.Ratings[1].Value + "\nCountry: " + obj.Country + "\nLanguage: " + obj.Language + "\nPlot: " + obj.Plot + "\nActors: " + obj.Actors;

		movieMessage += divider;

		console.log(divider + movieMessage);

		fs.appendFile("log.txt", movieMessage, function (err) {
			if (err) {
				console.log(err);
			}
		})

	})
}
//BandsIn Town API Calls
function eventWrite () {
	var request = require('request');

	var eventInfo;
	var comboTerm = "";

	for (var i = 3; i < process.argv.length; i++) {
		comboTerm += process.argv[i] + " ";
	}

	if (process.argv[2] == "event-this" && process.argv[3] != undefined) {
		eventInfo = comboTerm;
	}
	else if (process.argv[2] == "event-this" && process.argv[3] == undefined) {
		eventInfo = "Beyonce";
	}
	else if (process.argv[2] == "do-what-it-says") {
		eventInfo = readQuery;
	}

    var queryURL = "https://rest.bandsintown.com/artists/'+artistPlace+app_id=codingbootcamp";
   

	request(queryURL, function (error, response, body) {
		var obj = JSON.parse(body);

		if (error) {
			return console.log(error);
		}
		else if (obj.Response == "False") {
			return console.log("Event Not Found");
		}

		var eventMessage = "Event: " + obj.event+ "\nLocation: " + obj.city + "\nartiste :" +obj.artist;

		eventMessage += divider;

		console.log(divider + eventMessage);

		fs.appendFile("log.txt", eventMessage, function (err) {
			if (err) {
				console.log(err);
			}
		})

	})
}
// movieWrite();

//DoThis Function
var readQuery;
var fs = require("fs");

function doThisWrite () {

	fs.readFile("random.txt", "utf8", function (err, data) {

		if (err) {
			return console.log(err);
		}

		data = data.split(", ")

		readQuery = data[1];

		if (data[0] == "event-this") {
		 	eventWrite();
		}
		else if (data[0] == "spotify-this-song") {
		 	spotifyWrite();
		}
		else if (data[0] == "movie-this") {
		    movieWrite();
		}

	})

}

// doThisWrite ();

var action = process.argv[2];

switch (action) {

	case "spotify-this-song":
		spotifyWrite();
		break;

	case "movie-this":
		movieWrite();
		break;

	case "do-what-it-says":
		doThisWrite();
		break;
	
	case "event-this":
		eventWrite();
		break;	
	default:
		console.log("Please Use a Working Command: \nevent-this \nspotify-this-song \nmovie-this \ndo-what-it-says");
		break;
}
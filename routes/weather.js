var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");

var weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=HongKong&appid=${process.env.OPEN_WEATHER_API_KEY}`;

var MongoClient = require("mongodb").MongoClient;
var dbUri = "mongodb://" + (process.env.DB_ENDPOINT || "localhost:27017");

// connect to db
console.log("Using weather url: " + weatherUrl);
console.log("Using db uri: " + dbUri);
var client = new MongoClient(dbUri, { useUnifiedTopology: true });
var connection = client.connect()

function getDataFromOpenWeather() {
	return new Promise((resolve, reject) => {
		console.log("Retrieving data from open weather");
		//example url: http://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=439d4b804bc8187953eb36d2a8c26a02
		fetch(weatherUrl)
		.then(res => res.json())
		.then(body => {
			if(undefined !== body.cod && 200 === body.cod)
				resolve(body);
			else
				reject(body);
		})
		.catch(err => {
			console.error(err);
			reject(err);
		});
	});
};

function insertWeatherRecordIntoDb(data) {
	return new Promise((resolve, reject) => {
		console.log("Inserting data to DB");
		const connect = connection;
		connect
			.then(() => {
				const doc = data;
				doc.createDate = new Date();
				const db = client.db("openWeatherData");
				const coll = db.collection("openWeatherData");
				coll.insertOne(doc, (err, result) => {
					if(err) reject(err);
					if(result) resolve(result);
				});
			})
			.catch((reason) => reject(reason));
	});
};

function getLatestWeatherRecordFromDb() {
	return new Promise((resolve, reject) => {
		console.log("Retrieving latest weather data from DB");
		const connect = connection;
		connect
			.then(() => {
			const db = client.db("openWeatherData");
			const coll = db.collection("openWeatherData");
			coll
				.find()
				.sort({createDate:-1})
				.limit(1)
				.next()
				.then((doc) => resolve(doc))
				.catch((reason) => reject(reason));
			})
			.catch((reason) => reject(reason));
	});
};

/* GET weather from open weather. */
router.get("/", function(_, res) {
	getDataFromOpenWeather()
		.then((body) => {
			insertWeatherRecordIntoDb(body)
				.then(() => res.send(body))
				.catch((reason) => {
					console.error("Error inserting data to db: " + reason);
					res.status(500).send("Internal server error");
				});
		})
		.catch((reason) => {
			console.error("Error retrieving data from openWeather: " + reason);
			getLatestWeatherRecordFromDb()
				.then((body) => res.send(body))
				.catch((reason) => {
					console.error("Error retrieving data from db: " + reason);
					res.status(500).send("Internal server error");
				});
		});
});

/* GET weather from db (test call). */
router.get("/db", function(_, res) {
	getLatestWeatherRecordFromDb()
		.then((body) => res.send(body))
		.catch((reason) => {
			console.error("Error retrieving data from db: " + reason);
			res.status(500).send("Internal server error");
		});
});

module.exports = router;

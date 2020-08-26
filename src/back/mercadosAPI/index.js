module.exports = function (app) {
	console.log("Registering mercados API...");
	const dataStore = require("nedb");
	const path = require("path");
	const dbFileName = path.join(__dirname, "mercados.db");
	const db = new dataStore({
		filename: dbFileName,
		autoload: true
	});

	//const request = require('request');
	//const express = require("express");
	const BASE_API_URL = "/api/v1";

	var initialmercados = [
		{
			Region: "Asia-Pacific",
			Country: "China",
			Population: 1439.3,
			Internet_pop: 907.5,
			Revenues: 40.854
		},
		{
			Region: "North America",
			Country: "United States",
			Population: 331.0,
			Internet_pop: 283.9,
			Revenues: 36.921
		},
		{

			Region: "Asia-Pacific",
			Country: "Japan",
			Population: 126.5,
			Internet_pop: 101.5,
			Revenues: 18.683
		},
		{
			Region: "Asia-Pacific",
			Country: "South Korea",
			Population: 51.3,
			Internet_pop: 48.2,
			Revenues: 6.564
		},
		{
			Region: "Europe",
			Country: "Germany",
			Population: 83.8,
			Internet_pop: 75.5,
			Revenues: 5.965
		},
		{
			Region: "Europe",
			Country: "United Kingdom",
			Population: 67.9,
			Internet_pop: 61.8,
			Revenues: 5.511
		},
		{
			Region: "Europe",
			Country: "France",
			Population: 65.3,
			Internet_pop: 58.2,
			Revenues: 3.987
		},
		{
			Region: "North America",
			Country: "Canada",
			Population: 37.7,
			Internet_pop: 33.7,
			Revenues: 3.051
		},
		{
			Region: "Europe",
			Country: "Italy",
			Population: 60.5,
			Internet_pop: 52.7,
			Revenues: 2.661
		},
		{
			Region: "Europe",
			Country: "Spain",
			Population: 46.8,
			Internet_pop: 40.8,
			Revenues: 2.656
		}
	];

	function deleteIDs(mercados) {
		mercados.forEach((m) => {
			delete m._id;
		});
	}

	//INITIAL DATA	
	app.get(BASE_API_URL + "/mercados/loadInitialData", (req, res) => {
		console.log("New mercados .../loadInitialData");
		db.remove({}, { multi: true }, function (err, numRemoved) {
		});
		db.insert(initialmercados);
		res.sendStatus(200);

		console.log("Initial mercados loaded:" + JSON.stringify(initialmercados, null, 2));

	});

	// GET 
	app.get(BASE_API_URL + "/mercados", (req, res) => {
		console.log("New GET mercados");

		//if(req.query.Region) request["Region"] = req.query.Region;
		//if(req.query.Country) request["Country"] = req.query.Country;
		if (req.query.Population) req.query.Population =
			parseFloat(req.query.Population);
		if (req.query.Internet_pop) req.query.Internet_pop =
			parseFloat(req.query.Internet_pop);
		if (req.query.Revenues) req.query.Revenues =
			parseFloat(req.query.Revenues);


		var par = req.query;
		console.log(par);

		let offset = null;
		let limit = null;

		if (req.query.offset) {
			offset = parseInt(req.query.offset);
			delete req.query.offset;
		}
		if (req.query.limit) {
			limit = parseInt(req.query.limit);
			delete req.query.limit;
		}


		db.find(par).skip(offset).limit(limit).exec((err, mercados) => {
			deleteIDs(mercados);
			res.send(JSON.stringify(mercados, null, 2));

			console.log("Data sent: " + JSON.stringify(mercados, null, 2));
		});
	});
	// GET yyyy/XXX

	app.get(BASE_API_URL + "/mercados/:Region", (req, res) => {
		var region = req.params.Region;
		db.find({ Region: region }, (err, mercados) => {
			deleteIDs(mercados);
			res.send(JSON.stringify(mercados, null, 2));
			console.log("Data sent:" + JSON.stringify(mercados, null, 2));
		});
	});

	// GET yyyy/XXX/zzz
	app.get(BASE_API_URL + "/mercados/:Region/:Country", (req, res) => {

		var country = req.params.Country;
		var region = req.params.Region;

		db.find({ Region: region, Country: country }, (err, mercados) => {
			deleteIDs(mercados);
			res.send(JSON.stringify(mercados[0], null, 2));
			console.log("Data sent:" + JSON.stringify(mercados[0], null, 2));
			if (err == !0) {
				res.sendStatus(404, "COUNTRY NOT FOUND");
			}

		});

	});

	// POST 
	app.post(BASE_API_URL + "/mercados", (req, res) => {

		var newMercados = req.body;
		if ((newMercados == "") || (newMercados.Region == null) || (newMercados.Country == null) || (newMercados.Population == null) || (newMercados.Internet_pop == null) || (newMercados.Revenues == null)) {
			res.sendStatus(400, "BAD REQUEST");
		} else {
			db.find({ Region: newMercados.Region, Country: newMercados.Country }, (err, mercados) => {
				if (mercados.length == 0) {
					db.insert(newMercados);
					res.sendStatus(201, "CREATED");
				} else {
					res.sendStatus(420, "BAD REQUEST");
				}
			});
		}
	});

	//POST yyyy/xxxx
	app.post(BASE_API_URL + "/mercados/:Region", (req, res) => {
		res.sendStatus(405, "METHOD NOT ALLOWED");
	});
	//POST yyyy/xxxx/zzzz
	app.post(BASE_API_URL + "/mercados/:Region/:Country", (req, res) => {
		res.sendStatus(405, "METHOD NOT ALLOWED");
	});

	// DELETE 
	app.delete(BASE_API_URL + "/mercados", (req, res) => {
		db.remove({}, { multi: true }, function (err, numRemoved) {
			if (numRemoved != 0) {
				res.sendStatus(200, "DELETED DATA BASE");
			} else {
				res.sendStatus(404, "DATA BASE NOT FOUND");
			}
		});
	});
	// DELETE yyyy/XXX

	app.delete(BASE_API_URL + "/mercados/:Region", (req, res) => {

		var region = req.params.Region;

		db.remove({ Region: region }, { multi: true }, function (err, numRemoved) {
			if (numRemoved != 0) {
				res.sendStatus(200, "DELETED COUNTRY");
			} else {
				res.sendStatus(404, "COUNTRY NOT FOUND");
			}
		});
	});
	// DELETE yyyy/XXX/zzz

	app.delete(BASE_API_URL + "/mercados/:Region/:Country", (req, res) => {

		var country = req.params.Country;
		var region = req.params.Region;
		db.remove({ Region: region, Country: country }, {}, function (err, numRemoved) {
			if (numRemoved != 0) {
				res.sendStatus(200, "DELETED COUNTRY");
			} else {
				res.sendStatus(404, "COUNTRY NOT FOUND");
			}
		});
	});
	//PUT yyyy
	app.put(BASE_API_URL + "/mercados", (req, res) => {
		res.sendStatus(405, "METHOD NOT ALLOWED");
	});
	// PUT yyyy/XXX/zzz
	app.put(BASE_API_URL + "/mercados/:Region/:Country", (req, res) => {

		var country = req.params.Country;
		var region = req.params.Region;
		var body = req.body;

		db.find({ Region: region, Country: country }, (err, mercados) => {
			deleteIDs(mercados);
			if (mercados.length >= 1) {
				db.update({ Region: region, Country: country }, body, (error, numRemoved) => {
					res.sendStatus(200, "OK");
				})
			} else {
				res.sendStatus(404, "ERROR. Pais no encontrado.");
			}
		});
	});
	console.log("mercados OK");
};
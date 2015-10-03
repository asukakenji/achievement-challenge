/**
 * The main function.
 * It is written as an IIFE (Immediately-Invoked Function Expression) to prevent
 * global namespace pollution.
 */
(function() {
	// Enabling "strict mode" for using block-scoped declarations
	// (let, const, function, class).
	"use strict";

	/**
	 * The callback of the "request" event.
	 * Separates the requests by HTTP request methods:
	 * - the function goGet() is invoked for GET requests;
	 * - the function doPost() is invoked for POST requests;
	 * - the function responseWithBadRequest() is invoked for other requests.
	 */
	function handleRequest(request, response) {
		switch (request.method) {
		case "GET":
			doGet(request, response);
			break;
		case "POST":
			doPost(request, response);
			break;
		default:
			handleBadRequest(request, response);
		}
	}

	/**
	 * Handles GET requests.
	 * Works as a web server for whitelisted resources.
	 * Responses with "Not Found" for other resources.
	 */
	function doGet(request, response) {
		let parsed_url = require("url").parse(request.url);
		switch (parsed_url.pathname) {
		case "/":
			response.writeHead(302, {"Location": "/main.html"});
			response.end();
			break;
		case "/main.html":
			response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
			response.end(main_html);
			break;
		case "/main.css":
			response.writeHead(200, {"Content-Type": "text/css; charset=utf-8"});
			response.end(main_css);
			break;
		case "/main.js":
			response.writeHead(200, {"Content-Type": "text/javascript; charset=utf-8"});
			response.end(main_js);
			break;
		default:
			responseWithNotFound(request, response);
		}
	}

	/**
	 * Handles POST requests.
	 */
	function doPost(request, response) {
		let parsed_url = require("url").parse(request.url);
		switch (parsed_url.pathname) {
		case "/login":
			let data = "";
			// Concatenates the data from the POST stream.
			// Disconnects if the request is too big (hack attempt).
			request.on("data", function(chunk) {
				data += chunk;
				if (data.length > 1024) {
					request.connection.destroy;
				}
			});
			// Parses the data when the POST stream ends.
			// Checks the credentials and responses with JSON.
			request.on("end", function() {
				let post = require("querystring").parse(data);
				let username = post["username"];
				let password = post["password"];
				if (username === "kenji" && password === "123") {
					let message = {
						"errorCode": 0,
						"url": "/game.html",
						"token": "1234567890ABCDEF"
					};
					console.log(JSON.stringify(message));
					response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
					response.end(JSON.stringify(message));
				} else {
					let message = {
						"errorCode": 1
					};
					console.log(JSON.stringify(message));
					response.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
					response.end(JSON.stringify(message));
				}
			});
			break;
		default:
			responseWithNotFound(request, response);
		}
	}

	/**
	 * Responses with "400 - Bad Request".
	 */
	function responseWithBadRequest(request, response) {
		response.writeHead(400, {"Content-Type": "text/plain; charset=utf-8"});
		response.end("400 - Bad Request");
	}

	/**
	 * Responses with "404 - Not Found".
	 */
	function responseWithNotFound(request, response) {
		response.writeHead(404, {"Content-Type": "text/plain; charset=utf-8"});
		response.end("404 - Not Found");
	}

	let http = require("http");
	let fs = require("fs");
	let main_html = fs.readFileSync("main.html");
	let main_css = fs.readFileSync("main.css");
	let main_js = fs.readFileSync("main.js");
	//let game_html = fs.readFileSync("game.html");
	let server = http.createServer(handleRequest);
	server.listen(50080);
})();

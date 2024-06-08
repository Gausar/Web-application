"use strict";

/**
 * A simple Node.js program for exporting the current working directory via a
 * webserver listing on a hard code (see portno below) port. To start the
 * webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:3001 will be able to fetch any
 * file accessible to the current user in the current directory or any of its
 * children.
 */

var express = require("express");
const { request } = require("http");

var portno = 3000; // Port number to use

var app = express();
app.get("/course/:courseName", function(request, response){
  console.log(request.params.courseName);
  
  let courseList = [
    {
        courseName : "Algorithm",
        credit: 3
    },
    {
        courseName : "Programming Langauge",
        credit: 3
    },
    {
        courseName : "Operating System",
        credit: 3
    },
    {
        courseName : "Web applications",
        credit: 3
    }
  ]
  response.send(courseList);
});

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

var server = app.listen(portno, function () {
  var port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});

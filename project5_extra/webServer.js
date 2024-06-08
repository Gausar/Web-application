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

const express = require("express");

const portno = 5000; // Port number to use

const app = express();

const cs142models = require("./modelData/photoApp.js").cs142models;

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

app.get("/test/:p1", function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params
  // objects.
  const param = request.params.p1;
  console.log("/test called with param1 = ", param);
  if (param !== "info") {
    console.error("Nothing to be done for param: ", param);
    response.status(400).send("Not found");
    return;
  }

  const info = cs142models.schemaInfo();

  // Query didn't return an error but didn't find the SchemaInfo object - This
  // is also an internal error return.
  if (info.length === 0) {
    response.status(500).send("Missing SchemaInfo");
    return;
  }
  response.status(200).send(info);
});

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", function (request, response) {
  response.status(200).send(cs142models.userListModel());
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get("/user/:id", function (request, response) {
  const id = request.params.id;
  const user = cs142models.userModel(id);
  if (user === null) {
    console.log("User with _id:" + id + " not found.");
    response.status(400).send("Not found");
    return;
  }
  response.status(200).send(user);
});

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get("/photosOfUser/:id", function (request, response) {
  const id = request.params.id;
  const photos = cs142models.photoOfUserModel(id);
  if (photos.length === 0) {
    console.log("Photos for user with _id:" + id + " not found.");
    response.status(400).send("Not found");
    return;
  }
  response.status(200).send(photos);
});

const server = app.listen(portno, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});

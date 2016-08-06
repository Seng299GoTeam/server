# Go Application

This is a web application for the game of Go, written in fulfillment of an assignment for UVic's Seng 299 course.

##Deployment Instructions
Note that the host is currently set as "localhost" for ease of development.

The following steps don't necessarily need to be done in exactly the following order:

* Install Node.js, if not already installed.
* Install MongoDB and make sure that the mongod daemon is running (the correct way to do this will vary from system to system)
* In the project's root directory, run "npm install"
* If necessary, modify the port in server.js and AI/aiserver.js
* If necessary, modify "port", "host", "aihost", and "aiport" listed at the top of public/main.js.  Note that the AI server is, in theory, entirely distinct from the game application's main server, but the "portForAI" should be the same as the port for the main server, not for the AI server.
* If necessary, modify line 106 of public/UI.js to specify the correct host and port for the AI server.
* If you wish to interact with Simon's AI, ensure that you are connected to the UVic engineering network.
* Start the server ("node server.js")
* In another terminal window, start the aiserver.js ("node AI/aiserver.js")

Note that you can run both servers in the same terminal window, but I have experienced problems with ports not closing properly when doing this.
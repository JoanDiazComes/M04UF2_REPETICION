const http = require('http');
const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'todolist';
let db;
let collection;

async function dbConnect() {
  await client.connect();
    
  console.log('Connected successfully to server');
  db = client.db(dbName);
  collection = db.collection("tasks");

  return 'Connected to MongoDB database';
}

dbConnect()
	.then(console.log)
	.catch(console.error);

http.createServer(function (request, response) {

	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
	response.setHeader("Access-Control-Allow-Max-Age", "2592000");

	if (request.method == "POST") {
		let data = "";

		request.on('data', dataChunk => data += dataChunk);
		request.on('end', () => {
			data = JSON.parse(data);
			
			if (data.remove == "false") {
				console.log("Task deleted: " + data);
				let date = new Date(Date.now()); 
				let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',  hour: 'numeric', minute: 'numeric' };

				collection.insertOne({"tasks": data.task, "time": date.toLocaleDateString('es-ES', options)});
	
				collection.find({"task": data.task}).limit(1).toArray()
					.then(task => {
						response.end(JSON.stringify(task));
					});
			}
			else {
				console.log("Deleting task " + data.task);
				collection.deleteOne({"tasks": data.task});
			}
		});
	}
	
	collection.find().toArray()
		.then(items => {
			let itemsJson = JSON.stringify(items);
		 	response.end(itemsJson);
		 });
}).listen(8080);s
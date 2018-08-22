//Required for running a server and accepting http requests
const http = require('http');

//Required to write backup data to File system
//Uncomment if Backup feature is required
//const fs = require("fs");

//define the port number here
const port = process.env.PORT || 5000;

//Creating and running server to receive POST request
const server = http.createServer((req, res) => {
    //Set response content type
    res.setHeader('content-type', 'application/json');
if (req.method === 'POST') {
    storeRequestData(req, result => {
        //console.log(result);
        if (result == 'Error') {
        res.writeHead(400);
        const errorMsg = {
            "error": "Could not decode request: JSON parsing failed"
        }
        res.end(JSON.stringify(errorMsg));
    }
else {
        res.end(result);
    }
});
}
else {
    res.end(`Error storing data`);
}
});

function storeRequestData(request, callback) {
    const Content_Type = 'application/json';
    //Check for Content type to be JSON
    if (request.headers['content-type'] === Content_Type) {
        let requestData = '';
        request.on('data', payload => {
            requestData += payload;
        try {
            JSON.parse(payload);
        } catch (e) {
            return callback('Error');
        }
    });
        request.on('end', () => {
            try {
                JSON.parse(requestData);
        //Writing payload to file for Backup

        //Uncomment the following lines if Backup is required and make sure to create a 'data.json' file
        //fs.appendFileSync("data.json", requestData, function (err) {
        //    if (err) throw err;
        //    console.log('Saved!');
        //});

        //Creating object to build response data
        const data = JSON.parse(requestData);
        const payloadData = data.payload;
        const tempObj = {};
        const key = 'response';
        tempObj[key] = [];
        payloadData.forEach(function (entry) {
            console.log(entry.workflow == 'completed');
            if(entry.workflow == 'completed') {
                const data = {
                    concataddress: entry.address.buildingNumber + ' ' + entry.address.street + ' ' + entry.address.suburb + ' ' + entry.address.state + ' ' + entry.address.postcode,
                    type: entry.type,
                    workflow: entry.workflow
                };
                tempObj[key].push(data);
            }
        });
        //console.log(JSON.stringify(tempObj));
        callback(JSON.stringify(tempObj));
    } catch (e) {
            console.log(e);
        }
    });
    }
    else {
        callback('Invalid request');
    }
}
server.listen(port);
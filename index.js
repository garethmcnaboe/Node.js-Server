//Node HTTP server (without a framework) code taken from L08.04 
//Only slightly adapted to allow for public folder with all html files in it.
//Additional code taken from youtube traversy media node.js crash course.

var http = require('http');
var fs = require('fs');
var path = require('path');

//create our server which gets a request and response
const server = http.createServer(function (request, response) {
    console.log('request ', request.url);

    //Build File Path
    let filePath = path.join(
        __dirname, 
        'public', 
        request.url === '/'? 'index.html': request.url
        );

    //Get Extension of file   
    var extname = String(path.extname(filePath)).toLowerCase();

    //append the type of data which is being sent MIME
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    //Binary encoding if no file type match
    var contentType = mimeTypes[extname] || 'application/octet-stream';

    //read in a File
    fs.readFile(filePath, function(error, content) {
        if (error) {
            //check if page is not found
            if(error.code == 'ENOENT') {
                //if so write and respond with the 404 error page.
                fs.readFile(path.join(__dirname, 'public', 'errorpage.html'), function(error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                //otherwise it is likely to be a server error
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
            //if no error then we can load the content
        }
        else {
            //if read file is successful then serve content based on pre-determined content type.
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
});

//check for what server port is provided or default to 3000.
//this is required where the website is deployed as it is not possible to predict the port number.
const port = process.env.PORT || 3000;

//Set server to listen on port
server.listen(port, () => 
//Run Console.log to confirm server is running.
console.log(`Server running at http://127.0.0.1: ${port}`)
);
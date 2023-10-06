const http = require('http')
const fs = require('fs')
const port = 3000

const server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type' : 'text/html' })
    fs.readFile('index1.html', function (error, data){
        if(error){
            res.writeHead(404)
            res.write('Error: File Not Found')
        }else{
            res.write(data)
        }
        res.end()
    })
})


server.listen(port, function(error){
if(error){
    console.log('something went wrong', error)
}else{
    console.log('server is listening on port ' + port)
}

})

// websocket.onopen = function (e) {

// };

// websocket.onclose = function (e) {

// };

// websocket.onmessage = function (e) {

// };

// websocket.onerror = function (e) {
// };
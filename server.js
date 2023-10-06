

const gameIds = new Map();
const clients = new Map();

const WebSocket = require('ws');
const port = 8080;
let id = 0;

const wss = new WebSocket.Server({port}, ()=>{
    console.log('server started');
})

wss.on('connection', function connection(client){
    client.send(CreateNewID().toString());

    client.on('message', (msg)=>{
        console.log('data received %o' +msg.toString());       
        try{
            const parsedMsg = JSON.parse(msg.toString()); //Letter object sender: id, text: message, sharedID: game id
            BroadcastToClientsInGame(parsedMsg.sharedID, parsedMsg.text);
            if(!clients.has(parsedMsg.sender)){ //Check if we have saved the client already
                clients.set(parsedMsg.sender, client); //save client
                console.log('saved client with id: '+ parsedMsg.sender + "and client: " + client);
                AddParticipantToGame(parsedMsg.sharedID, parsedMsg.sender);
            }
            //   GetClientsInGame(parsedMsg.sharedID).forEach(function(clientConnection, clientId) {
            //     clientConnection.send(parsedMsg.text);
            //     console.log("id " + clientId + "    connection " + clientConnection);
            //   });
        }catch(error){
            console.log(error.message);
        }
    });
});

wss.on('listening', ()=>{
    console.log('server is listening on port: ' + port);
})

function AddParticipantToGame(gameId, senderId){
    if(!gameIds.has(gameId)){
        console.log("game with id: "+ gameId +" was created");
        const gameArr = [];
        gameIds.set(gameId, gameArr);
    }
    gameIds.get(gameId).push(senderId);
    console.log("added " + senderId + " to game " + gameId);
}

function BroadcastToClientsInGame(gameId, message){
    if(gameIds.has(gameId) && gameIds.get(gameId).length > 1){
        const gameClients = new Map();
        for(let clientId of gameIds.get(gameId)){
            gameClients.set(clientId, clients.get(clientId));
            console.log("ingame client is client: " + clientId + " with connection " + gameClients.get(clientId));
        }
        gameClients.forEach(function(clientConnection, clientId) {
            clientConnection.send(message);
            console.log("message sent to" + clientId);
        });
    }
}

function CreateNewID(){
    let newId = id;
    id++;
    return newId;
}





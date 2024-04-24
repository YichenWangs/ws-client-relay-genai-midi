const WebSocket = require('ws');

/**
 * Websocket Client that connects to charles genai_midi_module.
 */
const genai_ws = new WebSocket('ws://localhost:5001');

genai_ws.on('open', function open() {
  console.log("Connection to charles's genAI server is open.");
  // Useless prompt message.
  genai_ws.send('/channel/0/noteoff/0/0');
});

/**
 * Websocket Client that connects to AR ensemble server.
 */
var ws_temp = new WebSocket('ws://localhost:3000')

ws_temp.onopen;

ws_temp.on('message', function message(data) {
  console.log('Received from the AR-ensemble server: %s', data);

  var route_data = data.toString().substring(0, data.length-1);
  console.log(route_data);
  genai_ws.send(route_data);


});

ws_temp.on('error', function error(data) {
  console.log("Websocket error:" + data.code);
  ws_temp.close();
  
});
ws_temp.on('close', function close(data) {
  console.log("The connection is closed.")
  console.log("Error information" + data);
});

genai_ws.on('message', function message(data) {
  //console.log('Received from the AI agent: %s', data);

    var parse_data = data.toString().replace("cc", "controlchange");

    var route_data_from_ai_to_human = parse_data + "/ai";
    if (ws_temp.readyState == WebSocket.OPEN) {
        
        //console.log("sending to server" + route_data_from_ai_to_human);
        ws_temp.send( route_data_from_ai_to_human);
    }



  // Broadcast to hololens --- TODO: does this work?
    //console.log(route_data_from_ai_to_human);
    // // testing AI to musician.
    // // to(minilab1, genai_data);
    // // to(hl3, genai_data);
    // to(hl4, route_data_from_ai_to_human);
    // // testing AI to Unity
    // to("::ffff:192.168.0.216", route_data_from_ai_to_human);


});

genai_ws.on('error', function error(data) {
  console.log("Websocket error:" + data.code);
  genai_ws.close();
  
});
genai_ws.on('close', function close(data) {
  console.log("The connection is closed.")
  console.log("Error information" + data);
  // setTimeout(() => {
  // }, 5000);
});

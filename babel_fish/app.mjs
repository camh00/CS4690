import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';
import staticHandler from 'serve-handler';
import ws, { WebSocketServer } from 'ws';
const port = process.argv[2] || 8888;
import dotenv from 'dotenv';
dotenv.config();
const API_KEY = process.env.API_KEY;

//server static folder
const server = createServer((req, res) => { // (1)
    return staticHandler(req, res, { public: 'public' })
});
const wss = new WebSocketServer({ server }) // (2)
const connectionInfo = { }
const langs_to_translate = []

/*
*** Types of msgs ****

** login-type message **
// Sample Requests:
{
    "msg_type": "login",
    "lang": "en",
    "user": "Little Bobby Tables"
}

// Sample Response:
{
    "user": "Little Bobby Tables",
    "action": "login"
}

** Send message  **
// Sample Request
{
    "msg_type": "msg",
    "msg": "Have a nice day!",
    "lang_from": "en",
    // "receivers": ["bob", "salley"], // or [ "all" ]
    "translations" : { }
}

// Sample Responses
{
    "user": "Little Bobby Tables",
    "action": "send_message",
    "msg": "Have a nice day!"
}
*/

wss.on('connection', (client) => {
    console.log(`Client connected ${JSON.stringify(client)}!`)
    const clientIpAddr = client._socket.remoteAddress
    const clientPort = client._socket.remotePort
    const clientUuid = uuidv4();
    client._socket._uuid = clientUuid;

    client.on('message', async (msg) => { // (3)
        console.log(`Received Message: ${msg}`);
        const msgData = JSON.parse(msg);
        if (msgData.msg_type == "login")
        {
            connectionInfo[clientUuid] = msgData;
            if (!langs_to_translate.includes(msgData.lang))
            {
                langs_to_translate.push(msgData.lang);
            }
        } 
        else if (msgData.msg_type == "msg")
        {
            const msg = msgData.msg;
            const orig_lang = msgData.lang_from;
            msgData.translations[orig_lang] = msg;
            const userInfo = connectionInfo[clientUuid];
            msgData.sender = userInfo.user;

            for await (const langCode of langs_to_translate) {
                // translate into lang using google translate
                const reqData = {
                    method: "POST",
                    body: JSON.stringify({ "q": msg, "target": langCode }),
                };
                console.log(`reqData: ${reqData}`)

                const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, reqData);

                const respData = await response.json();

                if ((respData) && (respData.data) && (respData.data.translations))
                {
                    console.log(respData.data.translations);
                    const tranlatedMessage = respData.data.translations[0].translatedText;
                    msgData.translations[langCode] = tranlatedMessage;
                }
                else
                {
                    console.log(respData);
                }
            };
        }
            
        broadcast(msgData);
    })
});

function broadcast(msgData) { // (4)
    for (const client of wss.clients) {
        if (client.readyState === ws.OPEN) {
            let respObj = null; 
            if (msgData.msg_type == "msg")
            {
                const currentSocketUserInfo = connectionInfo[client._socket._uuid];
                const langCode = currentSocketUserInfo.lang;
                const translatedText = msgData.translations[langCode];
                respObj = { user: msgData.sender, action: "send_message", msg: translatedText};
            }
            else // login
            {
                respObj ={ user: msgData.user, action: "login"};
            }

            const respObjJson = JSON.stringify(respObj);
            console.log(`Sending Message: ${respObjJson}`);

            client.send(respObjJson);
        }
    }
}

server.listen(port, () => {
    console.log(`server listening on port ${port}`);
});
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import http from 'http';
import { WebSocketServer } from 'ws';

const app = new Koa();
const router = new Router();
//解决跨域问题
app.use(cors());
app.use(bodyParser());

// Map from userId -> ws
const clients = new Map();

// helper send
function safeSend(ws, data) {
  try {
    if (ws && ws.readyState === ws.OPEN) ws.send(JSON.stringify(data));
  } catch (err) {
    console.warn('send error', err);
  }
}
//
router.get('/', async (ctx) => {
  ctx.body = { ok: true, msg: 'Koa WS chat server' };
});

router.post('/push', async (ctx) => {
  const payload = ctx.request.body;
  if (!payload || !payload.type) {
    ctx.status = 400;
    ctx.body = { error: 'invalid payload, missing type' };
    return;
  }

  // 单发
  if (payload.to) {
    const ws = clients.get(payload.to);
    if (!ws) {
      ctx.status = 404;
      ctx.body = { error: 'target not online' };
      return;
    }
    safeSend(ws, payload);
    ctx.body = { ok: true, to: payload.to };
    return;
  }

  // 广播
  for (const [id, ws] of clients) {
    safeSend(ws, payload);
  }
  ctx.body = { ok: true, broadcast: true };
});

app.use(router.routes()).use(router.allowedMethods());

//websocket和http server绑定端口
const server = http.createServer(app.callback());
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('new client connected');
  let userId=null
  ws.on('message',(raw)=>{
    let msg;
    try {
        msg=JSON.parse(raw.toString())
    } catch (error) {
        safeSend(ws,{type:'error',error:'invalid message format'})
        return 
    }
    const {type}=msg
    if(type=='register'){
        if(!msg.id){
            safeSend(ws,{type:'error',error:'missing user id'})
            return 
        }
        userId=String(msg.id)
        clients.set(userId,ws)
        console.log('user registered',userId)
        safeSend(ws,{type:'system',text:`registered as ${userId}`})
        return 
    }
    if(type=='message'){
        const {to}=msg
        if(to){
            const dest=clients.get(to)
            if(dest){
                safeSend(dest,msg)
            }else {
                safeSend(ws,{ type: 'system', text: `user ${to} not online` })
            }
        }else{
            for(const [id,clientWs] of clients){
                safeSend(clientWs,msg)
            }
        }
        return 
    }
    safeSend(ws, { type: 'system', text: 'unknown type', received: msg });
  })
    ws.on('close', () => {
    console.log('ws closed', userId);
    if (userId) clients.delete(userId);
  });
    ws.on('error', (err) => {
    console.warn('ws error', err);
    if (userId) clients.delete(userId);
  });
});

server.listen(3000, () => {
  console.log('chat server started on port 3000');
});

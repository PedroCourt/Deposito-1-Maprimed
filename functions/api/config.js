import {verifySession} from "../_utils/auth.js";

export async function onRequestGet({env}) {
  const raw = await env.APP_KV.get("app:config");
  const cfg = raw ? JSON.parse(raw) : {limitedCode:""};
  return Response.json(cfg,{headers:{"Cache-Control":"no-store"}});
}
export async function onRequestPost({request,env}) {
  if(!await verifySession(request,env.SESSION_SECRET)) return new Response("No autorizado",{status:401});
  const body = await request.json();
  const limitedCode = String(body?.limitedCode||"").trim().toUpperCase().slice(0,4);
  const cfg = {limitedCode,updatedAt:new Date().toISOString()};
  await env.APP_KV.put("app:config",JSON.stringify(cfg));
  return Response.json({ok:true,...cfg});
}

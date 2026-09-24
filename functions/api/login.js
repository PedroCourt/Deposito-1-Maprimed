import {makeSession,sessionCookie} from "../_utils/auth.js";

export async function onRequestPost({request,env}) {
  const body = await request.json();
  const supplied = String(body?.password||"");
  const expected = String(env.ADMIN_PASSWORD||"");
  if(!expected || supplied !== expected) return new Response("Contraseña incorrecta",{status:401});
  const token = await makeSession(env.SESSION_SECRET);
  return new Response(JSON.stringify({ok:true}),{
    headers:{"Content-Type":"application/json","Set-Cookie":sessionCookie(token)}
  });
}

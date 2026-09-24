import {clearCookie} from "../_utils/auth.js";
export async function onRequestPost() {
  return new Response(JSON.stringify({ok:true}),{
    headers:{"Content-Type":"application/json","Set-Cookie":clearCookie()}
  });
}

const enc = new TextEncoder();

function b64url(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
async function hmac(secret, data) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), {name:"HMAC",hash:"SHA-256"}, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}
export async function makeSession(secret) {
  const exp = Math.floor(Date.now()/1000) + 8*60*60;
  const payload = `admin|${exp}`;
  const sig = b64url(await hmac(secret,payload));
  return `${payload}.${sig}`;
}
export async function verifySession(request, secret) {
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(/(?:^|;\s*)warehouse_admin=([^;]+)/);
  if(!m || !secret) return false;
  const token = decodeURIComponent(m[1]);
  const parts = token.split(".");
  if(parts.length !== 2) return false;
  const payload = parts[0], sig = parts[1];
  const p = payload.split("|");
  if(p[0] !== "admin" || !p[1]) return false;
  if(Number(p[1]) < Math.floor(Date.now()/1000)) return false;
  const expected = b64url(await hmac(secret,payload));
  if(expected.length !== sig.length) return false;
  let diff = 0;
  for(let i=0;i<sig.length;i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}
export function sessionCookie(token) {
  return `warehouse_admin=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`;
}
export function clearCookie() {
  return "warehouse_admin=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0";
}

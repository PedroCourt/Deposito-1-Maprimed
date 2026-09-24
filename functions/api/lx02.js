export async function onRequestGet({env}) {
  const raw = await env.APP_KV.get("lx02:current");
  if(!raw) return Response.json({records:[],fileName:null,updatedAt:null});
  return new Response(raw,{headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
}
export async function onRequestPost({request,env}) {
  const body = await request.json();
  if(!body || !Array.isArray(body.records)) return new Response("Formato inválido",{status:400});
  if(body.records.length > 5000) return new Response("Demasiados registros",{status:413});
  const current = await env.APP_KV.get("lx02:current");
  if(current) await env.APP_KV.put("lx02:previous",current);
  const payload = {
    fileName:String(body.fileName||"LX02.xlsx").slice(0,200),
    updatedAt:new Date().toISOString(),
    records:body.records
  };
  await env.APP_KV.put("lx02:current",JSON.stringify(payload));
  return Response.json({ok:true,updatedAt:payload.updatedAt});
}

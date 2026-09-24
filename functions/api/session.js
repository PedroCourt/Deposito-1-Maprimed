import {verifySession} from "../_utils/auth.js";
export async function onRequestGet({request,env}) {
  return Response.json({authenticated:await verifySession(request,env.SESSION_SECRET)});
}

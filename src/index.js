// src/index.js
import jwt from "jsonwebtoken"
import { VerifyToken } from "./services/verify-token"

var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);
    if (!key) {
      return new Response("Path required", { status: 400 });
    }
    try {
      const object = await env.MY_BUCKET.get(key);
      if (object === null) {
        return new Response("Object Not Found", { status: 404 });
      }
 
      const queryParams = url.searchParams
      const token = queryParams.get("token")
      
      if(!token) {
        return new Response("Unauthorized", { status: 401 });
      }

      const response = await fetch('https://api.now.com.ve/verify-session', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }, 
        body: JSON.stringify({
          token
        })
      })

      if(response.status === 401) {
        return new Response("Unauthorized", { status: 401 });
      }

       if(response.status === 500) {
        return new Response("Unauthorized", { status: 401 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("Access-Control-Allow-Origin", "*");

      return new Response(object.body, { headers });
    } catch (error) {
      return new Response("Internal Server Error", { status: 500 });
    }
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map

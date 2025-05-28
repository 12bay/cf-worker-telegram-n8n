// Telegram Bot API base URL
const TELEGRAM_API_BASE = 'https://api.telegram.org';
const TELEGRAM_PROXY_BASE = '/xhook?url=';

// HTML template for documentation
const DOC_HTML = `<!DOCTYPE html>
<html>
<head>
    <title>Telegram Bot API Proxy Documentation - 12bay.vn</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 { color: #0088cc; }
        .code {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
            overflow-x: auto;
        }
        .note {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
        }
        .example {
            background: #e7f5ff;
            border-left: 4px solid #0088cc;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>Telegram Bot API Proxy - N8N PROXY</h1>
    <p>This service acts as a transparent proxy for the Telegram Bot API. It allows you to bypass network restrictions and create middleware for your Telegram bot applications.</p>
    
    <h2>How to Use</h2>
    <p>Replace <code>api.telegram.org</code> with this worker's URL in your API calls.</p>
    
    <div class="example">
        <h3>Example Usage:</h3>
        <p>Original Telegram API URL:</p>
        <div class="code">https://api.telegram.org/bot{YOUR_BOT_TOKEN}/sendMessage</div>
        <p>Using this proxy:</p>
        <div class="code">https://{YOUR_WORKER_URL}/bot{YOUR_BOT_TOKEN}/sendMessage</div>
    </div>

    <h2>Features</h2>
    <ul>
        <li>Supports all Telegram Bot API methods</li>
        <li>Handles both GET and POST requests</li>
        <li>Full CORS support for browser-based applications</li>
        <li>Transparent proxying of responses</li>
        <li>Maintains original status codes and headers</li>
        <li>Support Webhook callback for N8N</li>
        <div class="code"> https://{YOUR_WORKER_URL}/bot{YOUR_BOT_TOKEN}/getWebhookInfo</div>

    </ul>

    <div class="note">
        <strong>Note:</strong> This proxy does not store or modify your bot tokens. All requests are forwarded directly to Telegram's API servers.
    </div>

    <h2>Example Code</h2>
    <div class="code">
// JavaScript Example
fetch('https://{YOUR_WORKER_URL}/bot{YOUR_BOT_TOKEN}/sendMessage', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        chat_id: "123456789",
        text: "Hello from Telegram Bot API Proxy!"
    })
})
.then(response => response.json())
.then(data => console.log(data));
    </div>

    <div class="note">
        <strong>Credit:</strong> https://github.com/tuanpb99/cf-worker-telegram.
    </div>
</body>
</html>`;




async function handleRequestToHook(request) {
  // Clone the request to modify it
  const requestClone = new Request(request);
  const url = new URL(request.url);

  // If accessing the root path, show documentation
  if (url.pathname === '/' || url.pathname === '') {
    return new Response(DOC_HTML, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  

  // Extract the bot token and method from the URL path
  // Expected format: /bot{token}/{method}
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  if (!pathParts[0].startsWith('xhook')) {
    return new Response('Invalid hook request format', { status: 400 });
  }



  // Reconstruct the HOOK API URL
  const hookUrl = new URL(url.search.replace("?url=",""));

  // Create headers for the new request
  const headers = new Headers(request.headers);
  
  const rqBody = await requestClone.arrayBuffer()
  //console.log(rqBody);

  //var requestBody = await request.arrayBuffer()
  // Forward the request to Telegram API

  const telegramRequest = new Request(hookUrl, {
    method: requestClone.method,
    headers: headers,
    body: requestClone.method !== 'GET' ?  rqBody : undefined,
    redirect: 'follow',
  });

  try {
    const response = await fetch(telegramRequest);

    const responseBody = await response.arrayBuffer();
    
    // Create a new response with the Telegram API response
    const newResponse = new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    // Add CORS headers to allow requests from any origin
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return newResponse;
  } catch (error) {
    return new Response(`Error proxying request: ${error.message}`, { status: 500 });
  }
}

async function handleRequestToTele(request) {
  // Clone the request to modify it
  const requestClone = new Request(request);

  const url = new URL(request.url);

  // If accessing the root path, show documentation
  if (url.pathname === '/' || url.pathname === '') {
    return new Response(DOC_HTML, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }

  // Extract the bot token and method from the URL path
  // Expected format: /bot{token}/{method}
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  if (pathParts.length < 2 || !pathParts[0].startsWith('bot')) {
    return new Response('Invalid bot request format', { status: 400 });
  }

  var telegramUrl = new URL(
    `${TELEGRAM_API_BASE}${url.pathname}${url.search}`
  );



var bodyText = Object()

// handle set webhook
const headers = new Headers(request.headers);

if(url.pathname.endsWith("hook")){

  var x = url.search.replace("url=","url="+TELEGRAM_PROXY_BASE)

  console.log(url.origin);

  telegramUrl = new URL(
    `${TELEGRAM_API_BASE}${url.pathname}${url.searchParams}`
  );

  const requestCloneB = requestClone.clone();
  var bodyText = await requestCloneB.json(); // Lần 1: dùng clone để log


  bodyText['url'] = url.origin+TELEGRAM_PROXY_BASE + bodyText['url']
  
  var newbody = JSON.stringify(bodyText);

  //var requestBody = await request.arrayBuffer()
  // Forward the request to Telegram API

   telegramRequest = new Request(telegramUrl, {
    method: requestClone.method,
    headers: headers,
    body: requestClone.method !== 'GET' ?  newbody : undefined,
    redirect: 'follow',
  });
  


}else{


   const headers = new Headers(request.headers);
   const rqBody = await requestClone.arrayBuffer()

  var telegramRequest = new Request(telegramUrl, {
    method: requestClone.method,
    headers: headers,
    body: requestClone.method !== 'GET' ?  rqBody : undefined,
    redirect: 'follow',
  });
}






  try {
    const response = await fetch(telegramRequest);

    const responseBody = await response.arrayBuffer();
    
    // Create a new response with the Telegram API response
    const newResponse = new Response(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    // Add CORS headers to allow requests from any origin
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return newResponse;
  } catch (error) {
    return new Response(`Error proxying request: ${error.message}`, { status: 500 });
  }
}


// Handle OPTIONS requests for CORS
function handleOptionsToTele(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };

  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Main event listener for the worker
addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  
  //https://proxy-tele.12bay.workers.dev/xhook?url=https://n8n.12bay.vn/webhook/ff94e973-2366-4c1c-92a1-5ba31a156629/webhook
  // Call back HOOOK
  if (url.pathname.startsWith("/xhook")) {
   
    event.respondWith(handleRequestToHook(request));

  }else{

    // Handle CALL TO TELE preflight requests
  if (request.method === 'OPTIONS') {
    event.respondWith(handleOptionsToTele(request));
  } else {
    event.respondWith(handleRequestToTele(request));
  }

  }

}); 

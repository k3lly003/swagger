export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // Example of implementing cache control at the edge
  if (
    url.pathname.match(/\.(jpg|jpeg|gif|png|ico|svg|css|js|woff2)$/) ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/fonts/") ||
    url.pathname.startsWith("/_next/static/")
  ) {
    // Apply caching for static assets
    const response = await next();

    const newResponse = new Response(response.body, response);
    newResponse.headers.set(
      "Cache-Control",
      "public, max-age=86400, stale-while-revalidate=604800",
    );

    return newResponse;
  }

  // Add service worker headers if needed
  if (url.pathname === "/service-worker.js") {
    const response = await next();
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("Service-Worker-Allowed", "/");
    newResponse.headers.set("Cache-Control", "no-cache");
    return newResponse;
  }

  // Continue normal request handling
  return next();
}

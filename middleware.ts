import { NextResponse, NextRequest } from 'next/server';

const allowedOrigins = ['*'];
const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Middleware to authenticate using API key and handle CORS
const middleware = async (req: NextRequest) => {
  const origin = req.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);
  const isPreflight = req.method === 'OPTIONS';

  // Handle CORS for preflight requests
  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Authenticate using API key
  const apiKey = req.headers.get('x-api-key');
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return new Response(JSON.stringify({ message: "API key missing or invalid" }), { status: 401 });
  }

  // Handle simple requests with CORS
  const response = NextResponse.next();
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
};

export default middleware;

export const config = {
  matcher: '/api/:path*',
};
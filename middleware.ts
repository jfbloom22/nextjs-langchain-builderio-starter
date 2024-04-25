import { NextResponse, NextRequest } from 'next/server';


// Middleware to authenticate using Clerk
const clerkAuthMiddleware = async (req: NextRequest, res: NextResponse) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ message: "Authorization header missing or invalid" }), { status: 401 });
  }
  return NextResponse.next()
};

export default clerkAuthMiddleware;
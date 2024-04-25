import { NextResponse, NextRequest } from 'next/server';

export interface ExtendedNextApiRequest extends NextRequest {
  user?: any; // Define the type of `user` as per your application needs
}
export interface ExtendedNextApiResponse extends NextResponse {
  user?: any; // Define the type of `user` as per your application needs
}

// Middleware to authenticate using Clerk
const clerkAuthMiddleware = async (req: ExtendedNextApiRequest, res: ExtendedNextApiResponse) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ message: "Authorization header missing or invalid" }), { status: 401 });
  }

  const bearer = authHeader.split(' ')[1];
  const response = await fetch(`${process.env.CLERK_BASE_URL}/oauth/userinfo`, {
    headers: {
      Authorization: `Bearer ${bearer}`,
    },
  });

  if (!response.ok) {
    return Response.json({ message: "Authentication failed" }, { status: 401 });
  }

  const user = await response.json();
  if (!user.user_id) {
    return Response.json({ message: "Failed getting Clerk user" }, { status: 401 });
  }

  // req.user = user; // Attach user to request object
  // req.cookies.set('user', 'fakeuser');
  // return NextResponse.next({request: {}});
  // return res

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('user', JSON.stringify(user));
  return NextResponse.next({ request: { headers: requestHeaders } });
};

export default clerkAuthMiddleware;
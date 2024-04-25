import {
  clerkMiddleware,
  createRouteMatcher,
} from '@clerk/nextjs/server';
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { NextRequest } from 'next/server';

// Define route matchers for different authentication strategies
const isClerkProtectedRoute = createRouteMatcher([
  '/api(.*)',
]);

const isBearerTokenProtectedRoute = createRouteMatcher([
  '/api-gpt(.*)',
]);

interface ExtendedNextApiRequest extends NextApiRequest {
  user?: any; // Define the type of `user` as per your application needs
}

// Custom middleware to handle bearer token authentication
const bearerTokenMiddleware = async (req: ExtendedNextApiRequest, res: NextApiResponse, next: NextApiHandler) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Authorization header missing or invalid" });
  }

  const token = authHeader.split(' ')[1];
  const response = await fetch(`${process.env.CLERK_BASE_URL}/oauth/userinfo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  const user = await response.json();
  if (!user.user_id) {
    return res.status(401).json({ message: "Failed getting Clerk user" });
  }

  req.user = user; // Attach user to request object
  next();
};

// Combined middleware to handle both authentication methods based on route
const combinedMiddleware = async (req: NextRequest, res: NextApiResponse, next: NextApiHandler) => {
  if (isClerkProtectedRoute(req)) {
    return clerkMiddleware((auth, req, res, next) => {
      auth().protect();
      next();
    })(req, res, next);
  } else if (isBearerTokenProtectedRoute(req)) {
    return bearerTokenMiddleware(req, res, next);
  } else {
    next();
  }
};

export default combinedMiddleware;

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|api-gpt)(.*)'],
};
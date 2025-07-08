// src/app/api/scheduler/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const GITHUB_ACTIONS_SECRET = process.env.GITHUB_ACTIONS_SECRET;
  const authHeader = request.headers.get('authorization');

  if (!GITHUB_ACTIONS_SECRET) {
    console.error('CRON_SECRET is not defined in environment variables.');
    // Allow access in development if the secret is not set, for easier local testing.
    if (process.env.NODE_ENV !== 'development') {
      return new NextResponse('Internal Server Error: CRON_SECRET not configured.', { status: 500 });
    }
    console.warn('CRON_SECRET not set. Allowing access for development.');
  } else if (authHeader !== `Bearer ${GITHUB_ACTIONS_SECRET}`) {
    console.warn('Unauthorized attempt to access cron job endpoint.');
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // This is where your scheduled task logic will go.
  const currentTime = new Date().toISOString();
  console.log(`[Vercel Cron Task] Executed at: ${currentTime} - This message is logged by the scheduled task.`);
  console.log('Hello World');

  return NextResponse.json({ message: 'Cron job executed successfully.', timestamp: currentTime });
}

// Note:
// The actual scheduling is now handled by Vercel based on the `vercel.json` configuration.
// This API route is simply the target that Vercel Cron will invoke.
//
// To protect this endpoint, ensure:
// 1. `CRON_SECRET` environment variable is set in your Vercel project settings.
// 2. The `vercel.json` cron job definition includes the `Authorization: Bearer ${CRON_SECRET}` header
//    or passes the secret in the path if you prefer that method (though headers are generally cleaner).
//
// For local testing:
// You can call this endpoint using a tool like curl or Postman, ensuring you pass the
// correct Authorization header:
// `curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/scheduler`
// If CRON_SECRET is not set locally, it will bypass auth for easier dev testing.

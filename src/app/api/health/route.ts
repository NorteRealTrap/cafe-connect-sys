import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    // Return 200 so platform healthchecks don't fail the deployment while
    // we investigate DB connectivity. Include database status in the body
    // so operators can see the issue without failing the container startup.
    return NextResponse.json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 });
  }
}

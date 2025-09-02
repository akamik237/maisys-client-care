import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://172.17.184.236:8001';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return forwardRequest(request, resolvedParams.path, 'GET');
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return forwardRequest(request, resolvedParams.path, 'POST');
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return forwardRequest(request, resolvedParams.path, 'PUT');
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  return forwardRequest(request, resolvedParams.path, 'DELETE');
}

async function forwardRequest(request: NextRequest, pathArray: string[], method: string) {
  try {
    const path = pathArray.join('/');
    const url = new URL(request.url);
    const targetUrl = `${BACKEND_URL}/${path}${url.search}`;
    
    console.log(`API Route: Forwarding ${method} ${path} to Backend:`, targetUrl);
    
    let body = undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        body = await request.text();
      } catch (e) {
        // No body or already consumed
      }
    }

    const response = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body || undefined,
    });

    if (!response.ok) {
      console.error(`Backend error for ${path}:`, response.status, response.statusText);
      return NextResponse.json(
        { error: 'Backend service unavailable' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error forwarding to Backend:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

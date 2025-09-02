import { NextRequest, NextResponse } from 'next/server';

const LLM_GATEWAY_URL = process.env.LLM_GATEWAY_URL || 'http://172.17.184.236:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('API Route: Forwarding to LLM Gateway:', LLM_GATEWAY_URL);
    
    const response = await fetch(`${LLM_GATEWAY_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('LLM Gateway error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'LLM Gateway unavailable' },
        { status: 502 }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error forwarding to LLM Gateway:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'LLM Gateway API Proxy',
    target: LLM_GATEWAY_URL 
  });
}

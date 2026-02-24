import { NextRequest, NextResponse } from 'next/server';

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;

export async function POST(request: NextRequest) {
  const network = request.nextUrl.searchParams.get('network') || 'mainnet';
  const rpcUrl = network === 'sepolia' ? SEPOLIA_RPC_URL : MAINNET_RPC_URL;

  if (!rpcUrl) {
    return NextResponse.json({ error: 'RPC URL not configured' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('RPC proxy error:', err);
    return NextResponse.json({ error: 'RPC request failed' }, { status: 502 });
  }
}

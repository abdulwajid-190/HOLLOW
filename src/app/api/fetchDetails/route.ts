import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    // Validate the URL
    if (!url || typeof url !== 'string' || !url.startsWith('https://serpapi.com')) {
      return NextResponse.json({ error: 'Invalid or missing URL' }, { status: 400 });
    }

    const apiKey = process.env.SERP_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key missing' }, { status: 500 });
    }

    const urlWithKey = `${url}&api_key=${apiKey}`;

    // Fetch data from SerpAPI
    const response = await fetch(urlWithKey);

    // Check if the response was successful
    if (!response.ok) {
      throw new Error('Failed to fetch data from SerpAPI');
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

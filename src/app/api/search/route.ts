import axios from "axios";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  if (!query) {
    return new Response(JSON.stringify({ error: "Query parameter 'q' is missing" }), { status: 400 });
  }

  const apiKey = process.env.SERP_API_KEY;

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        q: query,
        engine: "google",
        api_key: apiKey,
        tbm: "shop",
        hl: "en",
        gl: "us",
        google_domain: "google.com"
      },
    });

    const shoppingResults = response.data.shopping_results || [];

    // console.log("Shopping results:", shoppingResults.slice(0, 15)); // Log first 5 items for brevity

    // Extract full detail for each product
    const extractedData = shoppingResults.map((item: any) => ({
      position: item.position,
      title: item.title,
      price: item.price,
      extracted_price: item.extracted_price,
      alternative_price: item.alternative_price ?? null,
      rating: item.rating ?? null,
      reviews: item.reviews ?? 0,
      product_id: item.product_id,
      product_link: item.product_link,
      serpapi_product_api: item.serpapi_product_api,
      immersive_product_page_token: item.immersive_product_page_token ?? null,
      serpapi_immersive_product_api: item.serpapi_immersive_product_api ?? null,
      source: item.source,
      source_icon: item.source_icon ?? null,
      multiple_sources: item.multiple_sources ?? false,
      snippet: item.snippet ?? null,
      extensions: item.extensions ?? [],
      thumbnail: item.thumbnail ?? null,
      thumbnails: item.thumbnails ?? [],
      serpapi_thumbnails: item.serpapi_thumbnails ?? [],
      tag: item.tag ?? null
    }));

    // console.log("Extracted data:", extractedData.slice(0, 5)); // Log first 5 items for brevity

    return new Response(JSON.stringify({ results: extractedData }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    console.error("Google Shopping API error:", err.response?.data || err.message);
    return new Response(
      JSON.stringify({ error: "Google Shopping request failed", details: err.message }),
      { status: 500 }
    );
  }
}

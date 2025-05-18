import redis from "@/app/lib/redis";
import { notFound } from "next/navigation";
import Image from "next/image";
import InteractiveBox from "./InteractiveBox";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const raw = await redis.get(`product:dummy`);
  if (!raw) return notFound();

  const product = JSON.parse(raw);
  const imageUrl = product.thumbnail || "/placeholder-image.png";

  const sellers = product?.serpapi_data?.sellers_results?.online_sellers || [];
  const related = product?.serpapi_data?.related_products?.different_brand || [];
  const specs = product?.serpapi_data?.specs_results?.details || [];
  const ratings = product?.serpapi_data?.reviews_results?.ratings || [];
  const filters = product?.serpapi_data?.reviews_results?.filters || [];
  const reviews = product?.serpapi_data?.reviews_results?.reviews || [];

  console.log(sellers, related, specs, ratings, filters, reviews);

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 flex">
     

      {/* Right Section: Product Details */}
      <div className="w-2/3 h-screen overflow-y-auto">
        <div className="container mx-auto py-10 px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Image */}
            <div className="w-full lg:w-1/2 flex justify-center items-center bg-gray-100 rounded-xl shadow-md">
              <Image
                src={imageUrl}
                alt={product.title}
                width={500}
                height={500}
                className="object-contain p-4 rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="w-full lg:w-1/2 space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

              {product.source && (
                <p className="text-sm text-gray-600">Sold by: {product.source}</p>
              )}

              {product.rating && (
                <p className="text-yellow-500 text-sm flex items-center">
                  ⭐ {product.rating} <span className="ml-2">({product.reviews} reviews)</span>
                </p>
              )}

              {product.snippet && (
                <p className="text-base text-gray-700 leading-relaxed">{product.snippet}</p>
              )}

              <div className="space-y-2">
                <p className="text-2xl font-semibold text-green-600">{product.price}</p>
                {product.alternative_price && (
                  <p className="text-sm line-through text-gray-400">
                    {product.alternative_price.price}
                  </p>
                )}
              </div>

              {product.tag && (
                <span className="inline-block text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  {product.tag}
                </span>
              )}
            </div>
          </div>

          {/* Specifications Section */}
          {specs.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900">Specifications</h2>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                {specs.map((spec: any, idx: number) => (
                  <li key={idx} className="text-gray-700">{spec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Online Sellers */}
          {sellers.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900">Online Sellers</h2>
              <ul className="space-y-4 mt-4">
                {sellers.map((seller: any, idx: number) => (
                  <li
                    key={idx}
                    className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="text-gray-800 font-medium">{seller.name}</p>
                      <p className="text-green-600">{seller.price?.extracted || "N/A"}</p>
                    </div>
                    <a
                      href={seller.link}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {related.map((item: any, idx: number) => (
                  <div key={idx} className="bg-gray-100 shadow-md rounded-lg p-4">
                    <p className="font-medium text-gray-800">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ratings & Filters */}
{/* Ratings & Filters */}





          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
              <ul className="space-y-4 mt-4">
                {reviews.map((review: any, idx: number) => (
                  <li
                    key={idx}
                    className="bg-white shadow-md p-4 rounded-lg"
                  >
                    <p className="font-semibold text-gray-900">{review.title}</p>
                    <p className="text-sm text-gray-600 mt-2">{review.content}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Left Section: Interactive Box */}
      <div className="w-1/3 bg-white shadow-md p-4 border-r border-gray-200">
        <InteractiveBox
          sellers={sellers}
          related={related}
          specs={specs}
          ratings={ratings}
          filters={filters}
          reviews={reviews}
        />
      </div>
    </div>
  );
}

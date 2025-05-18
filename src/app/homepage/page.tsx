"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import redis from "../lib/redis";
import styles from './fade.module.css';
export interface Product {
  position: number;
  title: string;
  price: string;
  extracted_price: number;
  alternative_price: {
    price: string;
    extracted_price: number;
  } | null;
  rating: number | null;
  reviews: number;
  product_id: string;
  product_link: string;
  serpapi_product_api: string;
  immersive_product_page_token: string | null;
  serpapi_immersive_product_api: string | null;
  source: string;
  source_icon: string | null;
  multiple_sources: boolean;
  snippet: string | null;
  extensions: string[];
  thumbnail: string | null;
  thumbnails: string[];
  serpapi_thumbnails: string[];
  tag: string | null;
}


export default function Home() {
  const [remover,setRemover]=useState(true);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  const handleSearch = async () => {
    const container = document.getElementById("removable-content");
    if (container) {
      container.classList.add("fade-out");
      setTimeout(() => setRemover(false), 1500); // Match animation duration
    }
    try {
      const searchaiRes = await axios.post("/api/searchai", { query });
    
      // Extract the cleaned query from the response
      const cleanedQuery = searchaiRes.data.query;

      if(!cleanedQuery){
        console.error("No cleaned query returned from searchai");
      }
      
      const res = await axios.get(`/api/search?q=${cleanedQuery}`);

      setResults(res.data.results || []);

      console.log("Search results:", res.data.results);
    } catch (error) {
      console.error("Search error:", error);
    }
  };


  const handleViewProduct = async (key: number) => {
    const product = results[key];
  
    const res = await fetch("/api/fetchDetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: product.serpapi_product_api }),
    });
  
    const detailedData = await res.json();
  
    const combinedProduct = {
      ...product,
      serpapi_data: detailedData,
    };
  
    // Ensure Redis write completes before navigation
    await fetch("/api/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: combinedProduct }),
    });
  
    // Only open the tab once data is definitely stored
    window.open(`/product/${product.product_id}`, "_blank");
  };
  
  
  
  
  
  

  return (
<div className="min-h-screen m-md " style={{backgroundColor:'#F2F5F7'}}>
    <div id="menubar" className=" w-full flex justify-between items-centre px-1 py-1 mb-25 shadow-lg " style={{backgroundColor:"#4A9094"}}>  
    <a href="/homepage"><img src="/assets/logo2.png" className="w-18 h-20  rounded-2xl" ></img></a>
    <img src="/assets/logo3.png" className="h-20"></img>
    <a href="/"className="hover:scale-105 text-white font-bold rounded-2xl flex justify-center items-center p-4 text-lg" style={{backgroundColor:"#4A9094"}}> Log Out</a>
    </div>
    {remover && (
        <div
          id="removable-content"
          className="flex flex-col items-center justify-center "
        >
          <h1 className="text-3xl text-blue-800 font-bold pb-3">
            What can I help you with?
          </h1>
          <p className="text-xl text-blue-500 pb-5">
            Give a description of the product, I am gonna give the Best Outcome.
          </p>
        </div>
      )}
  <div className="max-w-6xl mx-auto ">
    <div className="flex space-x-4 mb-8">
      <input
        className="text-[#5D4037] text-2xl rounded-full p-4 flex-1 shadow-2xl focus:ring focus:ring-blue-300 focus:outline-none "
        style={{
          border: "1px solid #D9A775", // Subtle border color
          backgroundColor: "#FFF9F2", // Soft peach background
          color: "#5D4037", // Dark brown text
        }}
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button
        className=" text-2xl hover:bg-blue-700 text-white px-6 py-4 rounded-full shadow-lg transition-transform transform hover:scale-105"
        style={{backgroundColor:'#4169E1'}}
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
      {results.map((item, i) => (
        <div
          key={i}
          className=" rounded-2xl shadow-xl hover:shadow-2xl transition-all p-4 flex flex-col items-center justify-between"
          style={{backgroundColor:'#F1FAEE'}}
        >
        <button
        onClick={() => handleViewProduct(i)} // Pass the index (i)
        className="mt-6 inline-block text-sm font-medium text-blue-600 hover:underline"
      >
          <div className="w-full aspect-w-1 aspect-h-1 relative mb-4">
            <img
              src={item.thumbnail || "/placeholder-image.png"}
              alt={item.title}
              className="w-100 h-100 object-cover rounded-xl"
            />
          </div>
          <div className="flex-grow text-center">
            <h2 className="text-xl font-semibold text-gray-800">{item.title.split(" ").slice(0, 10).join(" ") + "..."}</h2>
            <div className=" ">

            <p className="text-sm text-gray-600 mt-2">{item.source}</p>
            {item.snippet && (
              <p className="text-sm text-gray-700 mt-2">{item.snippet}</p>
            )}
            <p className="text-green-600 font-semibold text-xl mt-4">{item.price}</p>
            {item.alternative_price && (
              <p className="text-sm line-through text-gray-400 mt-1">
                {item.alternative_price.price}
              </p>
            )}
            {item.rating && (
              <p className="text-yellow-600 text-sm mt-1">
                ⭐ {item.rating} ({item.reviews} reviews)
              </p>
            )}
            {item.tag && (
              <p className="inline-block mt-4 text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                {item.tag}
              </p>
            )}
            </div>
          </div>
          </button>

        </div>
      ))}
  </div>
</div>


  );
}

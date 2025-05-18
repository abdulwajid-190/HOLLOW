"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  sellers: any[];
  related: any[];
  specs: any[];
  ratings: any[];
  filters: any[];
  reviews: any[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function InteractiveBox({ sellers, related, specs, ratings, filters, reviews }: Props) {
  const [prompt, setPrompt] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    const newUserMessage: Message = { role: "user", content: prompt };
    const updatedConversation = [...conversation, newUserMessage];

    try {
      const res = await fetch("/api/openapi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: updatedConversation,
          context: { sellers, related, specs, ratings, filters, reviews },
        }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };

      setConversation([...updatedConversation, assistantMessage]);
      setPrompt("");
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setConversation([
        ...updatedConversation,
        { role: "assistant", content: "⚠️ Error fetching AI response." },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="w-full h-full max-w-2xl mx-auto p-4 border rounded-lg bg-white shadow-sm">
      <div className="mb-4 h-[500px] max-h-900 overflow-y-auto space-y-3 p-4 bg-gray-50 border rounded-md">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-md transition-all duration-200 ${
              msg.role === "user"
                ? "bg-blue-100 text-blue-900 self-end text-right"
                : "bg-green-100 text-green-900 self-start text-left"
            }`}
          >
            <span className="font-semibold">
              {msg.role === "user" ? "You" : "AI"}:
            </span>{" "}
            {msg.content}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-grow p-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ask something about the product..."
        />
        <button
          onClick={handleSubmit}
          className="px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";

export function RecipeChatBot({ recipe }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: `👋 Hi! I'm your recipe assistant. Ask me anything about "${recipe?.strMeal || "this recipe"}".`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle sending message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Extract recipe info safely
    const recipeDetails = {
      name: recipe?.strMeal || recipe?.name || "Unknown Recipe",
      ingredients:
        recipe?.ingredients ||
        Object.keys(recipe)
          .filter((key) => key.startsWith("strIngredient") && recipe[key])
          .map((key) => recipe[key]),
      instructions: recipe?.strInstructions || recipe?.instructions || "",
    };

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          recipe: recipeDetails,
        }),
      });

      // Ensure safe parsing of JSON
      let data;
      try {
        data = await res.json();
      } catch (err) {
        console.error("Failed to parse JSON from backend:", await res.text());
        throw err;
      }

      if (data.reply) {
        setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
        console.log("🤖 Bot reply:", data.reply);
      } else {
        toast.error("No response from chatbot.");
      }
    } catch (err) {
      console.error("Chatbot Error:", err);
      toast.error("Failed to get chatbot response.");
    } finally {
      setLoading(false);
    }
  };

  // Send message on Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border border-gray-300 rounded-2xl p-4 bg-white shadow-md flex flex-col w-full min-h-[400px] max-h-[600px]">
      {/* Title */}
      {/* <h2 className="text-lg font-semibold mb-2 text-gray-800 text-center">
        🍳 Recipe Chat Assistant
      </h2> */}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-3 space-y-3 bg-gray-50 rounded-lg p-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-xl text-sm ${
                m.role === "user"
                  ? "bg-green-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <p className="text-gray-500 italic animate-pulse">Bot is typing...</p>
        )}
        {/* <div ref={chatEndRef} /> */}
      </div>

      {/* Input Box */}
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about this recipe..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 resize-none h-10 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 flex items-center justify-center transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import MeteorShowerBackground from "./MeteorShowerBackground";
import axios from "axios";
import Loading from "./Loading";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
// import { Button } from "@/components/ui/button"; // Sử dụng UI đẹp hơn (nếu có)

interface Quote {
  content: string;
  author: string;
}

const Home = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_API_URL = import.meta.env.VITE_API_URL;
  const RANDOM_QUOTE_API = `${BASE_API_URL}/quote/random`;

  const fetchQuote = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<{ data: Quote }>(`${RANDOM_QUOTE_API}`);
      if (response.data.data) {
        setQuote(response.data.data);
      } else {
        setError("No quote found.");
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch quote.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <MeteorShowerBackground
        color="#B8A2F9"
        count={30}
        speed={0.6}
        starCount={500}
      />

      {isLoading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        quote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-10 max-w-4xl">
            <h1 className="font-monday text-white/80 text-3xl md:text-4xl lg:5xl shadow-lg tracking-wide">
              {quote.content}
            </h1>
            <p className="text-sm md:text-2xl text-white/80 mt-2">
              — {quote.author}
            </p>
            <Button
              onClick={fetchQuote}
              variant="outline"
              className="text-white/80 text-2xl md:text-3xl lg:text-4xl tracking-wide mt-8 p-5 md:p-8 font-bold rounded-xl border border-2 border-white hover:bg-zinc-200 hover:text-black hover:scale-105 active:scale-95">
              Get New Quote
            </Button>
          </motion.div>
        )
      )}
    </main>
  );
};

export default Home;

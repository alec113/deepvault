import { useState, useEffect } from "react";
import axios from "axios";

import { StoreProvider } from "../context/StoreContext";
import { ProductCard } from "../components/ProductCard";
import { Cart } from "../components/Cart";
import { toast } from "sonner";

const BIN_ID = "67b0a7d1ad19ca34f804be59";
const API_KEY = "$2a$10$LoUE3DG23v0idSgqUwPW2ezaM2GPu/HLJAnxJAxZeua0QbYLu54wK";

const Index = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        headers: { "X-Master-Key": API_KEY },
      })
      .then((res) => setProducts(res.data.record))
      .catch((err) => {
        toast.error("Error fetching data");
        console.error("Error fetching data:", err);
      });
  }, []);

  return (
    <StoreProvider>
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-semibold text-gray-900">Deepvault3</h1>
            <p className="mt-2 text-gray-600">
              Discover our curated collection
            </p>
          </header>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
        <Cart />
      </div>
    </StoreProvider>
  );
};

export default Index;

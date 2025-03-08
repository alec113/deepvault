import { useState, useEffect } from "react";
import axios from "axios";

import { StoreProvider } from "./context/StoreContext";
import { ProductCard } from "./components/ProductCard";
import { Cart } from "./components/Cart";
import { toast } from "sonner";

const BIN_ID = "67b0a7d1ad19ca34f804be59";
const API_KEY = "$2a$10$LoUE3DG23v0idSgqUwPW2ezaM2GPu/HLJAnxJAxZeua0QbYLu54wK";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
          headers: { "X-Master-Key": API_KEY },
        });
        
        // Transform data to ensure the correct structure
        // This will keep original products as-is if they already have images array
        const transformedProducts = response.data.record.map(product => {
          if (!product.images) {
            return {
              ...product,
              images: [product.image]
            };
          }
          return product;
        });
        
        setProducts(transformedProducts);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        toast.error("Error fetching products");
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">We couldn't load the products. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No products available at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
        <Cart />
      </div>
    </StoreProvider>
  );
};

export default Index;
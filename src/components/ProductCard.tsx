import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group relative overflow-hidden rounded-lg bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className={`h-full w-full object-cover transition-opacity duration-700 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setIsLoading(false)}
            />
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
          </div>
          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500">
              ₦{product.price.toLocaleString()}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="grid gap-4">
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {product.name}
            </h2>
            <p className="mt-2 text-gray-500">{product.description}</p>
            <p className="mt-4 text-xl font-medium text-gray-900">
              ₦{product.price.toLocaleString()}
            </p>
          </div>
          <Button
            onClick={() => addToCart(product)}
            className="w-full bg-gray-900 text-white hover:bg-gray-800"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

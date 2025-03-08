import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
};

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dialogImageIndex, setDialogImageIndex] = useState(0);
  
  // Use images array if available, otherwise create array from single image
  const productImages = product.images || [product.image];

  const nextImage = (event: React.MouseEvent, isDialog = false) => {
    event.stopPropagation();
    if (isDialog) {
      setDialogImageIndex((prev) => (prev + 1) % productImages.length);
    } else {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }
  };

  const prevImage = (event: React.MouseEvent, isDialog = false) => {
    event.stopPropagation();
    if (isDialog) {
      setDialogImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    }
  };

  const handleDialogOpen = () => {
    // Sync dialog image index with card image index when opening dialog
    setDialogImageIndex(currentImageIndex);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div 
          className="group relative overflow-hidden rounded-lg bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer"
          onClick={handleDialogOpen}
        >
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img
              src={productImages[currentImageIndex]}
              alt={`${product.name} - image ${currentImageIndex + 1}`}
              className={`h-full w-full object-cover transition-opacity duration-700 ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setIsLoading(false)}
            />
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}

            {/* Image navigation controls - only show if multiple images */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={(e) => prevImage(e)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => nextImage(e)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                {/* Image indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                  {productImages.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 w-1.5 rounded-full ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500">
              ${product.price.toLocaleString()}
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <div className="grid gap-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img
              src={productImages[dialogImageIndex]}
              alt={`${product.name} - image ${dialogImageIndex + 1}`}
              className="h-full w-full object-cover"
            />
            
            {/* Dialog image navigation - only show if multiple images */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={(e) => prevImage(e, true)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => nextImage(e, true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                {/* Thumbnail preview */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                  {productImages.map((img, index) => (
                    <div
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDialogImageIndex(index);
                      }}
                      className={`h-12 w-12 rounded border-2 cursor-pointer ${
                        index === dialogImageIndex ? "border-blue-500" : "border-transparent"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-full w-full object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {product.name}
            </h2>
            <p className="mt-2 text-gray-500">{product.description}</p>
            <p className="mt-4 text-xl font-medium text-gray-900">
              ${product.price.toLocaleString()}
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
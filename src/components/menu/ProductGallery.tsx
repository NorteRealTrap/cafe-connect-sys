import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ZoomIn } from "lucide-react";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {images.map((image, index) => (
          <div 
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setSelectedImage(image)}
          >
            <img 
              src={image} 
              alt={`${productName} ${index + 1}`}
              className="w-full h-32 object-cover transition-transform group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-4 w-4" />
          </Button>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt={productName}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

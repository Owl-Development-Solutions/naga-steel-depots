import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import Rating from "@/components/rating";
import ProductPromoPrice from "./product-promo-price";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full max-w-sm hover:scale-105 hover:shadow-lg transition-all duration-300 hover:bg-gray-50">
      <CardHeader className="p-0 relative">
        <Link
          href={`/product/${product.slug}`}
          className="block hover:opacity-80 transition-opacity duration-200"
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            priority
          />
        </Link>

        {Number(product.promoPrice) > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-10">
            Discounted Price
          </div>
        )}
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-xs">{product.brand}</div>

        <Link
          href={`/product/${product.slug}`}
          className="hover:text-primary transition-colors duration-200"
        >
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>

        <div className="flex-between gap-4">
          <Rating value={Number(product.rating)} />
          {product.stock > 0 ? (
            <span className="font-bold">
              {Number(product.promoPrice) > 0 ? (
                <>
                  <ProductPromoPrice value={Number(product.promoPrice)} />
                </>
              ) : (
                <ProductPrice value={Number(product.price)} />
              )}
            </span>
          ) : (
            <span className="text-destructive">Out of Stock</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

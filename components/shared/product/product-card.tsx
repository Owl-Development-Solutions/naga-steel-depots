import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";
import { Product } from "@/types";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={300}
            height={300}
            priority
          />
        </Link>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-xs">{product.brand}</div>

        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>

        <div className="flex-between gap-4">
          <span>{product.rating} Stars</span>
          {product.stock > 0 ? (
            <span className="font-bold">
              <ProductPrice value={Number(product.price)} />
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

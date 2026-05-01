import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./landing/reviews";
import { getProductById } from "@/lib/actions/product.actions";
import Rating from "./rating";

const ProductDetails = async ({ productId }: { productId: string }) => {
  const { data } = await getProductById(productId);

  return (
    <div className="space-y-4">
      {/* Image */}
      <div className="w-full h-60 rounded-xl overflow-hidden">
        <img
          src={data?.images?.[0]}
          alt={data?.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title + Category */}
      <div>
        <h2 className="text-xl font-semibold">{data?.name}</h2>
        <p className="text-sm text-muted-foreground">
          {data?.category} • {data?.brand}
        </p>
      </div>

      {/* Price + Stock */}
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">₱{data?.price}</p>
        <Badge variant={data!.stock > 0 ? "default" : "destructive"}>
          {data!.stock > 0 ? `${data?.stock} in stock` : "Out of stock"}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground">{data?.description}</p>

      {/* Rating */}
      <div className="text-sm">
        <Rating value={Number(data?.rating)} /> ({data?.numReviews ?? 0}{" "}
        reviews)
      </div>

      {/* Flags */}
      <div className="flex gap-2 flex-wrap">
        {data?.isFeatured && <Badge>Featured</Badge>}
        {data?.isFlagged && <Badge variant="destructive">Flagged</Badge>}
      </div>

      {/* Metadata */}
      <div className="text-xs text-muted-foreground">
        Created: {new Date(data!.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ProductDetails;

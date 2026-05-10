import { cn, formatNumberWithComma } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const ProductPrice = ({
  value,
  className,
  promoPrice,
}: {
  value: number;
  className?: string;
  promoPrice?: number;
}) => {
  const stringValue = value.toFixed(2);
  const [intValue, floatValue] = stringValue.split(".");

  const promoStringValue = promoPrice?.toFixed(2);
  const [promoIntValue, promoFloatValue] = promoStringValue?.split(".") || [];

  const hasPromoPrice = promoPrice === 0 ? "" : promoIntValue;

  return (
    <div className="flex items-center gap-2">
      {/* Original Price */}
      <p
        className={cn(
          "text-2xl w-fit",
          hasPromoPrice
            ? "line-through text-gray-400 text-lg px-3 py-1 bg-gray-100 rounded-full"
            : className,
        )}
      >
        <span className="text-xs align-super"> ₱</span>
        {formatNumberWithComma(intValue)}
        <span className="text-xs align-super">.{floatValue}</span>
      </p>
      {hasPromoPrice && <ArrowRight />}

      {/* Promo Price */}
      {hasPromoPrice && (
        <p className={cn("text-2xl w-fit", className)}>
          <span className="text-xs align-super"> ₱</span>
          {formatNumberWithComma(promoIntValue)}
          <span className="text-xs align-super">.{promoFloatValue}</span>
        </p>
      )}
    </div>
  );
};

export default ProductPrice;

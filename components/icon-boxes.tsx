import { Headset, ShoppingBag, Wallet, WalletCards } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { FaPesoSign } from "react-icons/fa6";

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <ShoppingBag className="h-6 w-6" />

            <div className="text-sm font-bold">Free Shipping</div>

            <div className="text-sm text-muted-foreground">
              Free shipping on orders within Lapu-Lapu City, Cebu
            </div>
          </div>

          {/* <div className="flex flex-col items-center space-y-2">
            <FaPesoSign className="h-6 w-6" />

            <div className="text-sm font-bold">Money Back Guarantee</div>

            <div className="text-sm text-muted-foreground">
              Within 30 days of purchase
            </div>
          </div> */}

          <div className="flex flex-col items-center space-y-2">
            <WalletCards className="h-6 w-6" />

            <div className="text-sm font-bold">Flexible Payment</div>

            <div className="text-sm text-muted-foreground">
              Pay with credit card, PayPal or COD
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IconBoxes;

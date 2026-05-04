"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { CartItem } from '@/types';

interface CartCheckboxProps {
  item: CartItem;
  isSelected: boolean;
  onSelectionChange: (itemId: string, selected: boolean) => void;
  disabled?: boolean;
}

const CartCheckbox = ({ 
  item, 
  isSelected,
  onSelectionChange,
  disabled = false
}: CartCheckboxProps) => {
  const handleCheckboxChange = (checked: boolean) => {
    onSelectionChange(item.productId, checked);
  };

  return (
    <div className="flex justify-center">
      <Checkbox
        checked={isSelected}
        onCheckedChange={handleCheckboxChange}
        disabled={disabled}
        className="shrink-0"
      />
    </div>
  );
};

export default CartCheckbox;

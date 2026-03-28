/**
 * One line in the shopping cart. Line subtotal is unitPrice × quantity (computed in the cart context).
 */
export interface CartItem {
  bookId: number;
  title: string;
  unitPrice: number;
  quantity: number;
}

export function lineSubtotal(item: CartItem): number {
  return item.unitPrice * item.quantity;
}

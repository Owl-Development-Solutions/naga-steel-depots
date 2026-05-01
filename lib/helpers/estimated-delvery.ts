const INSIDE_KEYWORDS = ["lapu", "lapu-lapu", "lapu lapu"];

export const normalize = (text: string) =>
  text.toLowerCase().replace(/[-\s]/g, "");

export function calculateDelivery(address: { city: string }) {
  const isInside = normalize(address.city).includes("lapulapu");

  const shippingPrice = isInside ? 0 : 500;

  const minDays = isInside ? 1 : 2;
  const maxDays = isInside ? 2 : 5;

  const now = new Date();
  const estimatedDeliveryStart = new Date(
    now.getTime() + minDays * 24 * 60 * 60 * 1000,
  );
  const estimatedDeliveryEnd = new Date(
    now.getTime() + maxDays * 24 * 60 * 60 * 1000,
  );

  return {
    isInside,
    shippingPrice,
    estimatedDeliveryStart,
    estimatedDeliveryEnd,
  };
}

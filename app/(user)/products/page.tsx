import ProductList from "@/components/shared/product/product-list";
import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/product.actions";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";

const Products = async () => {
  const latestProducts = await getLatestProducts();
  const featureProducts = await getFeaturedProducts();
  return (
    <>
      {featureProducts.length > 0 && <ProductCarousel data={featureProducts} />}
      <ProductList data={latestProducts} title="" limit={4} />
      <ViewAllProductsButton />
    </>
  );
};

export default Products;

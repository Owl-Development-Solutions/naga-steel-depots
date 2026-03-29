import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/lib/db/sample-data";

const Products = () => {
  return (
    <>
      <ProductList
        data={sampleData.products}
        title="Newest Arrivals"
        limit={4}
      />
    </>
  );
};

export default Products;

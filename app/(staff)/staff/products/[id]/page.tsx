import { auth } from "@/auth";
import ProductForm from "@/components/admin/product-form";
import { getProductById } from "@/lib/actions/product.actions";
import { Product } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;

  if (!id) throw new Error("Product not found");

  const res = await getProductById(id);

  if (!res.success) throw new Error("Something went wrong ");

  return {
    title: `Update - ${res.data?.name}`,
  };
}

const StaffProductUpdatePage = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  if (!id) return notFound();

  const res = await getProductById(id);

  if (!res.success) {
    return notFound();
  }

  const session = await auth();

  return (
    <div className="space-y-8 mx-auto">
      <h1 className="h2-bold">Update Product</h1>
      <ProductForm
        type="Update"
        product={res.data as Product}
        productId={res.data?.id}
        role={session?.user?.role!}
      />
    </div>
  );
};

export default StaffProductUpdatePage;

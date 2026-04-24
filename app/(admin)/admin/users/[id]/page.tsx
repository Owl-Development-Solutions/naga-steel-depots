import UserAdminForm from "@/components/admin/user-form";
import { getUserByIdByProps } from "@/lib/actions/user.actions";
import { User } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;

  if (!id) throw new Error("Product not found");

  const res = await getUserByIdByProps(id);

  if (!res.success) throw new Error("Something went wrong ");

  return {
    title: `Update - ${res.data?.name}`,
  };
}

const CreateUser = async (props: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await props.params;

  console.log(id);

  if (!id) return notFound();

  const res = await getUserByIdByProps(id);

  console.log(res.data);

  // Sanitize the product data to ensure address fields aren't null
  const sanitizedProduct = {
    ...res.data,
    address: res.data?.address ?? {
      fullName: "",
      streetAddress: "",
      phoneNumber: "",
      addressInformation: "",
      city: "",
      postalCode: "",
      country: "",
    },
  };

  if (!res.success) {
    return notFound();
  }

  return (
    <div className="space-y-8 mx-auto">
      <h1 className="h3-bold">Update user {res.data?.name}</h1>
      <UserAdminForm
        type="Update"
        user={sanitizedProduct as User}
        userId={res.data?.id}
      />
    </div>
  );
};

export default CreateUser;

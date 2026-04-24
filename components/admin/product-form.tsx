"use client";

import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validator";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  Resolver,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import z from "zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import slugify from "slugify";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: "Create" | "Update";
  product?: Product;
  productId?: string;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(
      type === "Create" ? insertProductSchema : updateProductSchema,
    ) as Resolver<z.infer<typeof insertProductSchema>>,
    defaultValues: type === "Update" ? product : productDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values,
  ) => {
    //on create
    if (type === "Create") {
      const res = await createProduct(values);
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
      router.push("/admin/products");
    }

    //on update
    if (type === "Update") {
      if (!productId) {
        router.push("/admin/products");
        return;
      }

      const res = await updateProduct({ ...values, id: productId });

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
      router.push("/admin/products");
    }
  };

  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-9">
        <Link href="/admin/products">
          <Button variant="outline" size="sm" className="cursor-pointer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-start md:flex-row gap-5">
            {/* Name */}
            <Controller
              name="name"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "name"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    placeholder="Enter product name"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Slug */}
            <Controller
              name="slug"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "slug"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Slug</FieldLabel>
                  <div className="relative">
                    {" "}
                    <Input
                      placeholder="Enter product name"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    <Button
                      type="button"
                      className="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
                      onClick={() => {
                        form.setValue(
                          "slug",
                          slugify(form.getValues("name"), { lower: true }),
                        );
                      }}
                    >
                      Generate
                    </Button>
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-5">
            {/* Category */}
            <Controller
              name="category"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "category"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Category</FieldLabel>
                  <Input
                    placeholder="Enter Category"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Brand */}
            <Controller
              name="brand"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "brand"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Brand</FieldLabel>
                  <Input
                    placeholder="Enter Brand"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-5">
            {/* Price */}
            <Controller
              name="price"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "price"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Price</FieldLabel>
                  <Input
                    placeholder="Enter Product Price"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Stock */}
            <Controller
              name="stock"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "stock"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Stock</FieldLabel>
                  <Input
                    placeholder="Enter Stock"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="upload-field flex flex-col md:flex-row gap-5">
            {/* Images */}
            <Controller
              control={form.control}
              name="images"
              render={() => (
                <Card className="w-full">
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {images.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt="product-image"
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={100}
                          height={100}
                        />
                      ))}

                      <Field>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue("images", [...images, res[0].url]);
                          }}
                          onUploadError={(err: Error) => {
                            toast.error(`ERROR! ${err.message}`);
                          }}
                        />
                      </Field>
                    </div>
                  </CardContent>
                </Card>
              )}
            />
          </div>

          <div className="upload-field">
            {/* isFeatured */}
            Featured Product
            <Card>
              <CardContent>
                <Controller
                  name="isFeatured"
                  control={form.control}
                  render={({
                    field,
                    fieldState,
                  }: {
                    field: ControllerRenderProps<
                      z.infer<typeof insertProductSchema>,
                      "isFeatured"
                    >;
                    fieldState: ControllerFieldState;
                  }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      orientation="horizontal"
                    >
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FieldLabel
                        htmlFor="form-rhf-checkbox-responses"
                        className="font-normal"
                      >
                        Is Featured ?
                      </FieldLabel>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                {isFeatured && banner && (
                  <Image
                    src={banner}
                    alt="banner-image"
                    className="w-full object-cover object-center rounded-sm"
                    width={1920}
                    height={680}
                  />
                )}

                {isFeatured && !banner && (
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res: { url: string }[]) => {
                      form.setValue("banner", res[0].url);
                    }}
                    onUploadError={(err: Error) => {
                      toast.error(`ERROR! ${err.message}`);
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <div>
            {" "}
            <Controller
              control={form.control}
              name="description"
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "description"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea
                    className="resize-none"
                    placeholder="Enter product description"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div>
            {/* Submit */}
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting" : `${type} Product`}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
};

export default ProductForm;

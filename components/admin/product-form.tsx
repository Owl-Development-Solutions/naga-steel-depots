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
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";
import { ArrowLeft, Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  createProduct,
  getAllCategories,
  updateProduct,
} from "@/lib/actions/product.actions";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";

const ProductForm = ({
  type,
  product,
  productId,
  role,
}: {
  type: "Create" | "Update";
  product?: any;
  productId?: string;
  role: string;
}) => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );

  const productData = {
    ...product,
    category: product?.category,
  };

  console.log("productData", productData);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const triggerRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(
      type === "Create" ? insertProductSchema : updateProductSchema,
    ) as Resolver<z.infer<typeof insertProductSchema>>,
    defaultValues: type === "Update" ? productData : productDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values,
  ) => {
    if (type === "Create") {
      const res = await createProduct(values);
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
      if (role === "admin") {
        router.push("/admin/products");
      } else {
        router.push("/staff/products");
      }
    }

    //on update
    if (type === "Update") {
      if (!productId) {
        if (role === "admin") {
          router.push("/admin/products");
        } else {
          router.push("/staff/products");
        }
        return;
      }

      const res = await updateProduct({ ...values, id: productId });

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }
      if (role === "admin") {
        router.push("/admin/products");
      } else {
        router.push("/staff/products");
      }
    }
  };

  const onError = (val: any) => {
    console.log(val);
  };

  const images = form.watch("images");
  const isFeatured = form.watch("isFeatured");
  const banner = form.watch("banner");

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-9">
        <Link
          href={`${role === "admin" ? "/admin/products" : "/staff/products"}`}
        >
          <Button variant="outline" size="sm" className="cursor-pointer">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>
      <form
        className="space-y-8"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <FieldGroup>
          {/* Row 1: Name and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

            {/* Category */}
            <Controller
              name="categoryId"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "categoryId"
                >;
                fieldState: ControllerFieldState;
              }) => {
                const filtered = categories.filter((cat) =>
                  cat.name.toLowerCase().includes(search.toLowerCase()),
                );

                const selected = categories.find(
                  (cat) => cat.id === field.value,
                );

                const exactMatch = categories.some(
                  (cat) => cat.name.toLowerCase() === search.toLowerCase(),
                );

                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Category</FieldLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          ref={triggerRef}
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between font-normal"
                        >
                          {selected
                            ? selected.name
                            : field.value && !selected
                              ? field.value // custom typed value
                              : "Select or type a category..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="p-0"
                        align="start"
                        style={{ width: triggerRef.current?.offsetWidth }}
                      >
                        <div className="p-2 border-b">
                          <Input
                            placeholder="Search or type new category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-8"
                          />
                        </div>

                        <div className="max-h-60 overflow-y-auto">
                          {search && !exactMatch && (
                            <div
                              onClick={() => {
                                field.onChange(search);
                                setOpen(false);
                                setSearch("");
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent border-b text-muted-foreground"
                            >
                              <span className="text-primary font-medium">
                                + Add
                              </span>
                              &quot;{search}&quot; as new category
                            </div>
                          )}

                          {filtered.length === 0 && !search ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No category found.
                            </p>
                          ) : (
                            filtered.map((cat) => (
                              <div
                                key={cat.id}
                                onClick={() => {
                                  field.onChange(cat.id);
                                  setOpen(false);
                                  setSearch("");
                                }}
                                className={cn(
                                  "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent",
                                  field.value === cat.id && "bg-accent",
                                )}
                              >
                                <Check
                                  className={cn(
                                    "h-4 w-4 shrink-0",
                                    field.value === cat.id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {cat.name}
                              </div>
                            ))
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
          </div>

          {/* Row 2: Brand and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          </div>

          {/* Row 3: Promo Price and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Promo Price */}
            <Controller
              name="promoPrice"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "promoPrice"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Promo Price</FieldLabel>
                  <Input
                    placeholder="Enter Promo Price (Optional)"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Discounted price for promotional offers
                  </p>
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

          {/* Row 4: Low Stock Threshold and Flag for Restock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Low Stock Threshold */}
            <Controller
              name="lowStockThreshold"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "lowStockThreshold"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Low Stock Threshold</FieldLabel>
                  <Input
                    type="number"
                    placeholder="Enter low stock threshold (e.g., 10)"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Alert when stock falls to or below this level
                  </p>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Is Flagged */}
            <Controller
              name="isFlagged"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  "isFlagged"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Flag for Restock</FieldLabel>
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="isFlagged"
                    />
                    <label
                      htmlFor="isFlagged"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Flag this product for restock notification
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Flagged products appear in admin or staff notifications
                  </p>
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

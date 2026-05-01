"use client";

import { createUserSchema, updateUserSchema } from "@/lib/validator";
import { CreateUserInput, User } from "@/types";
import { useRouter } from "next/navigation";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  Resolver,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import z from "zod";
import { userCreateDefaultValues } from "@/lib/constants";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";

import { ArrowLeft } from "lucide-react";

import { createUser, updateUser } from "@/lib/actions/user.actions";
import Link from "next/link";

type UserFormType = "Create" | "Update";

const UserAdminForm = ({
  type,
  userId,
  user,
}: {
  type: UserFormType;
  userId?: string;
  user?: User;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(
      type === "Create" ? createUserSchema : updateUserSchema,
    ) as Resolver<z.infer<typeof createUserSchema>>,
    defaultValues: type === "Update" ? user : userCreateDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof createUserSchema>> = async (
    values,
  ) => {
    //on create
    if (type === "Create") {
      const res = await createUser(values as User);

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }

      router.push("/admin/users");
    }

    //on update
    if (type === "Update") {
      if (!userId) {
        router.push("/admin/users");
        return;
      }

      const res = await updateUser({
        ...values,
        id: userId,
        name:
          values.address?.fullName?.split(" ")[0] ??
          values.email?.split("@")[0] ??
          "user",
        email: values.email,
        role: values.role,
        // phoneNumber: values?.address?.phoneNumber ?? "",
        address: values.address,
      });

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
      }

      router.push("/admin/users");
    }
  };

  const image = form.watch("image");

  const onError = (errors: any) => {
    console.error("FORM ERRORS:", errors);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-9">
        <Link href="/admin/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </Link>
      </div>

      <form
        className="space-y-8"
        onSubmit={form.handleSubmit(onSubmit, onError)}
      >
        <FieldGroup>
          <div className="flex flex-col items-start md:flex-row gap-5">
            {/* full name */}
            <Controller
              name="address.fullName"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  CreateUserInput,
                  "address.fullName"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    placeholder="Enter full name"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* phone number */}
            <Controller
              name="address.phoneNumber"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  CreateUserInput,
                  "address.phoneNumber"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Phone Number</FieldLabel>
                  <Input
                    type="number"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter user phone number"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* email address ===> disabled */}
            <Controller
              name="email"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<CreateUserInput, "email">;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input
                    {...field}
                    aria-invalid={fieldState.invalid}
                    disabled={type === "Update"}
                    placeholder="Enter email address"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {type === "Create" && (
            <div className="flex flex-col items-start md:flex-row gap-5">
              {/* password */}
              <Controller
                name="password"
                control={form.control}
                render={({
                  field,
                  fieldState,
                }: {
                  field: ControllerRenderProps<CreateUserInput, "password">;
                  fieldState: ControllerFieldState;
                }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      placeholder="Enter password"
                      type="password"
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* confirm password */}
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({
                  field,
                  fieldState,
                }: {
                  field: ControllerRenderProps<
                    CreateUserInput,
                    "confirmPassword"
                  >;
                  fieldState: ControllerFieldState;
                }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Confirm Password</FieldLabel>
                    <Input
                      type="password"
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
          )}

          <div className="upload-field flex flex-col items-start md:flex-row gap-5">
            {/* user role */}
            <Controller
              name="role"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<CreateUserInput, "role">;
                fieldState: ControllerFieldState;
              }) => (
                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      id="form-rhf-select-language"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            {/* image */}
            <Controller
              control={form.control}
              name="image"
              render={({ field }) => (
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle className="text-md">User Image</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 mt-2">
                    <div className="flex-start space-x-2">
                      {field.value && (
                        <Image
                          src={field.value}
                          alt="user-image"
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={100}
                          height={100}
                        />
                      )}

                      <Field>
                        <UploadButton
                          endpoint="imageUploader"
                          onClientUploadComplete={(res: { url: string }[]) => {
                            field.onChange(res[0].url);
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* street address */}
            <Controller
              name="address.streetAddress"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  CreateUserInput,
                  "address.streetAddress"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Address </FieldLabel>
                  <Input
                    placeholder="Enter address"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* city */}
            <Controller
              name="address.city"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<CreateUserInput, "address.city">;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>City</FieldLabel>
                  <Input
                    placeholder="Enter city"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* postal code */}
            <Controller
              name="address.postalCode"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  CreateUserInput,
                  "address.postalCode"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Postal Code</FieldLabel>
                  <Input
                    placeholder="Enter postal code"
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* country */}
            <Controller
              name="address.country"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  CreateUserInput,
                  "address.country"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Country</FieldLabel>
                  <Input
                    placeholder="Enter country"
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

          <div>
            {/* submit */}
            <Button
              type="submit"
              className="cursor-pointer"
              disabled={form.formState.isSubmitting}
            >
              <span className="flex items-center gap-2">
                {form.formState.isSubmitting ? "Submitting..." : `${type} User`}
              </span>
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
};

export default UserAdminForm;

"use client";

import { shippingAddressDefaultValues } from "@/lib/constants";
import { shippingAddressSchema } from "@/lib/validator";
import { ShippingAddress } from "@/types";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { updateUserAddress } from "@/lib/actions/user.actions";
import { Spinner } from "@/components/ui/spinner";

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values,
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if (!res.success) {
        toast.error(res.message);

        return;
      }

      router.push("/payment-method");
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="h2-bold mt-4">Shipping Address</h1>
      <p className="text-sm text-muted-foreground">
        Please enter an address to ship to
      </p>
      <form
        method="post"
        className="space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <div className="flex flex-col md:flex-row gap-5 ">
            <Controller
              name="fullName"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "fullName"
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
          </div>

          <div className="flex flex-col md:flex-row gap-5 ">
            <Controller
              name="streetAddress"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "streetAddress"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Address</FieldLabel>
                  <Input
                    placeholder="Enter Address"
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

          <div className="flex flex-col md:flex-row gap-5 ">
            <Controller
              name="city"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "city"
                >;
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
          </div>

          <div className="flex flex-col md:flex-row gap-5 ">
            <Controller
              name="postalCode"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "postalCode"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Postal Code</FieldLabel>
                  <Input
                    placeholder="Enter Postal Code"
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

          <div className="flex flex-col md:flex-row gap-5 ">
            <Controller
              name="country"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  "country"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Country</FieldLabel>
                  <Input
                    placeholder="Enter Country"
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
        </FieldGroup>

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Spinner className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}{" "}
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ShippingAddressForm;

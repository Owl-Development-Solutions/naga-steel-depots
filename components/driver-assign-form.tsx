"use client";

import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import z from "zod";
import { insertDeliveryDriver } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { assignDriverAndUpdateOrder } from "@/lib/actions/delivery.actions";

const AssignDeliveryDriver = ({
  driver,
  orderId,
}: {
  orderId: string;
  driver: any[];
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof insertDeliveryDriver>>({
    resolver: zodResolver(insertDeliveryDriver),
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof insertDeliveryDriver>> = async (
    values,
  ) => {
    console.log(values);
    startTransition(async () => {
      const res = await assignDriverAndUpdateOrder(orderId, values.driver);

      if (!res.success) {
        toast.error(res.message);

        return;
      }

      router.push("/staff/orders");
    });
  };

  const onError = (errors: any) => {
    console.error("FORM ERRORS:", errors);
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <FieldGroup>
          <div className="flex flex-col md:flex-row gap-5 ">
            <Controller
              name="driver"
              control={form.control}
              render={({
                field,
                fieldState,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertDeliveryDriver>,
                  "driver"
                >;
                fieldState: ControllerFieldState;
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-bold">
                    Assign a Delivery Driver
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      aria-invalid={fieldState.invalid}
                      id="form-rhf-select-language"
                    >
                      <SelectValue placeholder="Please select a delivery driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {driver.map((rider) => (
                        <SelectItem key={rider?.id} value={rider?.id}>
                          {rider?.address?.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div>
            {/* submit */}
            <Button className="cursor-pointer" disabled={isPending}>
              <span className="flex items-center gap-2">
                {isPending ? "Submitting..." : `Submit`}
              </span>
            </Button>
          </div>
        </FieldGroup>
      </form>
    </>
  );
};

export default AssignDeliveryDriver;

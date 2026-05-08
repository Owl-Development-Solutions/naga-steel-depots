"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/actions/user.actions";
import { resetPasswordSchema } from "@/lib/validator";
import { ResetPasswordInput } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const ResetFormPassword = ({ token }: { token: string }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      confirmPassword: "",
      password: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    startTransition(async () => {
      const { password } = values;
      const res = await resetPassword({
        token,
        password,
      });

      if (!res.message) {
        toast.error(res.message);
        return;
      }

      router.push("/sign-in");
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
      <FieldGroup>
        {/* password */}
        <Controller
          name="password"
          control={form.control}
          render={({
            field,
            fieldState,
          }: {
            field: ControllerRenderProps<ResetPasswordInput, "password">;
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
            field: ControllerRenderProps<ResetPasswordInput, "confirmPassword">;
            fieldState: ControllerFieldState;
          }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input
                placeholder="Confirm password"
                type="password"
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div>
          {/* submit */}
          <Button
            type="submit"
            className="cursor-pointer w-full"
            disabled={isPending}
          >
            <span className="flex items-center gap-2">
              {isPending ? "Resetting..." : `Submit`}
            </span>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default ResetFormPassword;

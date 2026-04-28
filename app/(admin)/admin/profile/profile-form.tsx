"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { updateUserProfile } from "@/lib/actions/user.actions";
import { updateProfileSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ProfileFormPage = () => {
  const router = useRouter();
  const { data: session, update } = useSession();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onChange",
    defaultValues: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    const res = await updateUserProfile(values);

    if (!res.success) {
      return toast.error(res.message);
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
      },
    };

    await update(newSession);

    toast.success(res.message);

    router.refresh();
  };

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-5">
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({
              field,
              fieldState,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateProfileSchema>,
                "email"
              >;
              fieldState: ControllerFieldState;
            }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email</FieldLabel>
                <Input
                  placeholder="Email"
                  {...field}
                  disabled
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="name"
            control={form.control}
            render={({
              field,
              fieldState,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateProfileSchema>,
                "name"
              >;
              fieldState: ControllerFieldState;
            }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Name</FieldLabel>
                <Input
                  placeholder="Name"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </div>

      <Button
        type="submit"
        size="lg"
        className="button col-span-2 w-full cursor-pointer"
        disabled={
          form.formState.isSubmitting ||
          !form.formState.isDirty ||
          !form.formState.isValid
        }
      >
        {form.formState.isSubmitting ? "Submitting..." : "Update Profile"}
      </Button>
    </form>
  );
};

export default ProfileFormPage;

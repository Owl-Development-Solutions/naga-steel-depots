"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { signInAdminWithCredentials } from "@/lib/actions/user.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const AdminSignInForm = () => {
  const [data, action] = useActionState(signInAdminWithCredentials, {
    success: false,
    message: "",
  });

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} className="w-full" variant="default">
        {pending ? <Spinner /> : "Sign In"}
      </Button>
    );
  };

  return (
    <form action={action} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-900 transition-colors"
        />
      </div>

      {data && !data.success && (
        <p className="text-center text-destructive">{data.message}</p>
      )}

      <div>
        <SignInButton />
      </div>
    </form>
  );
};

export default AdminSignInForm;

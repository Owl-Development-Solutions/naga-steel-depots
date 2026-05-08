"use client";

import { Button } from "@/components/ui/button";
import { clickForgotPassword } from "@/lib/actions/user.actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const CredentialsForForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const res = await clickForgotPassword(email);

    if (!res.success) {
      setError("Failed to send reset email");
    } else {
      setMessage(res.message);
      setEmail("");

      toast.success("We've sent a password reset link to your email.");
      router.push("/sign-in");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="you@example.com"
          />
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full ">
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>

        <div className="text-sm text-center text-muted-foreground">
          Back to login?{" "}
          <Link
            href="sign-in"
            target="_self"
            className="link hover:underline hover:text-[#10456D]"
          >
            Click here
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsForForgotPassword;

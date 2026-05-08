import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import ResetFormPassword from "./form-reset-password";

const ResetPasswordPage = async (props: {
  searchParams: Promise<{
    token: string;
  }>;
}) => {
  const { token } = await props.searchParams;

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/products" className="flex-center">
            <Image
              src="/images/naga-steel-depot.png"
              width={200}
              height={100}
              alt={`${APP_NAME} logo`}
              priority={true}
            />
          </Link>

          <CardTitle className="text-center">Reset your password</CardTitle>
          {/* <CardDescription className="text-center">
            Sign in to your account
          </CardDescription> */}
        </CardHeader>
        <CardContent className="space-y-4">
          <ResetFormPassword token={token} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;

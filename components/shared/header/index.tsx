import { APP_NAME } from "@/lib/constants";

import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";
import { auth } from "@/auth";

const Header = async () => {
  const session = await auth();

  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/images/naga-steel-depot.png"
              alt={`${APP_NAME} logo`}
              width={300}
              height={300}
              sizes="(max-width: 640px) 120px, (max-width: 1024px) 200px, 300px"
              style={{ width: "100%", height: "auto" }}
              priority
            />
          </Link>
        </div>
        <div className="space-x-2">
          <Menu session={session} />
        </div>
      </div>
    </header>
  );
};

export default Header;

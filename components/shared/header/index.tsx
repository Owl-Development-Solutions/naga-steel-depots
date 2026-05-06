import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Menu from "./menu";
import { Session } from "next-auth";
import CategoryDrawer from "./category-drawer";
import { convertToPlainObject } from "@/lib/utils";
import Search from "./search";

const Header = ({
  session,
  categories,
}: {
  session: Session;
  categories: any;
}) => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <CategoryDrawer categories={convertToPlainObject(categories)} />
          <Link href="/" className="flex-start ml-4">
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
        <div className="hidden md:block">
          <Search categories={convertToPlainObject(categories)} />
        </div>

        <Menu session={session} />
      </div>
    </header>
  );
};

export default Header;

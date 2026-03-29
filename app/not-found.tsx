import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
  const getYear = new Date().getFullYear();
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center h-[20vh] min-h-37.5 p-8">
        <Image
          src="/images/naga-steel-depot.png"
          alt={`${APP_NAME} logo`}
          width={700}
          height={300}
          priority
        />
      </div>
      <div className="flex flex-col justify-center items-center grow bg-gray-200 dark:bg-[#0E4466] gap-6 p-8">
        <Image
          src="/images/not-found.svg"
          alt={`${APP_NAME} logo`}
          width={100}
          height={100}
          priority
        />
        <h3 className="text-4xl font-bold">We’re sorry!</h3>
        <div>
          The page you’re looking for doesn’t exist. Please go back to the{" "}
          <span className="underline cursor-pointer">
            <Link href="/">homepage.</Link>
          </span>
        </div>
      </div>
      <div className="p-8 flex justify-center">
        <p className="text-center">
          <span>Naga Steel Depots</span> Copyright {getYear}
        </p>
      </div>
    </div>
  );
};

export default NotFound;

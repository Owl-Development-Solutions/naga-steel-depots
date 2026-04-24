import { auth } from "@/auth";
import Footer from "@/components/footer";
import Header from "@/components/shared/header";
import { getAllCategories } from "@/lib/actions/product.actions";
import { Session } from "next-auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const categories = await getAllCategories();
  return (
    <div className="flex h-screen flex-col">
      <Header session={session as Session} categories={categories} />
      <main className="flex-1 wrapper">{children}</main>
      <Footer />
    </div>
  );
}

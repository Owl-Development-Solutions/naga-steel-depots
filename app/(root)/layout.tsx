import Footer from "@/components/footer";
import Header from "@/components/shared/header";

export const metadata = {
  title: " Your Trusted Steel Supplier",
  description:
    "High-quality steel products for construction, fabrication, and industrial needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <main>{children}</main>
    </div>
  );
}

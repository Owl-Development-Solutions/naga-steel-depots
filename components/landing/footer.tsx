"use client";

import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";

const footerLinks = {
  products: [
    { label: "Steel Beams", href: "#products" },
    { label: "Rebar & Mesh", href: "#products" },
    { label: "Steel Plates", href: "#products" },
    { label: "Tubing & Pipes", href: "#products" },
  ],
  company: [
    { label: "About Us", href: "#about" },
    { label: "Careers", href: "#careers" },
    { label: "News", href: "#news" },
    { label: "Contact", href: "#contact" },
  ],
  resources: [
    { label: "Documentation", href: "#docs" },
    { label: "Specifications", href: "#specs" },
    { label: "FAQ", href: "#faq" },
    { label: "Support", href: "#support" },
  ],
};

const scrollToSection = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
) => {
  e.preventDefault();
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};
const FooterLandingPage = () => {
  return (
    <footer
      id="contact"
      className="bg-gray-100 dark:bg-[#0d1117] border-t border-gray-200 dark:border-[#30363d]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/images/naga-steel-depot.png"
                alt={`${APP_NAME} logo`}
                width={300}
                height={300}
                style={{ width: "auto", height: "auto" }}
                priority
                className="w-8 h-8 rounded  flex items-center justify-center"
              />
            </div>
            <p className="text-gray-600 dark:text-[#8b949e] mb-6 max-w-sm">
              Your trusted partner for high-quality steel products. Serving
              industries with reliable materials and exceptional service since
              2000.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <FaFacebook className="w-10 h-10  flex items-center justify-center text-gray-600   hover:border-[#EAC04D]/50 transition-all duration-200" />
              <FaInstagram className="w-10 h-10  flex items-center justify-center text-gray-600   hover:border-[#EAC04D]/50 transition-all duration-200" />
              <FaYoutube className="w-10 h-10  flex items-center justify-center text-gray-600   hover:border-[#EAC04D]/50 transition-all duration-200" />
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-4">
              Products
            </h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-[#8b949e]  transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className=" text-[#8b949e]  transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-semibold mb-4">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-[#8b949e]  transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-[#30363d]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-[#8b949e] text-sm">
              &copy; {new Date().getFullYear()} Naga Steel Depot. All rights
              reserved.
            </p>
            <div className="flex space-x-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-gray-600 dark:text-[#8b949e]  transition-colors duration-200 text-sm"
                  >
                    {item}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterLandingPage;

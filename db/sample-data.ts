import { hashSync } from "bcrypt-ts-edge";

const sampleData = {
  users: [
    {
      name: "John",
      email: "admin@example.com",
      password: hashSync("123456", 10),
      role: "admin",
    },
    {
      name: "Jane",
      email: "user@example.com",
      password: hashSync("123456", 10),
      role: "user",
    },
    {
      name: "Staff",
      email: "staff@example.com",
      password: hashSync("123456", 10),
      role: "staff",
    },
  ],
  // products: [
  //   {
  //     name: "Alloy Steel Plate",
  //     slug: "alloy-steel-plate",
  //     category: "Carbon Steel",
  //     description:
  //       "High-strength 15CrMo alloy steel plate with excellent heat resistance and durability. Ideal for high-temperature applications in power plants, petrochemical equipment, and pressure vessels.",
  //     images: [
  //       "/nsd/carbon-steel/15crMo-alloy-steel-plate-1.webp",
  //       "/nsd/carbon-steel/15crMo-alloy-steel-plate-2.webp",
  //     ],
  //     price: 59.99,
  //     brand: "",
  //     rating: 4.5,
  //     numReviews: 10,
  //     stock: 0,
  //     isFeatured: true,
  //     banner: "banner-1.jpg",
  //   },
  //   {
  //     name: "Carbon Steel Pipe Q195",
  //     slug: "carbon-steel-pipe-q195",
  //     category: "Carbon Steel",
  //     description:
  //       "Q195 grade carbon steel pipe with superior weldability and formability. Perfect for structural applications, fluid transportation, and general engineering purposes.",
  //     images: [
  //       "/nsd/carbon-steel/carbon-steel-pipe-q195-1.webp",
  //       "/nsd/carbon-steel/carbon-steel-pipe-q195-2.webp",
  //       "/nsd/carbon-steel/carbon-steel-pipe-q195-3.webp",
  //     ],
  //     price: 45.99,
  //     brand: "",
  //     rating: 4.3,
  //     numReviews: 8,
  //     stock: 10,
  //     isFeatured: false,
  //     banner: "",
  //   },
  //   {
  //     name: "Carbon Steel Plate A36",
  //     slug: "carbon-steel-plate-a36",
  //     category: "Carbon Steel",
  //     description:
  //       "ASTM A36 carbon steel plate offering excellent strength and machinability. Widely used in construction, bridges, buildings, and general fabrication projects.",
  //     images: [
  //       "/nsd/carbon-steel/carbon-steel-plate-a36-1235-1.webp",
  //       "/nsd/carbon-steel/carbon-steel-plate-a36-1235-2.webp",
  //     ],
  //     price: 52.99,
  //     brand: "",
  //     rating: 4.6,
  //     numReviews: 12,
  //     stock: 8,
  //     isFeatured: true,
  //     banner: "banner-2.jpg",
  //   },
  //   {
  //     name: "Grade 40 Carbon Steel Rebar",
  //     slug: "grade-40-carbon-steel-rebar",
  //     category: "Carbon Steel",
  //     description:
  //       "Grade 40 deformed steel rebar providing superior bonding with concrete. Essential for reinforced concrete structures, foundations, and infrastructure projects.",
  //     images: [
  //       "/nsd/carbon-steel/grade-40-carbon-steel-rebar-1.webp",
  //       "/nsd/carbon-steel/grade-40-carbon-steel-rebar-2.webp",
  //     ],
  //     price: 38.99,
  //     brand: "",
  //     rating: 4.4,
  //     numReviews: 6,
  //     stock: 15,
  //     isFeatured: false,
  //     banner: "",
  //   },
  //   {
  //     name: "SPCD Carbon Steel Plate",
  //     slug: "spcd-carbon-steel-plate",
  //     category: "Carbon Steel",
  //     description:
  //       "JIS G3141 SPCD cold-rolled steel plate with exceptional formability and surface finish. Ideal for automotive parts, appliances, and precision stamping applications.",
  //     images: [
  //       "/nsd/carbon-steel/SPCD-carbon-steel-plate-1.webp",
  //       "/nsd/carbon-steel/SPCD-carbon-steel-plate-2.webp",
  //     ],
  //     price: 48.99,
  //     brand: "",
  //     rating: 4.2,
  //     numReviews: 5,
  //     stock: 12,
  //     isFeatured: false,
  //     banner: "",
  //   },
  //   {
  //     name: "Stainless Steel Plate 304",
  //     slug: "stainless-steel-plate-304",
  //     category: "Stainless Steel",
  //     description:
  //       "Premium 304 austenitic stainless steel plate with outstanding corrosion resistance and versatility. The industry standard for food processing, kitchen equipment, and architectural applications.",
  //     images: [
  //       "/nsd/stainless-steel/stainless-steel-plate-304-1.webp",
  //       "/nsd/stainless-steel/stainless-steel-plate-304-2.webp",
  //     ],
  //     price: 89.99,
  //     brand: "",
  //     rating: 4.8,
  //     numReviews: 15,
  //     stock: 6,
  //     isFeatured: true,
  //     banner: "banner-3.jpg",
  //   },
  //   {
  //     name: "Stainless Steel Plate 309S",
  //     slug: "stainless-steel-plate-309s",
  //     category: "Stainless Steel",
  //     description:
  //       "309S stainless steel plate with superior heat resistance up to 1150°C. Designed for high-temperature industrial applications including furnaces, heat exchangers, and combustion equipment.",
  //     images: [
  //       "/nsd/stainless-steel/stainless-steel-plate-309s-1.webp",
  //       "/nsd/stainless-steel/stainless-steel-plate-309s-2.webp",
  //     ],
  //     price: 95.99,
  //     brand: "",
  //     rating: 4.7,
  //     numReviews: 9,
  //     stock: 4,
  //     isFeatured: false,
  //     banner: "",
  //   },
  //   {
  //     name: "Stainless Steel Wire 310S",
  //     slug: "stainless-steel-wire-310s",
  //     category: "Stainless Wire",
  //     description:
  //       "310S stainless steel wire with excellent oxidation resistance at elevated temperatures. Suitable for wire mesh, springs, and high-temperature industrial applications.",
  //     images: [
  //       "/nsd/stainless-wire/stainless-steel-wire-310s-1.webp",
  //       "/nsd/stainless-wire/stainless-steel-wire-310s-2.webp",
  //     ],
  //     price: 72.99,
  //     brand: "",
  //     rating: 4.5,
  //     numReviews: 7,
  //     stock: 20,
  //     isFeatured: false,
  //     banner: "",
  //   },
  //   {
  //     name: "Stainless Wire 2520",
  //     slug: "stainless-wire-2520",
  //     category: "Stainless Wire",
  //     description:
  //       "2520 (310S) stainless steel wire with exceptional heat and corrosion resistance. Perfect for extreme temperature environments, welding wire, and specialized industrial applications.",
  //     images: [
  //       "/nsd/stainless-wire/stainless-wire-2520-1.webp",
  //       "/nsd/stainless-wire/stainless-wire-2520-2.webp",
  //     ],
  //     price: 78.99,
  //     brand: "",
  //     rating: 4.6,
  //     numReviews: 11,
  //     stock: 18,
  //     isFeatured: true,
  //     banner: "banner-4.jpg",
  //   },
  // ],
};

export default sampleData;

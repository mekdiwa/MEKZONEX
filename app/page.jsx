import { prisma } from "@/lib/prisma";
import SiteShell from "@/components/SiteShell";
import Hero from "@/components/Hero";
import QuickActions from "@/components/QuickActions";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ recommended: "desc" }, { createdAt: "desc" }],
    take: 6,
  });
  return (
    <SiteShell>
      <Hero />
      <QuickActions />
      <ProductGrid products={JSON.parse(JSON.stringify(products))} />
      <Footer />
    </SiteShell>
  );
}

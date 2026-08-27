const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

const products = [
  { name: "Real Executor", price: 149, oldPrice: null, stock: 25, recommended: true, image: "https://placehold.co/600x600/160b26/e5e7eb?text=REAL+EXECUTOR" },
  { name: "SynapseZ", price: 179, oldPrice: 329, stock: 33, recommended: true, image: "https://placehold.co/600x600/0f0a18/8b5cf6?text=SYNAPSEZ" },
  { name: "Mek Executor", price: 199, oldPrice: 649, stock: 19, recommended: true, image: "https://placehold.co/600x600/160b26/8b5cf6?text=MEK+EXECUTOR" },
  { name: "Mek Farmer 7 Days", price: 279, oldPrice: 429, stock: 47, recommended: true, image: "https://placehold.co/600x600/1a0f2b/8b5cf6?text=MEK+FARMER" },
  { name: "Nitrus Lifetime", price: 699, oldPrice: 799, stock: 9, recommended: true, image: "https://placehold.co/600x600/140b1f/8b5cf6?text=NITRUS" },
  { name: "Pro-VPS 7 Days", price: 69, oldPrice: 99, stock: 49, recommended: true, image: "https://placehold.co/600x600/241a10/d4a017?text=PRO-VPS" },
];

async function main() {
  const hash = await bcrypt.hash("admin1234", 10);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: { username: "admin", password: hash, role: "ADMIN" },
  });
  await prisma.product.createMany({ data: products.map(p => ({ ...p, description: "โปรดอ่านรายละเอียดให้ชัดเจนก่อนสั่งซื้อทุกครั้ง" })) });
  console.log("✅ Seed เสร็จสิ้น → admin / admin1234");
}
main().finally(() => prisma.$disconnect());

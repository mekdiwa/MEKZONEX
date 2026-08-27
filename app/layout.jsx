import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata = {
  title: "MEKZONE | เว็บเติมเกม & สั่งซื้อสินค้าเกมเมอร์ ครบจบในที่เดียว",
  description: "MEKZONE — ศูนย์รวมเติมเงินเกม สั่งซื้อสินค้า บัญชีเกม และอุปกรณ์เสริม บริการรวดเร็ว ปลอดภัย 24 ชั่วโมง",
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className={`${kanit.variable} font-sans bg-night text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}

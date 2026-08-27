import { NextResponse } from "next/server";
import promptpay from "promptpay-qr";
import QRCode from "qrcode";

export async function GET(req) {
  const amount = Number(new URL(req.url).searchParams.get("amount")) || 0;
  const payload = promptpay(process.env.PROMPTPAY_ID || "0000000000", { amount });
  const qr = await QRCode.toDataURL(payload, { width: 320, margin: 1, color: { dark: "#0A0710", light: "#FFFFFF" } });
  return NextResponse.json({ qr });
}

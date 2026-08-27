"use client";
import { useState } from "react";
import Header from "./Header";
import SideDrawer from "./SideDrawer";

export default function SiteShell({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <Header onOpenMenu={() => setOpen(true)} />
      <SideDrawer open={open} onClose={() => setOpen(false)} />
      <main className="pb-4">{children}</main>
    </div>
  );
}

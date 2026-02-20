"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const HIDE_NAV = ["/login", "/signup", "/dashboard"];

export default function ConditionalNav() {
    const pathname = usePathname();
    const hide = HIDE_NAV.some((path) => pathname?.startsWith(path));
    if (hide) return null;
    return <Navbar />;
}

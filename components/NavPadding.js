"use client";
import { usePathname } from "next/navigation";

const NO_PAD = ["/login", "/signup", "/dashboard"];

export default function NavPadding({ children }) {
    const pathname = usePathname();
    const noPad = NO_PAD.some((p) => pathname?.startsWith(p));
    return (
        <main className={noPad ? "" : "pt-16"}>
            {children}
        </main>
    );
}

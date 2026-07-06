"use client";

import { FaucetIcon } from "@/icons/FaucetIcon";
import { MarketplaceIcon } from "@/icons/MarketplaceIcon";
import { UserIcon } from "@/icons/UserIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { Logo } from "./Logo";
import { useEffect } from "react";
import image from "../../assets/mobile-menu_poster.png";
import Image from "next/image";
import { BackgroundGlow } from "./BackgroundGlow";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const Sidebar = ({ isOpen, onClose }: Props) => {
  const pathname = usePathname();
  const menuItems = [
    { name: "Marketplace", href: "/", icon: MarketplaceIcon },
    { name: "Faucet", href: "/faucet", icon: FaucetIcon },
    { name: "User", href: "/user", icon: UserIcon },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <aside
      className={
        "top-0 left-0 min-h-screen p-4 w-fit xl:flex flex-col gap-6 border-r border-muted/25 " +
        (isOpen
          ? "absolute z-50 bg-background w-full flex"
          : "hidden xl:flex relative")
      }
    >
      {isOpen && <BackgroundGlow />}
      <div className="flex items-center justify-between">
        <Logo />
        {isOpen && (
          <button
            onClick={onClose}
            className="xl:hidden text-muted py-1 px-2.5 border border-muted/25"
          >
            ✕
          </button>
        )}
      </div>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={onClose}
                className={
                  "text-xl rounded-xl py-3 px-6 font-bold flex items-center gap-2 " +
                  (item.href === pathname
                    ? "text-primarylight bg-primary/20"
                    : "text-muted")
                }
              >
                {item.icon()}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <ConnectWalletButton />

      <Image
        src={image}
        alt="poster"
        loading="eager"
        className="h-80 w-fit aspect-square md:object-cover md:object-top md:w-full"
      />
    </aside>
  );
};

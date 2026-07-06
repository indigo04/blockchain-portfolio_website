"use client";

import { MenuIcon } from "@/icons/MenuIcon";
import { Logo } from "./Logo";

type Props = {
  handleSidebarOpen: () => void;
};

export const Header = ({ handleSidebarOpen }: Props) => {
  return (
    <header className="flex xl:hidden items-center border-b border-muted/25 justify-between p-3">
      <Logo />
      <span className="text-text cursor-pointer" onClick={handleSidebarOpen}>
        <MenuIcon />
      </span>
    </header>
  );
};

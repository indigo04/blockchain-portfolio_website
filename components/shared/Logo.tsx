import { HeartIcon } from "@/icons/HeartIcon";

export const Logo = () => {
  return (
    <div className="flex items-center xl:py-3 xl:px-6 gap-2 text-primary">
      <HeartIcon />
      <span className="text-xl font-bold">WhatIsLove</span>
    </div>
  );
};

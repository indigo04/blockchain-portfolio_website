import { ButtonHTMLAttributes } from "react";

type Props = {
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const PrimaryButton = ({ children }: Props) => {
  return (
    <button className="py-3 px-6 w-full rounded-xl cursor-pointer bg-primary hover:bg-primarylight duration-300">
      {children}
    </button>
  );
};

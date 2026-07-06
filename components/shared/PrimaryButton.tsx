import { ButtonHTMLAttributes } from "react";

type Props = {
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const PrimaryButton = ({ children, ...props }: Props) => {
  return (
    <button
      {...props}
      className={
        "py-3 px-6 w-full rounded-xl  duration-300 " +
        (props.disabled
          ? "cursor-not-allowed bg-muted/25"
          : "cursor-pointer bg-primary hover:bg-primarylight")
      }
    >
      {children}
    </button>
  );
};

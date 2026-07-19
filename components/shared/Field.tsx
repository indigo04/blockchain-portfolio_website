import { InputHTMLAttributes } from "react";

type Props = {
  label?: string;
  description?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Field = ({ label, description, ...props }: Props) => {
  return (
    <div className="flex flex-col w-full gap-2.5">
      {label && (
        <label
          htmlFor={props.id}
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-200"
        >
          {label}
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span>
        </label>
      )}
      <input
        {...props}
        className="w-full px-5 py-4 bg-surface border border-muted/25 rounded-xl text-white placeholder-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base"
        required
      />
      {description && (
        <span className="text-xs text-muted mt-0.5 tracking-wide">
          {description}
        </span>
      )}
    </div>
  );
};

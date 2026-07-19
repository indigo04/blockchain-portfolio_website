"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  paramName: string;
  options: Option[];
}

export default function Dropdown({ paramName, options }: DropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentValue = searchParams.get(paramName) || "";

  const selectedOption =
    options.find((opt) => opt.value === currentValue) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(paramName, value);
    } else {
      params.delete(paramName);
    }

    if (params.has("page")) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-xs text-base">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex cursor-pointer items-center justify-between w-full px-5 py-4 bg-surface border rounded-xl text-white outline-none transition-all text-left ${
          isOpen
            ? "border-primary ring-1 ring-primary"
            : "border-muted/25 hover:border-muted/50"
        }`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : "Choose option"}
        </span>

        <svg
          className={`w-5 h-5 text-muted transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute z-50 w-full mt-2 bg-surface border border-muted/25 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
          {options.map((option) => {
            const isSelected = option.value === currentValue;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full cursor-pointer px-5 py-3.5 text-left text-sm transition-colors duration-150 hover:bg-muted/10 ${
                    isSelected
                      ? "text-primary font-medium bg-primary/5"
                      : "text-white"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

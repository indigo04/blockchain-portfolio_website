"use client";

import { InfoBlock } from "@/components/shared/InfoBlock";
import { CloudIcon } from "@/icons/CloudIcon";
import { CodeIcon } from "@/icons/CodeIcon";
import { ReloadIcon } from "@/icons/ReloadIcon";
import { WarningIcon } from "@/icons/WarningIcon";
import Image from "next/image";
import { useEffect } from "react";
import image from "../assets/connection.png";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const infoBlocks = [
    {
      title: "Subsquid Cloud",
      description:
        "This could be a temporary issue on our end. Please try again in a few moments.",
      icon: <CloudIcon />,
    },
    {
      title: "Reload the page",
      description: "Sometimes a simple refresh can fix the issue.",
      icon: <ReloadIcon />,
    },
    {
      title: "Run locally (Advanced)",
      description:
        "If you know what you`re doing, you can run the app locally.",
      icon: <CodeIcon />,
    },
  ];

  return (
    <div className="flex flex-col gap-4 md:py-5 xl:py-15">
      <div className="flex flex-col md:flex-row items-center gap-4 xl:gap-8">
        <div className="flex md:w-1/2 flex-col gap-4">
          <h1 className="text-2xl xl:text-5xl text-white">
            <strong className="text-primary flex gap-2 items-center">
              <WarningIcon /> Oops!
            </strong>
            Something went wrong!
          </h1>
          <p className="text-muted font-bold">
            It looks like Subsquid Cloud is currently unavailable or something
            went wrong.
          </p>
          <InfoBlock infoBlock={infoBlocks[0]} />
        </div>
        <Image
          src={image}
          alt="connection-img"
          width={300}
          height={300}
          className="w-full md:w-1/2"
        />
      </div>

      <h2 className="text-white text-xl xl:text-3xl font-bold">
        What you can do
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        <InfoBlock infoBlock={infoBlocks[1]} />
        <InfoBlock infoBlock={infoBlocks[2]} />
      </div>

      <button onClick={() => unstable_retry()}>Try again</button>
    </div>
  );
}

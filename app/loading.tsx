import Image from "next/image";
import coinImage from "../assets/faucet_poster.png";

export default function Loading() {
  return (
    <main className="fixed inset-0 z-9999 flex h-screen w-screen items-center justify-center bg-[#050009]">
      <div className="relative flex flex-col items-center justify-center gap-6">
        <div className="relative flex items-center justify-center h-40 w-40">
          <div className="absolute inset-0 rounded-full bg-purple-600/10 blur-xl animate-pulse" />

          <div
            className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-purple-500 border-l-purple-500/30"
            style={{ animationDuration: "2s" }}
          />

          <div className="relative z-10 p-4">
            <Image
              src={coinImage}
              alt="Loading Coin"
              width={140}
              height={140}
              priority
              className="h-auto w-auto"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 text-center font-bold">
          <h2 className="text-3xl tracking-tight text-primary flex items-baseline justify-center">
            Loading
            <span className="flex ml-1 text-purple-500">
              <span className="animate-pulse" style={{ animationDelay: "0ms" }}>
                .
              </span>
              <span
                className="animate-pulse"
                style={{ animationDelay: "200ms" }}
              >
                .
              </span>
              <span
                className="animate-pulse"
                style={{ animationDelay: "400ms" }}
              >
                .
              </span>
            </span>
          </h2>
          <p className="text-sm font-normal text-muted">Please wait</p>
        </div>
      </div>
    </main>
  );
}

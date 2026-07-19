export const MarketplaceHeader = () => {
  return (
    <header className="xl:p-10 rounded-xl p-5 bg-[url(/portal.png)] shadow-xs bg-center bg-cover shadow-primary bg-no-repeat ">
      <div className="flex flex-col xl:w-1/3 md:w-[45%] w-full gap-2 md:gap-4 items-start">
        <h1 className="text-3xl text-shadow-lg text-shadow-black font-bold text-white md:text-4xl">
          Discover. Collect. Own the
          <strong className="text-primary"> Unique.</strong>
        </h1>
        <p className="text-muted text-shadow-lg text-shadow-black text-xl">
          Explore and collect premium NFTs from creators worldwide.
        </p>
        <a
          href="#marketplace"
          className="py-3 px-6 w-full md:w-fit text-center rounded-xl text-white bg-primary font-bold text-xl"
        >
          Explore now
        </a>
      </div>
    </header>
  );
};

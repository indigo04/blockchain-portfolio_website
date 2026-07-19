import { JSX } from "react/jsx-runtime";

type Props = {
  statisticsBlock: {
    title: string;
    value: string;
    icon: JSX.Element;
  };
};

export const UserStatisticsBlock = ({ statisticsBlock }: Props) => {
  return (
    <div className="p-4 bg-surface w-full border-muted/25 border text-primary rounded-xl flex gap-2 justify-evenly items-center">
      <span className="border p-2 bg-primary/20 rounded-xl border-muted/25">
        {statisticsBlock.icon}
      </span>
      <div className="flex flex-col">
        <h3 className="text-muted text-xl">{statisticsBlock.title}</h3>
        <p className={"text-white text-3xl font-bold truncate max-w-40"}>
          {statisticsBlock.value}
        </p>
      </div>
    </div>
  );
};

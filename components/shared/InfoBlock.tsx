import { JSX } from "react/jsx-runtime";

type Props = {
  infoBlock: {
    title: string;
    description: string;
    icon: JSX.Element;
  };
};

export const InfoBlock = ({ infoBlock }: Props) => {
  return (
    <div className="p-4 w-full flex gap-2 md:gap-4 rounded-xl shadow-xs shadow-primary">
      <span className="p-4 h-fit text-primary rounded-xl border border-primary bg-primary/25">
        {infoBlock.icon}
      </span>
      <div className="flex flex-col">
        <h3 className="text-white text-xl font-bold">{infoBlock.title}</h3>
        <p className="text-muted">{infoBlock.description}</p>
      </div>
    </div>
  );
};

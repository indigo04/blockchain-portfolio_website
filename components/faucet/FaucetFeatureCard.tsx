import { JSX } from "react/jsx-runtime";

type Props = {
  card: {
    title: string;
    value: string;
    description: string;
    icon: JSX.Element;
  };
};

export const FaucetFeatureCard = ({ card }: Props) => {
  return (
    <div
      className="flex gap-4 w-full bg-surface p-4 rounded-xl border border-muted/25"
      key={card.title}
    >
      <span className="p-4 w-fit h-fit rounded-xl border-muted/25 text-primary bg-primary/20">
        {card.icon}
      </span>
      <div className="flex flex-col">
        <h3 className="text-primary">{card.title}</h3>
        <p className="text-text font-bold text-xl">{card.value}</p>
        <p className="text-muted">{card.description}</p>
      </div>
    </div>
  );
};

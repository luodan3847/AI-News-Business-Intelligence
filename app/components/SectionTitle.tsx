type Props = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function SectionTitle({ eyebrow, title, description }: Props) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-serif text-3xl tracking-tight text-stone-950 md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-stone-700">{description}</p>
    </div>
  );
}

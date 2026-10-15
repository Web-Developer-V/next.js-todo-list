interface Props {
  title: string;
  description?: React.ReactNode;
}

export default function SignTitle({ title, description }: Props) {
  return (
    <div className="mb-4 text-center">
      <h1 className="mb-2 font-bold text-3xl">{title}</h1>
      <p className="text-[16px] text-slate-600 wrap-break-word">{description}</p>
    </div>
  );
}

interface Props {
  title: string;
  content: string;
}

export default function TitleArea({ title, content }: Props) {
  return (
    <div className="mb-5">
      <h1 className="font-bold text-2xl mb-2">{title}</h1>
      <p className="text-sm font-medium text-slate-400">{content}</p>
    </div>
  );
}

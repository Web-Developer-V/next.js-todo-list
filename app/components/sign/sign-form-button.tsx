type Props = React.ComponentProps<"button">;

export default function SignFormButton({ children, ...props }: Props) {
  return (
    <button className="w-full h-10 mt-3 bg-primary rounded-md text-white cursor-pointer transition-colors hover:bg-[#4573e9] disabled:hover:bg-primary disabled:cursor-auto" {...props}>
      {children}
    </button>
  );
}

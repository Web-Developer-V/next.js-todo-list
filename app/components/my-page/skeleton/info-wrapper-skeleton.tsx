interface InfoWrapperSkeletonProps {
  className?: string;
}

export default function InfoWrapperSkeleton({
  className = "w-24",
}: InfoWrapperSkeletonProps) {
  return (
    <div
      className={`h-4 ${className} animate-pulse rounded bg-slate-200`}
      aria-hidden="true"
    />
  );
}

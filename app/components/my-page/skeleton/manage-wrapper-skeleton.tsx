export default function ManageWrapperSkeleton() {
  return (
    <div className="flex flex-col gap-y-2" aria-hidden="true">
      <div className="flex items-center justify-between w-full h-9 p-2 border border-gray-100 rounded-sm">
        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="flex items-center justify-between w-full h-9 p-2 border border-gray-100 rounded-sm">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}

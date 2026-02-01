export default function Skeleton({ type = 'text', count = 1, className = '' }) {
  const skeletons = {
    text: 'h-4 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer',
    title: 'h-6 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer',
    avatar: 'w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-shimmer',
    card: 'h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-shimmer',
    button: 'h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-shimmer'
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`${skeletons[type]} ${className}`}></div>
      ))}
    </>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start gap-4">
        <Skeleton type="avatar" />
        <div className="flex-1 space-y-3">
          <Skeleton type="text" className="w-1/4" />
          <Skeleton type="title" className="w-3/4" />
          <Skeleton type="text" count={2} className="w-full mb-2" />
          <div className="flex gap-2">
            <Skeleton type="button" className="w-16" />
            <Skeleton type="button" className="w-16" />
            <Skeleton type="button" className="w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
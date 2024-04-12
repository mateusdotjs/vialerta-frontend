const StatusSkeleton = () => {
  return (
    <div className="animate-slide px-2 flex flex-col items-center">
      <div className="mb-5 h-6 w-52 animate-pulse rounded-sm bg-gray-300"></div>
      <div className="mb-3 h-6 w-96 animate-pulse rounded-sm bg-gray-300"></div>
      <div className="mb-10 h-6 w-80 animate-pulse rounded-sm bg-gray-300"></div>
      <div className="mb-3 h-6 w-52 animate-pulse rounded-sm bg-gray-300"></div>
      <div className="h-6 w-52 animate-pulse rounded-sm bg-gray-300"></div>
    </div>
  );
};

export default StatusSkeleton;

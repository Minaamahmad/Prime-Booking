const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-600">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600"></div>
      <p className="mt-4 text-sm font-bold">{message}</p>
    </div>
  );
};

export default Loading;

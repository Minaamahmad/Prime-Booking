const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-slate-300">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-primary-teal"></div>
      <p className="mt-4 text-sm">{message}</p>
    </div>
  );
};

export default Loading;

export default function SearchSkeleton() {
  return (
    <div className="space-y-12">
      {/* Total result skeleton */}
      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
      </div>

      {/* Grid skeleton - lặp 3 section */}
      {[1, 2, 3].map((section) => (
        <div key={section} className="space-y-4">
          {/* Heading skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-64 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-sm"
              >
                <div className="h-48 bg-slate-200 dark:bg-slate-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
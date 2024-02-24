import { getSearch } from "@/lib/search-service";
import { Skeleton } from "@/components/ui/skeleton";

import { ResultCard, ResultCardSkeleton } from "./result-card";

interface ResultsProps {
  term?: string;
}

export const Results = async ({ term }: ResultsProps) => {
  const { users, streams } = await getSearch(term);

  const userMap = users?.reduce((map:any, user:any) => {
    map[user?._id] = user;
    return map;
  }, {});
  

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Results for term &quot;{term}&quot;
      </h2>
      {streams?.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No results found. Try searching for something else
        </p>
      )}
      <div className="flex flex-col gap-y-4">
        {streams?.map((result) => (
          <ResultCard
            key={result?._id}
            stream={result}
            user={userMap[result?.userId]}
          />
        ))}
      </div>
    </div>
  );
};

export const ResultsSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-8 w-[290px] mb-4" />
      <div className="flex flex-col gap-y-4">
        {[...Array(4)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

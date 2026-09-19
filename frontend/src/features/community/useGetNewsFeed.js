import { useInfiniteQuery } from "@tanstack/react-query";
import { getRecommendation } from "../../services/postApi";
import { useInView } from "react-intersection-observer";

export const useGetNewsFeed = () => {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isError,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["newsfeed"],
    queryFn: ({ pageParam = 1 }) => getRecommendation(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.hasMore
        ? lastPage.data.pagination.currentPage + 1
        : undefined,
  });

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  return {
    data,
    hasNextPage,
    fetchNextPage,
    isError,
    isLoading,
    isFetchingNextPage,
    ref, // Export the ref for the component to use
    inView,
  };
};

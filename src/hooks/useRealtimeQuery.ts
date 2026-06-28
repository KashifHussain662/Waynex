import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useRealtimeQuery<TData>(
  queryKey: QueryKey,
  subscribe: ((onData: (data: TData) => void) => () => void) | undefined,
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!subscribe) {
      return undefined;
    }

    return subscribe((data) => {
      queryClient.setQueryData(queryKey, data);
    });
  }, [queryClient, queryKey, subscribe]);
}

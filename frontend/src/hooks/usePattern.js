import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPattern, deletePatternById, getPatternById, getPatterns } from "../services/patternApi";

export function useCreatePattern() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPattern,
    onSuccess: () => {
      queryClient.invalidateQueries(["patterns"]);
    },
  });
}

export function useGetPatterns() {
  return useQuery({
    queryKey: ["patterns"],
    queryFn: getPatterns,
  });
}


export function useGetPatternById(id) {
  return useQuery({
    queryKey: ["pattern", id],
    queryFn: () => getPatternById(id),
    enabled: !!id, // Only run when `id` is available
  });
}

export function useDeletePattern() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deletePatternById(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["patterns"]); // Refresh list
    },
  });
}
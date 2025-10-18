import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import { useAuth } from '../context/auth';

type ExtraOptions = {
  invalidateKeys?: QueryKey[];
};

export function useAuthedMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> &
    ExtraOptions
): UseMutationResult<TData, TError, TVariables, TContext> {
  const { token } = useAuth();
  const qc = useQueryClient();

  const {
    invalidateKeys = [],
    mutationFn: userFn,
    onSuccess,
    ...rest
  } = options;

  return useMutation<TData, TError, TVariables, TContext>({
    ...rest,
    mutationFn: async (variables, context) => {
      if (!token) throw new Error('User not authenticated');
      return userFn!(variables, context);
    },
    onSuccess: async (data, variables, context, mutation) => {
      await onSuccess?.(data, variables, context, mutation);
      await Promise.all(
        invalidateKeys.map((key) => qc.invalidateQueries({ queryKey: key }))
      );
    },
  });
}

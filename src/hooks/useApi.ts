import { useMemo } from 'react';
import ky from 'ky';
import { api } from '../api';
import { useAuth } from '../context/auth';

const prefixUrl = '/api/';
type ApiMethod = keyof ReturnType<typeof api>;

export const useApi = <T extends ApiMethod>(method: T) => {
  const { token } = useAuth();

  const apiClient = useMemo(
    () =>
      ky.create({
        prefixUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    [token]
  );

  return api(apiClient)[method];
};

import { PublicationMap } from '@/types/publication';
import { apiFetch } from '@koudmain/ui/utils/api';

export const mapService = {
  fetchPublicationsInBounds: async (
    token: string | null,
    min_lat: number,
    max_lat: number,
    min_lng: number,
    max_lng: number,
  ) => {
    return apiFetch<PublicationMap[]>(
      `/address/map?min_lat=${min_lat}&max_lat=${max_lat}&min_lng=${min_lng}&max_lng=${max_lng}`,
      {
        method: 'GET',
        token: token ?? undefined,
      },
    );
  },
};

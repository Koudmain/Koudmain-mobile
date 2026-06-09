import { PublicationMap } from '@/types/publication';
import { apiFetch } from '@koudmain/ui/utils/api';

export const mapService = {
  fetchPublicationsInBounds: async (
    token: string | null,
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number,
  ) => {
    return apiFetch<PublicationMap[]>(
      `/address/map?min_lat=${minLat}&max_lat=${maxLat}&min_lng=${minLng}&max_lng=${maxLng}`,
      {
        method: 'GET',
        token: token ?? undefined,
      },
    );
  },
};

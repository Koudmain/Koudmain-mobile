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
      `/address/map?minLat=${minLat}&maxLat=${maxLat}&minLng=${minLng}&maxLng=${maxLng}`,
      {
        method: 'GET',
        token: token ?? undefined,
      },
    );
  },
};

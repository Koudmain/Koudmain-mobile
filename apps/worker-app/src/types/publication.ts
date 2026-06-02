export interface Publication {
  id: string;
  title: string;
  lat: number;
  lng: number;
  description: string;
  jobCount: number;
}

export interface PublicationMap {
  id: number;
  latitude: number;
  longitude: number;
}

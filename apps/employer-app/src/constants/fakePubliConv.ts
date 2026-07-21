export type PublicationTheme = 'service' | 'plonge' | 'cuisine' | 'bar' | 'accueil';

export interface PublicationStory {
  id: number;
  title: string;
  restaurant_name: string;
  image_url: string;
  start_date: string; // Ex: "24 Mars"
  duration: string; // Ex: "5h"
  theme: PublicationTheme;
  has_unread: boolean;
}

export const MOCK_PUBLICATIONS: PublicationStory[] = [
  {
    id: 103,
    title: 'Serveur Terrasse test test test',
    restaurant_name: 'La Brasserie du Port',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    start_date: '2026-03-26T12:00:00Z',
    duration: '6h',
    theme: 'service',
    has_unread: true,
  },
  {
    id: 104,
    title: 'Plongeur soir',
    restaurant_name: 'Sushi Zen',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    start_date: '2026-03-27T12:00:00Z',
    duration: '4h',
    theme: 'plonge',
    has_unread: false,
  },
  {
    id: 105,
    title: 'Chef de Rang',
    restaurant_name: "L'Artisan",
    image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400',
    start_date: '2026-03-27T12:00:00Z',
    duration: '8h',
    theme: 'cuisine',
    has_unread: true,
  },
  {
    id: 106,
    title: 'Barman Event',
    restaurant_name: 'The Rooftop',
    image_url: 'https://images.unsplash.com/photo-1536935338212-3b675c004459?w=400',
    start_date: '2026-03-29T12:00:00Z',
    duration: '7h',
    theme: 'bar',
    has_unread: false,
  },
];

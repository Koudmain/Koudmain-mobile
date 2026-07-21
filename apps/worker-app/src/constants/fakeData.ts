import { OfferInfoItem } from '@/components/offer/OfferInfoList';
import { RequirementItem } from '@/components/offer/OfferRequirements';

// Assets
import logo_resto_1 from '@/assets/images/image_profile/logo_resto1.jpg';
import logo_resto_3 from '@/assets/images/image_profile/logo_resto3.jpeg';
import logo_resto_4 from '@/assets/images/image_profile/logo_resto4.jpeg';

import image_resto1 from '@/assets/images/image_resto/image_resto1.png';
import image_resto3 from '@/assets/images/image_resto/image_resto3.jpg';
import image_resto4 from '@/assets/images/image_resto/image_resto4.jpeg';

export const LIST_PUBLI = [
  {
    id: 0,
    name: 'La femme du boulanger',
    image_profile: logo_resto_1,
    city: 'Vesoul',
    zip: '70000',
    rate: 4.6,
    number_rate: 87,
    wishlist: false,
    title: 'Serveur H/F',
    wage: 14,
    date: '2026-04-12',
    begin: '18h00',
    duration: '5h',
    competence: ['serveur', 'barman', 'accueil'],
    job: [' service'],
  },
  {
    id: 1,
    name: 'La carbonarita',
    image_profile: logo_resto_3,
    city: 'Lyon',
    zip: '690009',
    rate: 4.1,
    number_rate: 21,
    wishlist: false,
    title: 'Commis de cuisine',
    wage: 16,
    date: '2026-04-02',
    begin: '12h00',
    duration: '4h',
    competence: ['c.française', 'cuisine'],
    job: ['cuisine', 'plonge'],
  },
  {
    id: 2,
    name: 'Le Boston',
    image_profile: logo_resto_4,
    city: 'Lyon',
    zip: '690002',
    rate: 3.9,
    number_rate: 106,
    wishlist: true,
    title: 'Barman H/F',
    wage: 15,
    date: '2026-03-25',
    begin: '18h00',
    duration: '5h',
    competence: ['barman', 'accueil', 'caviste', 'barmaid', 'cuisine', 'barista'],
    job: ['bar', 'service'],
  },
];

export const LIST_FAV = [
  {
    id: 2,
    name: 'Le Boston',
    image_profile: logo_resto_4,
    city: 'Lyon',
    zip: '690002',
    rate: 3.9,
    number_rate: 106,
    wishlist: true,
    title: 'Barman H/F',
    wage: 15,
    date: '2026-03-25',
    begin: '18h00',
    duration: '5h',
    competence: ['barman', 'accueil', 'caviste', 'barmaid', 'cuisine', 'barista'],
    job: ['bar', 'service'],
  },
];

// -- Mock Data representing the design --
export const MOCK_OFFER_DATA = [
  {
    restaurantName: 'La femme du boulanger',
    title: 'Serveur H/F',
    isAvailable: true,
    bannerImage: image_resto1,
    logoImage: logo_resto_1,
    description:
      "Cherchons une personne expérimentée pour un service lors d'une soirée de forte influence. Maîtrise de la prise de commande numérique requise. Une personne gérant la pression et le période de rush recommandé.",
    skills: ['serveur', 'barman', 'barista'],
    gallery: [image_resto1, image_resto1, image_resto1, image_resto1, image_resto1],
    infoItems: [
      { icon: 'calendar', iconLibrary: 'Feather', text: 'Lun. 25 Mars 2026' },
      { icon: 'clock', iconLibrary: 'Feather', text: '18 h 00' },
      { icon: 'hourglass-half', iconLibrary: 'FontAwesome6', text: '5 h' },
      {
        icon: 'money-bill-wave',
        iconLibrary: 'FontAwesome6',
        text: '14 € / h',
      },
      {
        icon: 'map-pin',
        iconLibrary: 'Feather',
        text: '1 Rue du Commandant Girardot, 70000 Vesoul',
      },
    ] as OfferInfoItem[],
    requirements: [
      { iconType: 'outfit', text: 'Aucune tenue précise demandé' },
      {
        iconType: 'language',
        text: 'Français (obligatoire), Anglais (préféré)',
      },
    ] as RequirementItem[],
  },
  {
    restaurantName: 'La carbonarita',
    title: 'Commis de cuisine',
    isAvailable: true,
    bannerImage: image_resto3,
    logoImage: logo_resto_3,
    description:
      'Recherche commis de cuisine motivé(e) pour assister le chef dans la préparation des plats de notre carte. Une première expérience est appréciée. Dynamisme et rigueur sont de mise.',
    skills: ['c.française', 'cuisine'],
    gallery: [image_resto3, image_resto3, image_resto3],
    infoItems: [
      { icon: 'calendar', iconLibrary: 'Feather', text: 'Jeu. 2 Avril 2026' },
      { icon: 'clock', iconLibrary: 'Feather', text: '12 h 00' },
      { icon: 'hourglass-half', iconLibrary: 'FontAwesome6', text: '4 h' },
      {
        icon: 'money-bill-wave',
        iconLibrary: 'FontAwesome6',
        text: '16 € / h',
      },
      {
        icon: 'map-pin',
        iconLibrary: 'Feather',
        text: 'Lyon 9ème, 69009 Lyon',
      },
    ] as OfferInfoItem[],
    requirements: [
      { iconType: 'outfit', text: 'Tenue de cuisine standard exigée' },
      { iconType: 'language', text: 'Français (obligatoire)' },
    ] as RequirementItem[],
  },
  {
    restaurantName: 'Le Boston',
    title: 'Barman H/F',
    isAvailable: true,
    bannerImage: image_resto4,
    logoImage: logo_resto_4,
    description:
      "Le Boston cherche un(e) barman/barmaid pour rejoindre son équipe dynamique. Vous serez en charge de la préparation des boissons, du service au bar et de l'accueil de notre clientèle, dans une ambiance chaleureuse.",
    skills: ['barman', 'accueil', 'caviste', 'barmaid', 'cuisine', 'barista'],
    gallery: [image_resto4, image_resto4, image_resto4, image_resto4],
    infoItems: [
      { icon: 'calendar', iconLibrary: 'Feather', text: 'Mer. 25 Mars 2026' },
      { icon: 'clock', iconLibrary: 'Feather', text: '18 h 00' },
      { icon: 'hourglass-half', iconLibrary: 'FontAwesome6', text: '5 h' },
      {
        icon: 'money-bill-wave',
        iconLibrary: 'FontAwesome6',
        text: '15 € / h',
      },
      {
        icon: 'map-pin',
        iconLibrary: 'Feather',
        text: "Presqu'île, 69002 Lyon",
      },
    ] as OfferInfoItem[],
    requirements: [
      { iconType: 'outfit', text: 'Tenue noire et soignée' },
      {
        iconType: 'language',
        text: 'Français (obligatoire), Anglais (un plus pour les touristes)',
      },
    ] as RequirementItem[],
  },
];
// ----------------------------------------

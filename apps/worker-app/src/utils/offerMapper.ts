import { ImageSourcePropType } from 'react-native';
import { IPublication, PublicationAddress, PublicationStatus } from '@/types/publication';
import { OfferInfoItem } from '@/components/offer/OfferInfoList';
import { RequirementItem } from '@/components/offer/OfferRequirements';
import {
  formatPublicationDateLabel,
  formatPublicationDuration,
  formatPublicationShortDate,
  formatPublicationStartTime,
} from '@koudmain/ui/utils/publicationFormat';
import { normalizeText } from '@koudmain/ui/utils/text';

const DEFAULT_RESTAURANT_NAME = 'Établissement non renseigné';
const DEFAULT_TITLE = 'Mission sans titre';
const DEFAULT_CITY = 'Lieu non renseigné';
const DEFAULT_ZIP = '';
const DEFAULT_ADDRESS = 'Adresse non renseignée';
const DEFAULT_RATE = 0;
const DEFAULT_NUMBER_RATE = 0;
const DEFAULT_WAGE = 0;
const DEFAULT_DESCRIPTION = 'Aucune description fournie pour cette mission.';
const DEFAULT_SKILLS: string[] = [];
const DEFAULT_DRESS_CODE = 'Aucune tenue spécifique renseignée';
const DEFAULT_LANGUAGE = 'Français';

export interface WorkerOfferCardData {
  id: number;
  name: string;
  image_profile?: ImageSourcePropType;
  city: string;
  zip: string;
  rate: number;
  number_rate: number;
  wishlist: boolean;
  title: string;
  wage: number;
  date: string;
  begin: string;
  duration: string;
  competence: string[];
  job: string[];
}

export interface WorkerOfferDetailData {
  id: number;
  companyId?: number;
  restaurantName: string;
  title: string;
  status: PublicationStatus;
  isAvailable: boolean;
  bannerImage?: ImageSourcePropType;
  logoImage?: ImageSourcePropType;
  description: string;
  skills: string[];
  gallery: ImageSourcePropType[];
  infoItems: OfferInfoItem[];
  requirements: RequirementItem[];
}

export function resolvePublicationStatus(rawStatus?: string | null): PublicationStatus {
  if (!rawStatus) return PublicationStatus.OPEN;
  const normalized = normalizeText(rawStatus.trim());

  if (['fermee', 'ferme', 'close', 'closed'].includes(normalized)) {
    return PublicationStatus.CLOSE;
  }
  if (['urgente', 'urgent'].includes(normalized)) {
    return PublicationStatus.URGENT;
  }
  return PublicationStatus.OPEN;
}

function formatFullAddress(address?: PublicationAddress | null): string {
  if (!address) {
    return DEFAULT_ADDRESS;
  }
  const streetPart = [address.streetNumber, address.streetName].filter(Boolean).join(' ').trim();
  const cityPart = [address.zipCode, address.city].filter(Boolean).join(' ').trim();
  const full = [streetPart, cityPart].filter(Boolean).join(', ');

  return full.length > 0 ? full : DEFAULT_ADDRESS;
}

function inferJobCategories(pub: IPublication, skillNames: string[]): string[] {
  const categories = new Set<string>();

  pub.skills?.forEach((skill) => {
    if (skill.category?.name) {
      categories.add(normalizeText(skill.category.name));
    }
  });

  const combinedText = normalizeText([pub.title, pub.description, ...skillNames].join(' '));
  if (
    combinedText.includes('cuisine') ||
    combinedText.includes('commis') ||
    combinedText.includes('chef')
  ) {
    categories.add('cuisine');
  }
  if (
    combinedText.includes('bar') ||
    combinedText.includes('barman') ||
    combinedText.includes('barista')
  ) {
    categories.add('bar');
  }
  if (
    combinedText.includes('service') ||
    combinedText.includes('serveur') ||
    combinedText.includes('salle')
  ) {
    categories.add('service');
  }
  if (combinedText.includes('plonge') || combinedText.includes('plongeur')) {
    categories.add('plonge');
  }

  return Array.from(categories);
}

export function mapPublicationToOfferCard(pub: IPublication): WorkerOfferCardData {
  const address = pub.address ?? pub.company?.address ?? null;
  const skillNames =
    pub.skills && pub.skills.length > 0
      ? pub.skills.map((s) => s.name).filter(Boolean)
      : DEFAULT_SKILLS;

  const parsedWage = Number(pub.hourly_rate);
  const wage = Number.isFinite(parsedWage) && parsedWage > 0 ? parsedWage : DEFAULT_WAGE;

  const logoSource: ImageSourcePropType | undefined = pub.company?.logo
    ? { uri: pub.company.logo }
    : undefined;

  return {
    id: pub.id,
    name: pub.company?.name?.trim() || DEFAULT_RESTAURANT_NAME,
    image_profile: logoSource,
    city: address?.city?.trim() || DEFAULT_CITY,
    zip: address?.zipCode?.trim() || DEFAULT_ZIP,
    rate: pub.company?.rating ?? DEFAULT_RATE,
    number_rate: pub.company?.reviewCount ?? DEFAULT_NUMBER_RATE,
    wishlist: false,
    title: pub.title?.trim() || DEFAULT_TITLE,
    wage,
    date: formatPublicationShortDate(pub.starting_date),
    begin: formatPublicationStartTime(pub.starting_date, false),
    duration: formatPublicationDuration(pub.starting_date, pub.ending_date, false),
    competence: skillNames,
    job: inferJobCategories(pub, skillNames),
  };
}

export function mapPublicationToOfferDetail(pub: IPublication): WorkerOfferDetailData {
  const address = pub.address ?? pub.company?.address ?? null;
  const skillNames =
    pub.skills && pub.skills.length > 0
      ? pub.skills.map((s) => s.name).filter(Boolean)
      : DEFAULT_SKILLS;

  const parsedWage = Number(pub.hourly_rate);
  const wage = Number.isFinite(parsedWage) && parsedWage > 0 ? parsedWage : DEFAULT_WAGE;

  const bannerImage: ImageSourcePropType | undefined = pub.company?.cover
    ? { uri: pub.company.cover }
    : undefined;

  const logoImage: ImageSourcePropType | undefined = pub.company?.logo
    ? { uri: pub.company.logo }
    : undefined;

  // TODO: Update the database schema and backend API to support storing and retrieving
  // mission gallery images on publications (currently only rendered if available).
  const gallery: ImageSourcePropType[] =
    pub.company?.gallery && pub.company.gallery.length > 0
      ? pub.company.gallery.map((uri) => ({ uri }))
      : [];

  const status = resolvePublicationStatus(pub.status);
  const isAvailable = status !== PublicationStatus.CLOSE;

  const infoItems: OfferInfoItem[] = [
    {
      icon: 'calendar',
      iconLibrary: 'Feather',
      text: formatPublicationDateLabel(pub.starting_date),
    },
    {
      icon: 'clock',
      iconLibrary: 'Feather',
      text: formatPublicationStartTime(pub.starting_date, true),
    },
    {
      icon: 'hourglass-half',
      iconLibrary: 'FontAwesome6',
      text: formatPublicationDuration(pub.starting_date, pub.ending_date, true),
    },
    {
      icon: 'money-bill-wave',
      iconLibrary: 'FontAwesome6',
      text: `${wage} € / h`,
    },
    {
      icon: 'map-pin',
      iconLibrary: 'Feather',
      text: formatFullAddress(address),
    },
  ];

  const requirements: RequirementItem[] = [
    {
      iconType: 'outfit',
      text: pub.company?.dressCode?.trim() || DEFAULT_DRESS_CODE,
    },
    {
      iconType: 'language',
      text: DEFAULT_LANGUAGE,
    },
  ];

  return {
    id: pub.id,
    companyId: pub.companyId ?? pub.company?.id ?? undefined,
    restaurantName: pub.company?.name?.trim() || DEFAULT_RESTAURANT_NAME,
    title: pub.title?.trim() || DEFAULT_TITLE,
    status,
    isAvailable,
    bannerImage,
    logoImage,
    description: pub.description?.trim() || DEFAULT_DESCRIPTION,
    skills: skillNames,
    gallery,
    infoItems,
    requirements,
  };
}

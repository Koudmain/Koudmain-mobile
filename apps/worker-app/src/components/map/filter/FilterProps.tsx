import { DurationSelectorOption } from '@koudmain/ui/components/utils/DurationSelectorInput';

const MAX_DAYS = 30;
const MAX_MONTHS = 18;

/**
 * Valeurs possibles pour l'unité de durée des missions
 */
export const durationOptions: DurationSelectorOption[] = [
  { label: 'jours', value: 'days' },
  { label: 'mois', value: 'months' },
];

/**
 * Type représentant les unités de durée pour les missions
 */
export type DurationUnit = 'days' | 'months';

export const getDurationLimit = (unit: DurationUnit) => (unit === 'days' ? MAX_DAYS : MAX_MONTHS);

export const getUnitLabel = (unit: DurationUnit) => (unit === 'days' ? 'jours' : 'mois');

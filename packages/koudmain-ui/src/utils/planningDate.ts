const MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

export const formatDayLabel = (
  dateString: string,
  {
    capitalizeMonth = false,
    withYear = true,
  }: { capitalizeMonth?: boolean; withYear?: boolean } = {},
): string => {
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return '';
  const [, year, month, day] = match;
  const monthName = MONTHS[parseInt(month, 10) - 1];
  const label = capitalizeMonth
    ? monthName.charAt(0).toUpperCase() + monthName.slice(1)
    : monthName;
  return [parseInt(day, 10), label, withYear ? year : null].filter(Boolean).join(' ');
};

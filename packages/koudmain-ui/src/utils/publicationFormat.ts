import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

const capitalize = (value: string): string =>
  value.length > 0 ? value.charAt(0).toUpperCase() + value.slice(1) : value;

export const formatPublicationDateLabel = (startingDate?: string | null): string => {
  if (!startingDate) return 'Date à définir';
  const date = new Date(startingDate);
  if (!isValid(date)) return 'Date à définir';

  const day = capitalize(format(date, 'eee', { locale: fr }));
  const dayNumber = format(date, 'd', { locale: fr });
  const month = capitalize(format(date, 'MMMM', { locale: fr }));
  const year = format(date, 'yyyy', { locale: fr });

  return `${day} ${dayNumber} ${month} ${year}`;
};

export const formatPublicationShortDate = (startingDate?: string | null): string => {
  if (!startingDate) return 'Date à définir';
  const date = new Date(startingDate);
  if (!isValid(date)) return 'Date à définir';

  return format(date, 'yyyy-MM-dd', { locale: fr });
};

export const formatPublicationStartTime = (
  startingDate?: string | null,
  withSpaces: boolean = false,
): string => {
  if (!startingDate) return withSpaces ? '-- h --' : '--h--';
  const start = new Date(startingDate);
  if (!isValid(start)) return withSpaces ? '-- h --' : '--h--';

  return format(start, withSpaces ? "HH 'h' mm" : "HH'h'mm", { locale: fr });
};

export const formatPublicationDuration = (
  startingDate?: string | null,
  endingDate?: string | null,
  withSpaces: boolean = false,
): string => {
  if (!startingDate || !endingDate) return withSpaces ? '-- h' : '--h';
  const start = new Date(startingDate);
  const end = new Date(endingDate);
  if (!isValid(start) || !isValid(end)) return withSpaces ? '-- h' : '--h';

  const durationMinutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
  const durationHours = Math.floor(durationMinutes / 60);
  const remainingMinutes = durationMinutes % 60;
  const separator = withSpaces ? ' h ' : 'h';
  const unitOnly = withSpaces ? ' h' : 'h';

  if (remainingMinutes > 0) {
    return `${durationHours}${separator}${String(remainingMinutes).padStart(2, '0')}`;
  }
  return `${durationHours}${unitOnly}`;
};

export const formatPublicationTimeLabel = (startingDate: string, endingDate: string): string => {
  const start = new Date(startingDate);
  const end = new Date(endingDate);
  if (!isValid(start) || !isValid(end)) return '--h-- - --h--';

  const durationLabel = formatPublicationDuration(startingDate, endingDate, false);
  return `${format(start, "HH'h'mm", { locale: fr })} - ${format(end, "HH'h'mm", { locale: fr })} (${durationLabel})`;
};

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const capitalize = (value: string): string =>
  value.length > 0 ? value.charAt(0).toUpperCase() + value.slice(1) : value;

export const formatPublicationDateLabel = (startingDate: string): string => {
  const date = new Date(startingDate);
  const day = capitalize(format(date, 'eee', { locale: fr }));
  const dayNumber = format(date, 'd', { locale: fr });
  const month = capitalize(format(date, 'MMMM', { locale: fr }));
  const year = format(date, 'yyyy', { locale: fr });

  return `${day} ${dayNumber} ${month} ${year}`;
};

export const formatPublicationTimeLabel = (startingDate: string, endingDate: string): string => {
  const start = new Date(startingDate);
  const end = new Date(endingDate);
  const durationMinutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
  const durationHours = Math.floor(durationMinutes / 60);
  const remainingMinutes = durationMinutes % 60;
  const durationLabel =
    remainingMinutes > 0
      ? `${durationHours}h${String(remainingMinutes).padStart(2, '0')}`
      : `${durationHours}h`;

  return `${format(start, "HH'h'mm", { locale: fr })} - ${format(end, "HH'h'mm", { locale: fr })} (${durationLabel})`;
};

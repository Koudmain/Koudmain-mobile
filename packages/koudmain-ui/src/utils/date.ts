import { format, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';

// 'yyyy-MM-dd' of the phone's own day. Never use toISOString().split('T')[0]: that is the UTC
// day, which is the previous day in France between midnight and 1-2 am.
export const toLocalDateKey = (date: Date | string) => format(new Date(date), 'yyyy-MM-dd');

export const formatPublicationDate = (dateString: string) => {
  const date = new Date(dateString);

  if (isToday(date)) return "Aujourd'hui";
  if (isTomorrow(date)) return 'Demain';

  return format(date, 'eee d MMM', { locale: fr });
};

export const formatReviewDate = (dateString: string) =>
  format(new Date(dateString), 'd MMM yyyy', { locale: fr });

export const formatResponseDelay = (minutes: number | null) => {
  if (minutes === null) return '—';
  if (minutes < 60) return `~ ${minutes}min`;
  if (minutes < 60 * 24) return `~ ${Math.round(minutes / 60)}h`;
  return `~ ${Math.round(minutes / (60 * 24))}j`;
};

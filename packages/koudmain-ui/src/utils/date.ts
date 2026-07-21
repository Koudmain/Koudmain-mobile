import { format, isToday, isTomorrow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatPublicationDate = (dateString: string) => {
  const date = new Date(dateString);

  if (isToday(date)) return "Aujourd'hui";
  if (isTomorrow(date)) return 'Demain';

  return format(date, 'eee d MMM', { locale: fr });
};

import { PlanningApiEvent, PlanningEvent } from '@/types/planning';

export const formatDayEvents = (
  events: PlanningApiEvent[],
  dateString: string,
): PlanningEvent[] => {
  return events
    .filter((item) => {
      if (!item.starting_date) return false;
      return item.starting_date.split('T')[0] === dateString;
    })
    .map((item) => {
      const startDate = new Date(item.starting_date);
      const endDate = item.ending_date ? new Date(item.ending_date) : startDate;
      return {
        id: item.publication_id,
        name: item.company_name,
        image_profile: item.company_logo,
        title: item.title,
        wage: parseFloat(item.salary),
        time: `${startDate.getHours().toString().padStart(2, '0')}h${startDate.getMinutes().toString().padStart(2, '0')}`,
        end: `${endDate.getHours().toString().padStart(2, '0')}h${endDate.getMinutes().toString().padStart(2, '0')}`,
        status: item.application_status?.toLowerCase() === 'accepted' ? 'accepted' : 'pending',
        rate: parseFloat(String(item.company_rating)),
        number_rate: parseInt(String(item.company_rating_count), 10),
        city: item.city || 'Unknown City',
        zip: item.zip || '00000',
        starting_date: item.starting_date,
      };
    });
};

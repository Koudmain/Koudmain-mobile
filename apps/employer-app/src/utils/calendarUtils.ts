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
        id: item.publicationId,
        name: item.worker_name,
        image_profile: item.worker_profile_picture,
        title: item.title,
        wage: parseFloat(item.salary),
        time: `${startDate.getHours().toString().padStart(2, '0')}h${startDate.getMinutes().toString().padStart(2, '0')}`,
        end: `${endDate.getHours().toString().padStart(2, '0')}h${endDate.getMinutes().toString().padStart(2, '0')}`,
        rate: parseFloat(String(item.workerRating)),
        number_rate: Number(item.workerRatingCount),
        starting_date: item.starting_date,
      };
    });
};

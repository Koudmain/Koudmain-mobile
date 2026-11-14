import { ApplicationStatus, PlanningApiEvent, PlanningEvent } from '@/types/planning';

const toApplicationStatus = (status: PlanningApiEvent['application_status']): ApplicationStatus =>
  status === 'Accepted' ? 'accepted' : 'pending';

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
        companyId: item.companyId,
        name: item.company_name ?? 'Établissement',
        image_profile: item.company_logo,
        title: item.title,
        wage: parseFloat(item.salary),
        time: `${startDate.getHours().toString().padStart(2, '0')}h${startDate.getMinutes().toString().padStart(2, '0')}`,
        end: `${endDate.getHours().toString().padStart(2, '0')}h${endDate.getMinutes().toString().padStart(2, '0')}`,
        status: toApplicationStatus(item.application_status),
        rate: parseFloat(String(item.companyRating)),
        number_rate: parseInt(String(item.companyRatingCount), 10),
        city: item.city || 'Unknown City',
        zip: item.zip || '00000',
        starting_date: item.starting_date,
      };
    });
};

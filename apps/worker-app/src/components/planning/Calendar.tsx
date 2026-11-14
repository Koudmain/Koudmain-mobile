import React from 'react';
import { SharedCalendar } from '@koudmain/ui';
import { useSession } from '@koudmain/ui/context/SessionContext';
import { router } from 'expo-router';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { formatDayEvents } from '@/utils/calendarUtils';
import PlanningDayPopUp from '@/components/planning/PlanningDayPopUp';

export default function CalendarComponent() {
  const { session } = useSession();
  const today = new Date();
  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
  const { events } = useCalendarEvents(session, currentMonthStr);

  return (
    <SharedCalendar
      events={events}
      formatDayEvents={formatDayEvents}
      renderPopUp={(props) => (
        <PlanningDayPopUp
          {...props}
          onMissionPress={(event) => {
            // props.onClose();
            // router.push(`/offer/${event.id}`);
          }}
          onCompanyPress={(event) => {
            props.onClose();
            router.push(`/company/${event.companyId}`);
          }}
        />
      )}
    />
  );
}

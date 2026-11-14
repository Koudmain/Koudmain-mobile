import React from 'react';
import { SharedCalendar } from '@koudmain/ui';
import { useSession } from '@koudmain/ui/context/SessionContext';
import { useCompany } from '@/context/CompanyContext';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { formatDayEvents } from '@/utils/calendarUtils';
import { router } from 'expo-router';
import PlanningDayPopUp from '@/components/planning/PlanningDayPopUp';

export default function CalendarComponent() {
  const { session } = useSession();
  const { activeCompanyId } = useCompany();
  const today = new Date();
  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
  const { events } = useCalendarEvents(session, currentMonthStr, activeCompanyId);

  return (
    <SharedCalendar
      events={events}
      formatDayEvents={formatDayEvents}
      renderPopUp={(props) => (
        <PlanningDayPopUp
          {...props}
          onAnnoncePress={(event) => {
            // props.onClose();
            // router.push(`/publication/${event.id}`);
          }}
          onWorkerPress={(event) => {
            if (!event.workerId) return;
            props.onClose();
            router.push(`/worker/${event.workerId}`);
          }}
        />
      )}
    />
  );
}

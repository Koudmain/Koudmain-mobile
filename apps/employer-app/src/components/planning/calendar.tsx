import React from 'react';
import { SharedCalendar } from '@koudmain/ui';
import { useSession } from '@/context/SessionContext';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { formatDayEvents } from '@/utils/calendarUtils';
import EventPopUp from '@/components/modals/EventPopUp';

export default function CalendarComponent() {
  const { session, activeCompanyId } = useSession();
  const today = new Date();
  const currentMonthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
  const { events } = useCalendarEvents(session, currentMonthStr, activeCompanyId);

  return (
    <SharedCalendar
      events={events}
      formatDayEvents={formatDayEvents}
      renderPopUp={(props) => <EventPopUp {...props} />}
    />
  );
}

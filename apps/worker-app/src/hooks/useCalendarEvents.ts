import { useState, useRef, useEffect } from 'react';
import { planningService } from '@/api/planning.api';
import { PlanningApiEvent } from '@/types/planning';

const parseLocalDate = (dateStr: string): Date => {
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    throw new Error(`Invalid date format: "${dateStr}". Expected YYYY-MM-DD`);
  }
  const [, yearStr, monthStr, dayStr] = match;
  return new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1, parseInt(dayStr, 10));
};

export const useCalendarEvents = (session: string | null, currentMonthStr: string) => {
  const [events, setEvents] = useState<PlanningApiEvent[]>([]);
  const loadedMonths = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchEvents = async () => {
      if (!session) return;
      const currentDate = parseLocalDate(currentMonthStr);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const targetMonths = [
        new Date(year, month - 2, 1),
        new Date(year, month - 1, 1),
        new Date(year, month, 1),
      ];

      const missingMonths = targetMonths.filter((d) => {
        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        return !loadedMonths.current.has(key);
      });

      const minAllowedTime = new Date(year, month - 3, 1).getTime();
      const maxAllowedTime = new Date(year, month + 2, 0).getTime();

      const updateCacheLimits = () => {
        targetMonths.forEach((d) =>
          loadedMonths.current.add(`${d.getFullYear()}-${d.getMonth() + 1}`),
        );
        for (const key of Array.from(loadedMonths.current)) {
          const [y, m] = key.split('-');
          const dTime = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1).getTime();
          if (dTime < minAllowedTime || dTime > maxAllowedTime) {
            loadedMonths.current.delete(key);
          }
        }
      };

      if (missingMonths.length === 0) {
        updateCacheLimits();
        setEvents((prevEvents) =>
          prevEvents.filter((evt) => {
            if (!evt.starting_date) return false;
            const eventTime = new Date(evt.starting_date).getTime();
            return eventTime >= minAllowedTime && eventTime <= maxAllowedTime;
          }),
        );
        return;
      }

      const minMissDate = new Date(Math.min(...missingMonths.map((d) => d.getTime())));
      const maxMissDate = new Date(Math.max(...missingMonths.map((d) => d.getTime())));
      const fetchStartDate = new Date(minMissDate.getFullYear(), minMissDate.getMonth(), 1);
      const fetchEndDate = new Date(maxMissDate.getFullYear(), maxMissDate.getMonth() + 1, 0);

      try {
        const response =
          loadedMonths.current.size === 0
            ? await planningService.getPlanning(session)
            : await planningService.getPlanning(session, fetchStartDate, fetchEndDate);

        const fetchedEvents = response ?? [];

        updateCacheLimits();

        setEvents((prevEvents) => {
          const allEvents = [...prevEvents, ...fetchedEvents];
          const uniqueEventsMap = new Map<string, PlanningApiEvent>();
          allEvents.forEach((evt) => {
            const key = evt.publicationId
              ? `${evt.publicationId}-${evt.starting_date}`
              : JSON.stringify(evt);
            uniqueEventsMap.set(key, evt);
          });

          return Array.from(uniqueEventsMap.values()).filter((evt) => {
            if (!evt.starting_date) return false;
            const eventTime = new Date(evt.starting_date).getTime();
            return eventTime >= minAllowedTime && eventTime <= maxAllowedTime;
          });
        });
      } catch (error) {
        console.error('Failed to fetch planning data', error);
      }
    };
    fetchEvents();
  }, [currentMonthStr, session]);

  return { events };
};

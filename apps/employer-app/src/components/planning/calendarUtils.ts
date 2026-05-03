export const getNumberOfWeeks = (year: number, month: number) => {
  const firstOfMonth = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const startDay = firstOfMonth.getDay();
  const offset = (startDay - 1 + 7) % 7;
  return Math.ceil((offset + daysInMonth) / 7);
};

export const formatDayEvents = (events: any[], dateString: string) => {
  return events
    .filter((item) => {
      if (!item.startingDate) return false;
      const eventDate = item.startingDate.split('T')[0];
      return eventDate === dateString;
    })
    .map((item) => {
      const startDate = new Date(item.startingDate);
      const endDate = item.endingDate ? new Date(item.endingDate) : startDate;
      return {
        ...item,
        id: item.publicationId,
        name: item.companyName,
        title: item.title,
        wage: parseFloat(item.salary),
        time: `${startDate.getHours().toString().padStart(2, '0')}h${startDate.getMinutes().toString().padStart(2, '0')}`,
        end: `${endDate.getHours().toString().padStart(2, '0')}h${endDate.getMinutes().toString().padStart(2, '0')}`,
        status: item.applicationStatus?.toLowerCase() === 'accepted' ? 'accepted' : 'pending',
        rate: parseFloat(item.companyRating),
        number_rate: parseInt(item.companyRatingCount, 10),
      };
    });
};

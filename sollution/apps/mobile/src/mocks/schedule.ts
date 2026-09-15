export type TimeSlot = {
  id: string;
  hour: number;
  minute: number;
  available: boolean;
};

const currentMonth = new Date();
const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
const unavailableDates = new Set([
  `${currentMonth.getFullYear()}-${currentMonth.getMonth()}-19`,
  `${currentMonth.getFullYear()}-${currentMonth.getMonth()}-21`,
  `${nextMonth.getFullYear()}-${nextMonth.getMonth()}-23`,
]);

export const scheduleDays = [currentMonth, nextMonth].flatMap((month) => {
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index + 1))
    .filter((date) => !unavailableDates.has(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`));
});

export const scheduleSlots: TimeSlot[] = Array.from({ length: 24 }, (_, hour) => ({
  id: `${String(hour).padStart(2, '0')}:00`,
  hour,
  minute: 0,
  available: true,
}));

export const defaultScheduleSelection = {
  day: scheduleDays[2],
  slotId: '14:00',
};

export function formatSlotTime(slot: TimeSlot, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(2026, 0, 1, slot.hour, slot.minute));
}

export function formatDayChip(date: Date, locale: string) {
  return {
    weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date),
    day: new Intl.DateTimeFormat(locale, { day: 'numeric' }).format(date),
  };
}

export function formatDaySummary(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
  }).format(date);
}

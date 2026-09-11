export type TimeSlot = {
  id: string;
  hour: number;
  minute: number;
  available: boolean;
};

export const scheduleDays = [
  new Date(2026, 5, 18),
  new Date(2026, 5, 19),
  new Date(2026, 5, 20),
  new Date(2026, 5, 21),
  new Date(2026, 5, 22),
];

export const scheduleSlots: TimeSlot[] = [
  { id: '00:00', hour: 0, minute: 0, available: true },
  { id: '02:00', hour: 2, minute: 0, available: false },
  { id: '04:00', hour: 4, minute: 0, available: true },
  { id: '06:00', hour: 6, minute: 0, available: true },
  { id: '08:00', hour: 8, minute: 0, available: true },
  { id: '09:00', hour: 9, minute: 0, available: true },
  { id: '10:00', hour: 10, minute: 0, available: true },
  { id: '11:30', hour: 11, minute: 30, available: true },
  { id: '13:00', hour: 13, minute: 0, available: false },
  { id: '14:30', hour: 14, minute: 30, available: true },
  { id: '16:00', hour: 16, minute: 0, available: true },
  { id: '17:30', hour: 17, minute: 30, available: true },
  { id: '19:00', hour: 19, minute: 0, available: true },
  { id: '20:30', hour: 20, minute: 30, available: true },
  { id: '22:00', hour: 22, minute: 0, available: true },
  { id: '23:30', hour: 23, minute: 30, available: true },
];

export const defaultScheduleSelection = {
  day: scheduleDays[2],
  slotId: '14:30',
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

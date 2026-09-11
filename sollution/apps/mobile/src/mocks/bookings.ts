import { petPhotos } from './pets';

export type BookingStatus = 'pending' | 'completed';

export type HistoryBooking = {
  id: string;
  petName: string;
  photo: typeof petPhotos.max;
  breedKey: 'home.goldenRetriever' | 'selectPet.frenchBulldog';
  serviceKey: 'history.fullGroomSpa' | 'history.bathNailTrim' | 'history.deshedding';
  startsAt: Date;
  minutes: number;
  price: number;
  status: BookingStatus;
};

export const bookingHistory: HistoryBooking[] = [
  {
    id: 'booking-max-jun-20',
    petName: 'Max',
    photo: petPhotos.max,
    breedKey: 'home.goldenRetriever',
    serviceKey: 'history.fullGroomSpa',
    startsAt: new Date(2026, 5, 20, 14, 30),
    minutes: 75,
    price: 156,
    status: 'pending',
  },
  {
    id: 'booking-luna-jun-12',
    petName: 'Luna',
    photo: petPhotos.bella,
    breedKey: 'selectPet.frenchBulldog',
    serviceKey: 'history.bathNailTrim',
    startsAt: new Date(2026, 5, 12, 11, 0),
    minutes: 45,
    price: 85,
    status: 'completed',
  },
  {
    id: 'booking-max-may-04',
    petName: 'Max',
    photo: petPhotos.max,
    breedKey: 'home.goldenRetriever',
    serviceKey: 'history.deshedding',
    startsAt: new Date(2026, 4, 4, 15, 0),
    minutes: 60,
    price: 110,
    status: 'completed',
  },
];

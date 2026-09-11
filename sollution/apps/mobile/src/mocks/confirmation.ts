import { petPhotos } from './pets';
import { defaultScheduleSelection } from './schedule';

export type ConfirmationPetBooking = {
  id: string;
  name: string;
  photo: typeof petPhotos.max;
  breedKey: 'home.goldenRetriever' | 'selectPet.frenchBulldog';
  age: string;
  vip: boolean;
  serviceKey: 'confirmation.fullGroomSanctuary' | 'confirmation.bathTidyRefresh';
  servicePrice: number;
  addOnKey: 'confirmation.teethBrushing' | 'confirmation.nailTrim';
  addOnPrice: number;
  groomerKey: 'confirmation.elenaTeam' | 'confirmation.marcoTeam';
  serviceIcon: 'spa' | 'shower';
};

export const confirmationBookings: ConfirmationPetBooking[] = [
  {
    id: 'max',
    name: 'Max',
    photo: petPhotos.max,
    breedKey: 'home.goldenRetriever',
    age: '3.5',
    vip: true,
    serviceKey: 'confirmation.fullGroomSanctuary',
    servicePrice: 59,
    addOnKey: 'confirmation.teethBrushing',
    addOnPrice: 37,
    groomerKey: 'confirmation.elenaTeam',
    serviceIcon: 'spa',
  },
  {
    id: 'luna',
    name: 'Luna',
    photo: petPhotos.bella,
    breedKey: 'selectPet.frenchBulldog',
    age: '2',
    vip: false,
    serviceKey: 'confirmation.bathTidyRefresh',
    servicePrice: 42,
    addOnKey: 'confirmation.nailTrim',
    addOnPrice: 18,
    groomerKey: 'confirmation.marcoTeam',
    serviceIcon: 'shower',
  },
];

export const confirmationLogistics = {
  arrivesAt: new Date(
    defaultScheduleSelection.day.getFullYear(),
    defaultScheduleSelection.day.getMonth(),
    defaultScheduleSelection.day.getDate(),
    14,
    30,
  ),
  total: 159,
};

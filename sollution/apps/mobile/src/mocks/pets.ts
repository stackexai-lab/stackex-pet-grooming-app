import type { ImageSourcePropType } from 'react-native';

import { homeImages } from './home';

export type PetSpecies = 'dog' | 'cat';
export type PetSize = 'small' | 'medium' | 'large';

export type Pet = {
  id: string;
  name: string;
  photo?: ImageSourcePropType;
  breedKey?: 'home.goldenRetriever' | 'selectPet.frenchBulldog';
  breed?: string;
  species: PetSpecies;
  size: PetSize;
  weightLbs?: number;
  lastGroomedWeeks?: number;
  noteKey?: 'selectPet.gentleDrying';
};

export const petPhotos = {
  max: homeImages.pet,
  bella: require('../../assets/images/french-bulldog.jpg') as ImageSourcePropType,
};

export const initialPets: Pet[] = [
  {
    id: 'max',
    name: 'Max',
    photo: petPhotos.max,
    breedKey: 'home.goldenRetriever',
    species: 'dog',
    size: 'large',
    weightLbs: 65,
    lastGroomedWeeks: 4,
  },
  {
    id: 'bella',
    name: 'Bella',
    photo: petPhotos.bella,
    breedKey: 'selectPet.frenchBulldog',
    species: 'dog',
    size: 'small',
    weightLbs: 24,
    noteKey: 'selectPet.gentleDrying',
  },
];

import type { ImageSourcePropType } from 'react-native';

export type ServiceTone = 'warm' | 'cool';

export type PopularService = {
  id: 'fullGroom' | 'bathBrush';
  titleKey: 'home.fullGroomTitle' | 'home.bathBrushTitle';
  descriptionKey: 'home.fullGroomDescription' | 'home.bathBrushDescription';
  price: number;
  icon: 'content-cut' | 'shower';
  tone: ServiceTone;
};

export const homeImages = {
  logo: require('../../assets/images/pawcare-logo.png') as ImageSourcePropType,
  hero: require('../../assets/images/golden-retriever.jpg') as ImageSourcePropType,
  pet: require('../../assets/images/golden-retriever.jpg') as ImageSourcePropType,
};

export const homeMock = {
  guestName: 'Sarah',
  date: new Date(2024, 9, 24),
  appointmentAt: new Date(2024, 9, 25, 14, 30),
  pet: {
    name: 'Max',
    breedKey: 'home.goldenRetriever' as const,
  },
  services: [
    {
      id: 'fullGroom',
      titleKey: 'home.fullGroomTitle',
      descriptionKey: 'home.fullGroomDescription',
      price: 59,
      icon: 'content-cut',
      tone: 'warm',
    },
    {
      id: 'bathBrush',
      titleKey: 'home.bathBrushTitle',
      descriptionKey: 'home.bathBrushDescription',
      price: 45,
      icon: 'shower',
      tone: 'cool',
    },
  ] as const satisfies readonly PopularService[],
};

import type { ImageSourcePropType } from 'react-native';

export type ServiceIcon = 'shower' | 'cut' | 'sparkle' | 'pets';
export type HighlightIcon = 'spa' | 'verified' | 'paw' | 'quiet';

export type GroomingService = {
  id: 'bathBrush' | 'fullGroom' | 'premiumGroom' | 'catGrooming';
  titleKey: 'home.bathBrushTitle' | 'home.fullGroomTitle' | 'selectService.premiumGroomTitle' | 'selectService.catGroomingTitle';
  descriptionKey: 'selectService.bathBrushDescription' | 'selectService.fullGroomDescription' | 'selectService.premiumGroomDescription' | 'selectService.catGroomingDescription';
  highlightKey: 'selectService.bathBrushHighlight' | 'selectService.fullGroomHighlight' | 'selectService.premiumGroomHighlight' | 'selectService.catGroomingHighlight';
  icon: ServiceIcon;
  highlightIcon: HighlightIcon;
  price: number;
  minutes: number;
  popular?: boolean;
  photo: ImageSourcePropType;
};

export const groomingServices: GroomingService[] = [
  {
    id: 'bathBrush',
    titleKey: 'home.bathBrushTitle',
    descriptionKey: 'selectService.bathBrushDescription',
    highlightKey: 'selectService.bathBrushHighlight',
    icon: 'shower',
    highlightIcon: 'spa',
    price: 45,
    minutes: 45,
    photo: require('../../assets/images/service-bath.jpg'),
  },
  {
    id: 'fullGroom',
    titleKey: 'home.fullGroomTitle',
    descriptionKey: 'selectService.fullGroomDescription',
    highlightKey: 'selectService.fullGroomHighlight',
    icon: 'cut',
    highlightIcon: 'verified',
    price: 59,
    minutes: 75,
    popular: true,
    photo: require('../../assets/images/service-full-groom.jpg'),
  },
  {
    id: 'premiumGroom',
    titleKey: 'selectService.premiumGroomTitle',
    descriptionKey: 'selectService.premiumGroomDescription',
    highlightKey: 'selectService.premiumGroomHighlight',
    icon: 'sparkle',
    highlightIcon: 'paw',
    price: 99,
    minutes: 90,
    photo: require('../../assets/images/service-premium.jpg'),
  },
  {
    id: 'catGrooming',
    titleKey: 'selectService.catGroomingTitle',
    descriptionKey: 'selectService.catGroomingDescription',
    highlightKey: 'selectService.catGroomingHighlight',
    icon: 'pets',
    highlightIcon: 'quiet',
    price: 79,
    minutes: 60,
    photo: require('../../assets/images/service-cat.jpg'),
  },
];

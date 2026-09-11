import type { GroomingService } from './services';

export type ServiceAddon = {
  id: 'teeth' | 'paw' | 'deshedding';
  titleKey: 'serviceDetails.teeth' | 'serviceDetails.paw' | 'serviceDetails.deshedding';
  hintKey: 'serviceDetails.teethHint' | 'serviceDetails.pawHint' | 'serviceDetails.desheddingHint';
  price: number;
};

export const serviceAddons: ServiceAddon[] = [
  {
    id: 'teeth',
    titleKey: 'serviceDetails.teeth',
    hintKey: 'serviceDetails.teethHint',
    price: 15,
  },
  {
    id: 'paw',
    titleKey: 'serviceDetails.paw',
    hintKey: 'serviceDetails.pawHint',
    price: 10,
  },
  {
    id: 'deshedding',
    titleKey: 'serviceDetails.deshedding',
    hintKey: 'serviceDetails.desheddingHint',
    price: 20,
  },
];

export function serviceDetailCopy(service: GroomingService, browse = false) {
  if (browse) {
    return {
      titleKey: service.titleKey,
      blurbKey: service.descriptionKey,
      price: service.price,
      badgeKey: 'serviceDetails.spaSignature' as const,
    };
  }

  if (service.id === 'fullGroom') {
    return {
      titleKey: 'history.fullGroomSpa' as const,
      blurbKey: 'serviceDetails.fullGroomBlurb' as const,
      price: 156,
      badgeKey: 'serviceDetails.spaSignature' as const,
    };
  }

  return {
    titleKey: service.titleKey,
    blurbKey: service.descriptionKey,
    price: service.price,
    badgeKey: 'serviceDetails.spaSignature' as const,
  };
}

// Frontend demonstration data only. Prices are USD; no API dependency.
export type Pet = {
  id: string; nameKey?: string; name?: string; breedKey?: string; breed?: string;
  species: 'dog' | 'cat'; age: number; weight: number; sex: 'male' | 'female';
  coat: 'double' | 'silky' | 'short'; note: 'sensitive' | 'quiet' | 'ears'; image: string;
};
export type Service = { id: string; price: number; minutes: number; image: string; tone: 'warning' | 'success' | 'muted' };
export type CartItem = { id: string; petId: string };
export const pets: Pet[] = [
  { id: 'bruno', nameKey: 'petBruno', breedKey: 'breedGolden', species: 'dog', age: 4.5, weight: 31, sex: 'male', coat: 'double', note: 'sensitive', image: '/images/golden-retriever.jpg' },
  { id: 'luna', nameKey: 'petLuna', breedKey: 'breedPersian', species: 'cat', age: 3, weight: 4.2, sex: 'female', coat: 'silky', note: 'quiet', image: '/images/service-cat.jpg' },
  { id: 'max', nameKey: 'petMax', breedKey: 'breedLabrador', species: 'dog', age: 6, weight: 29, sex: 'male', coat: 'short', note: 'ears', image: '/images/golden-retriever.jpg' },
];
export const services: Service[] = [
  { id: 'signature', price: 95, minutes: 105, image: '/images/service-full-groom.jpg', tone: 'warning' },
  { id: 'bath', price: 58, minutes: 60, image: '/images/service-bath.jpg', tone: 'success' },
  { id: 'scissor', price: 65, minutes: 75, image: '/images/service-full-groom.jpg', tone: 'muted' },
  { id: 'nails', price: 22, minutes: 20, image: '/images/service-premium.jpg', tone: 'muted' },
];
export const extras = [
  { id: 'teeth', price: 25, minutes: 25 },
  { id: 'deshed', price: 20, minutes: 15 },
] as const;
export const initialCart = { max: ['signature', 'teeth', 'deshed'] };
export const loyaltyRate = 0.1;
export const taxRate = 0.0825;
export function calculateTotals(ids: string[]) {
  const catalog = [...services, ...extras];
  const subtotal = ids.reduce((sum, id) => sum + (catalog.find(item => item.id === id)?.price ?? 0), 0);
  const discount = Math.round(subtotal * loyaltyRate * 100) / 100;
  const tax = Math.round((subtotal - discount) * taxRate * 100) / 100;
  return { subtotal, discount, tax, total: Math.round((subtotal - discount + tax) * 100) / 100 };
}

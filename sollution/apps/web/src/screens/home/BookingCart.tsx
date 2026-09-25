import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { calculateTotals, extras, services, type CartItem, type Pet } from '@/mocks/home';
import { useHomeFormat } from './useHomeFormat';

export function BookingCart({ items, pets, emptyPetName, onRemove, onCheckout, onSave, onBrowse }: { items: CartItem[]; pets: Pet[]; emptyPetName: string; onRemove: (item: CartItem) => void; onCheckout: () => void; onSave: () => void; onBrowse: () => void }) {
  const { t } = useTranslation();
  const { money, number, petName } = useHomeFormat();
  const totals = calculateTotals(items.map(item => item.id));
  return <section className="booking-panel" aria-label={t('bookingSession')}>
    <div className="booking-heading"><h2>{t('bookingSession')}</h2><span className="items-badge">{t('itemCount', { count: number(items.length) })}</span></div>
    {items.length ? <>
      <div className="booking-items">{items.map(cartItem => {
        const service = services.find(item => item.id === cartItem.id);
        const item = service ?? extras.find(item => item.id === cartItem.id)!;
        const pet = pets.find(candidate => candidate.id === cartItem.petId) ?? pets[0];
        return <article className="booking-item" key={`${cartItem.petId}-${cartItem.id}`}>
          <img src={pet.image} alt="" />
          <div className="booking-item-content"><div className="booking-item-title"><div><h3>{t(`${cartItem.id}_${service ? 'cart' : 'title'}`)}</h3><small className="booking-item-pet">{petName(pet)}</small></div><strong><bdi>{money(item.price)}</bdi></strong></div><div className="booking-item-footer"><small className="booking-duration"><Icon name="clock" />{t('minutes', { count: item.minutes })}</small><button onClick={() => onRemove(cartItem)} aria-label={t('removeItem', { name: t(`${cartItem.id}_title`) })}>{t('remove')}</button></div></div>
        </article>;
      })}</div>
      <dl className="cost-breakdown"><div><dt>{t('subtotalShort')}</dt><dd><bdi>{money(totals.subtotal)}</bdi></dd></div><div><dt>{t('taxShort')}</dt><dd><bdi>{money(totals.tax)}</bdi></dd></div></dl>
      <div className="booking-total"><div><strong>{t('totalShort')}</strong><small>{t('due')}</small></div><strong className="total-price"><bdi>{money(totals.total)}</bdi></strong></div>
      <Button className="checkout-button" onClick={onCheckout}>{t('checkout')}<Icon name="arrow" className="directional" /></Button><Button className="draft-button" variant="secondary" onClick={onSave}>{t('saveDraft')}</Button>
    </> : <div className="empty-cart"><Icon name="bag" /><h3>{t('emptyCart')}</h3><p>{t('emptyCartBody', { name: emptyPetName })}</p><Button variant="secondary" onClick={onBrowse}>{t('browseServices')}</Button></div>}
  </section>;
}

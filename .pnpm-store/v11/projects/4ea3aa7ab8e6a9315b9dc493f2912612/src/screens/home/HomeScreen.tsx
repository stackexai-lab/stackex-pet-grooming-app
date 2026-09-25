import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { useLanguage } from '@/i18n';
import { calculateTotals, extras, initialCart, pets as initialPets, services, type CartItem, type Pet, type Service } from '@/mocks/home';
import { BookingCart } from './BookingCart';
import { PetSidebar } from './PetSidebar';
import { ServiceCard } from './ServiceCard';
import { useHomeFormat } from './useHomeFormat';
import './home.css';
import './typography.css';

type Overlay = 'pets' | 'cart' | 'addPet' | 'profile' | 'checkout' | null;

export function HomeScreen() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLanguage();
  const { petName, money, number } = useHomeFormat();
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [selectedId, setSelectedId] = useState('max');
  const [cart, setCart] = useState<CartItem[]>((initialCart.max ?? []).map(id => ({ id, petId: 'max' })));
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [service, setService] = useState<Service | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const pet = pets.find(item => item.id === selectedId)!;
  const totals = calculateTotals(cart.map(item => item.id));

  useEffect(() => { document.title = `${t('brand')} · ${t('homeTitle')}`; }, [t]);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(''), 5000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const selectPet = (id: string) => { setSelectedId(id); setOverlay(null); };
  const browse = () => { setOverlay(null); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); };
  const openService = (item: Service) => { setSelectedExtras(extras.filter(extra => cart.some(cartItem => cartItem.petId === selectedId && cartItem.id === extra.id)).map(extra => extra.id)); setService(item); };
  const addService = () => {
    if (!service) return;
    setCart(previous => [...previous.filter(item => item.petId !== selectedId || (item.id !== service.id && !extras.some(extra => extra.id === item.id))), { id: service.id, petId: selectedId }, ...selectedExtras.map(id => ({ id, petId: selectedId }))]);
    setService(null);
    setNotice(t('addedToCart', { name: petName(pet) }));
  };
  const saveDraft = () => {
    setOverlay(null);
    try {
      localStorage.setItem('pet-grooming-home-quote', JSON.stringify({ version: 1, pet, services: cart, totals, savedAt: new Date().toISOString() }));
      setNotice(t('draftSaved'));
    } catch { setNotice(t('storageError')); }
  };
  const addPet = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const breed = String(data.get('breed') ?? '').trim();
    if (!name || !breed) return;
    const species = data.get('species') === 'cat' ? 'cat' : 'dog';
    const newPet: Pet = { id: crypto.randomUUID(), name, breed, species, age: Number(data.get('age')), weight: Number(data.get('weight')), sex: data.get('sex') === 'female' ? 'female' : 'male', coat: species === 'cat' ? 'silky' : 'short', note: 'quiet', image: species === 'cat' ? '/images/service-cat.jpg' : '/images/golden-retriever.jpg' };
    setPets(previous => [...previous, newPet]); setSelectedId(newPet.id); setOverlay(null); setNotice(t('petAdded'));
  };
  const removePet = (id: string) => {
    if (pets.length <= 1) return;
    const remainingPets = pets.filter(item => item.id !== id);
    setPets(remainingPets);
    setCart(previous => previous.filter(item => item.petId !== id));
    if (id === selectedId) setSelectedId(remainingPets[0].id);
    setNotice(t('petRemoved'));
  };
  const petPanel = <PetSidebar pets={pets} selectedId={selectedId} onSelect={selectPet} onRemove={removePet} onAdd={() => setOverlay('addPet')} />;
  const cartPanel = <BookingCart items={cart} pets={pets} emptyPetName={petName(pet)} onRemove={item => { setCart(previous => previous.filter(candidate => candidate !== item)); setNotice(t('removedFromCart')); }} onCheckout={() => setOverlay('checkout')} onSave={saveDraft} onBrowse={browse} />;

  return <div className="home-app">
    <header className="app-header"><div className="header-inner">
      <a href="/" className="brand-lockup" aria-label={t('homeTitle')}><span className="brand-mark"><Icon name="paw" /></span><span><strong>{t('brand')}</strong><small>{t('brandTagline')}</small></span></a>
      <div className="header-actions"><label className="language-control"><Icon name="globe" /><span className="sr-only">{t('languageLabel')}</span><select value={locale} onChange={event => void setLocale(event.target.value as 'en' | 'ar')}><option value="en">{t('english')}</option><option value="ar">{t('arabic')}</option></select></label><span className="header-status" aria-hidden="true" /><button className="profile-button" onClick={() => setOverlay('profile')} aria-label={t('profileTitle')}><span className="profile-avatar"><Icon name="user" /></span><span className="profile-copy"><strong>{t('clientName')}</strong><small>{t('clientTier')}</small></span><Icon name="chevron" /></button></div>
    </div></header>
    <main className="home-layout">
      <aside className="desktop-pets">{petPanel}</aside>
      <section className="catalog" id="services" aria-label={t('servicesTitle')}>
        <h1 className="sr-only">{t('homeTitle')}</h1>
        <div className="mobile-pet-switch"><button onClick={() => setOverlay('pets')}><img src={pet.image} alt="" /><span><small>{t('myPets')}</small><strong><bdi>{petName(pet)}</bdi></strong></span><Icon name="chevron" /></button><span>{t('selectServices')}</span></div>
        <div className="hero-banner"><img src="/images/service-full-groom.jpg" alt={t('heroAlt')} fetchPriority="high" /></div>
        <div className="service-list">{services.map(item => <ServiceCard key={item.id} service={item} onOpen={() => openService(item)} />)}</div>
      </section>
      <aside className="desktop-cart">{cartPanel}</aside>
    </main>
    <div className="mobile-cart-bar"><div><small>{t('bookingFor', { name: petName(pet) })}</small><strong><bdi>{money(totals.total)}</bdi></strong></div><Button onClick={() => setOverlay('cart')}><Icon name="bag" />{t('cartMobile')}<span className="cart-count">{number(cart.length)}</span></Button></div>
    {notice && <div className="toast" role="status"><Icon name="check" /><span>{notice}</span><button className="icon-button" onClick={() => setNotice('')} aria-label={t('close')}><Icon name="close" /></button></div>}
    {overlay === 'pets' && <Modal title={t('myPets')} drawer="pets" onClose={() => setOverlay(null)}>{petPanel}</Modal>}
    {overlay === 'cart' && <Modal title={t('bookingFor', { name: petName(pet) })} drawer="cart" onClose={() => setOverlay(null)}>{cartPanel}</Modal>}
    {overlay === 'addPet' && <Modal title={t('addNewPet')} onClose={() => setOverlay(null)}><form onSubmit={addPet} className="pet-form"><label>{t('petName')}<input name="name" required maxLength={40} autoComplete="off" /></label><label>{t('breed')}<input name="breed" required maxLength={60} /></label><div className="form-grid"><label>{t('species')}<select name="species"><option value="dog">{t('dog')}</option><option value="cat">{t('cat')}</option></select></label><label>{t('sex')}<select name="sex"><option value="male">{t('male')}</option><option value="female">{t('female')}</option></select></label><label>{t('age')}<input name="age" type="number" min="0" max="40" step="0.1" required /></label><label>{t('weightKg')}<input name="weight" type="number" min="0.1" max="150" step="0.1" required /></label></div><div className="modal-actions"><Button variant="secondary" onClick={() => setOverlay(null)}>{t('cancel')}</Button><Button type="submit">{t('addNewPet')}</Button></div></form></Modal>}
    {overlay === 'profile' && <Modal title={t('profileTitle')} onClose={() => setOverlay(null)}><div className="profile-summary"><span className="profile-avatar"><Icon name="user" /></span><div><h3>{t('clientName')}</h3><p>{t('clientTier')}</p></div></div><p>{t('profileNote')}</p><p className="benefit-note"><Icon name="shield" />{t('profileBenefit')}</p><p className="muted-copy">{t('savedDraftHint')}</p><Button onClick={() => setOverlay(null)}>{t('done')}</Button></Modal>}
    {overlay === 'checkout' && <Modal title={t('checkoutTitle')} onClose={() => setOverlay(null)}><p className="preview-notice"><Icon name="info" />{t('frontendNotice')}</p><div className="checkout-pet"><img src={pet.image} alt="" /><div><strong>{t('bookingFor', { name: petName(pet) })}</strong><small>{t('itemCount', { count: cart.length })}</small></div></div><dl className="review-items">{cart.map(item => { const itemPet = pets.find(candidate => candidate.id === item.petId) ?? pet; return <div key={`${item.petId}-${item.id}`}><dt>{petName(itemPet)} · {t(`${item.id}_title`)}</dt><dd><bdi>{money([...services, ...extras].find(serviceItem => serviceItem.id === item.id)!.price)}</bdi></dd></div>; })}</dl><div className="booking-total"><strong>{t('total')}</strong><strong className="total-price"><bdi>{money(totals.total)}</bdi></strong></div><div className="modal-actions"><Button variant="secondary" onClick={() => setOverlay(null)}>{t('returnToServices')}</Button><Button onClick={saveDraft}>{t('saveDraft')}</Button></div></Modal>}
    {service && <Modal title={t(`${service.id}_title`)} onClose={() => setService(null)}><div className="service-modal-layout"><div className="service-modal-media"><img className="modal-service-image" src={service.image} alt={t('serviceImageAlt', { name: t(`${service.id}_title`) })} /></div><div className="service-modal-content"><div className="service-modal-meta"><span><Icon name="clock" />{t('minutes', { count: service.minutes })}</span><strong><bdi>{money(service.price)}</bdi></strong></div><p className="service-modal-description">{t(`${service.id}_description`)}</p><div className="service-modal-section"><h3>{t('included')}</h3><ul className="included-list">{t(`${service.id}_includes`).split(' · ').map(item => <li key={item}><Icon name="check" />{item}</li>)}</ul></div><div className="service-modal-section"><div className="extras-heading"><h3>{t('addOns')}</h3><small>{t('optional')}</small></div><div className="extra-options">{extras.map(extra => <label key={extra.id}><input type="checkbox" checked={selectedExtras.includes(extra.id)} onChange={event => setSelectedExtras(previous => event.target.checked ? [...previous, extra.id] : previous.filter(id => id !== extra.id))} /><span><strong>{t(`${extra.id}_title`)}</strong><small>{t(`${extra.id}_summary`)}</small></span><bdi>{money(extra.price)}</bdi></label>)}</div></div></div></div><div className="service-modal-footer"><small>{t('bookingFor', { name: petName(pet) })}</small><Button onClick={addService}>{t(cart.some(item => item.petId === selectedId && item.id === service.id) ? 'updateSession' : 'addToSession')}<span>·</span><bdi>{money(service.price + extras.filter(extra => selectedExtras.includes(extra.id)).reduce((sum, extra) => sum + extra.price, 0))}</bdi></Button></div></Modal>}
  </div>;
}

import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/ui/Icon';
import type { Pet } from '@/mocks/home';
import { useHomeFormat } from './useHomeFormat';

export function PetSidebar({ pets, selectedId, onSelect, onRemove, onAdd }: { pets: Pet[]; selectedId: string; onSelect: (id: string) => void; onRemove: (id: string) => void; onAdd: () => void }) {
  const { t } = useTranslation();
  const { number, petName } = useHomeFormat();
  return <section className="pets-panel" aria-label={t('myPets')}>
    <div className="section-heading"><h2>{t('myPets')} </h2></div>
    <div className="pet-list">{pets.map(pet => <div key={pet.id} className={`pet-card ${pet.id === selectedId ? 'is-selected' : ''}`} role="button" tabIndex={0} aria-pressed={pet.id === selectedId} aria-label={t('selectPet', { name: petName(pet) })} onClick={() => onSelect(pet.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(pet.id); } }}>
      <span className="pet-card-heading"><img src={pet.image} alt="" /><span className="pet-identity"><span className="pet-name"><bdi>{petName(pet)}</bdi></span><span className="pet-breed"><bdi>{pet.breedKey ? t(pet.breedKey) : pet.breed}</bdi> · {t('petAge', { age: number(pet.age) })}</span></span><span className="selection-dot">{pet.id === selectedId && <Icon name="check" />}</span></span>
      <button type="button" className="pet-remove-button" aria-label={t('removePet', { name: petName(pet) })} disabled={pets.length <= 1} onClick={event => { event.stopPropagation(); onRemove(pet.id); }} onKeyDown={event => event.stopPropagation()}><Icon name="close" /></button>
    </div>)}</div>
    <button className="add-pet-card" onClick={onAdd}><span className="add-pet-icon"><Icon name="plus" /></span><span><strong>{t('addNewPet')}</strong></span></button>
  </section>;
}

import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/ui/Icon';
import type { Service } from '@/mocks/home';
import { useHomeFormat } from './useHomeFormat';

export function ServiceCard({ service, onOpen }: { service: Service; onOpen: () => void }) {
  const { t } = useTranslation();
  const { money } = useHomeFormat();
  return <article className={`service-card service-card--${service.tone}`}>
    <img className="service-image" src={service.image} alt={t('serviceImageAlt', { name: t(`${service.id}_title`) })} loading="lazy" />
    <div className="service-description"><h2><button onClick={onOpen}>{t(`${service.id}_title`)}</button></h2><p>{t(`${service.id}_description`)}</p><div className="service-tags"><span><Icon name="clock" />{service.id === 'signature' ? t('signatureDuration') : t('minutes', { count: service.minutes })}</span>{service.id === 'signature' && <span>{t('allCoats')}</span>}</div></div>
    <div className="service-price"><div><strong><bdi>{money(service.price)}</bdi></strong><small>{t('standardRate')}</small></div><button className="service-action" onClick={onOpen}><Icon name="info" />{t('viewService')}</button></div>
  </article>;
}

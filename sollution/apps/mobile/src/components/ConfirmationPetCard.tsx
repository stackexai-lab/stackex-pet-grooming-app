import { useMemo, type ReactNode } from 'react';
import { Image, Text, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { cardShadow } from '@/components/ServiceCard';
import type { ConfirmationPetBooking } from '@/mocks/confirmation';
import { createStyles, useTheme, type Theme } from '@/theme';
import { useLanguage } from '@/i18n';

type ConfirmationPetCardProps = {
  booking: ConfirmationPetBooking;
};

export function ConfirmationPetCard({ booking }: ConfirmationPetCardProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(() => petCardStyles(theme), [theme]);
  const money = (value: number) => t('confirmation.money', { value: value.toFixed(2) });

  return (
    <View style={styles.card}>
      <View style={styles.petRow}>
        <View style={styles.avatarWrap}>
          <Image source={booking.photo} style={styles.avatar} resizeMode="cover" />
          <View style={styles.petBadge}>
            <MaterialIcons color={theme.colors.onSecondaryContainer} name="pets" size={10} />
          </View>
        </View>
        <View style={styles.petCopy}>
          <Text numberOfLines={1} style={styles.name}>{booking.name}</Text>
          <Text numberOfLines={1} style={styles.meta}>
            {t(booking.breedKey)}
          </Text>
        </View>
      </View>

      <LineItem
        icon={booking.serviceIcon === 'shower'
          ? <MaterialCommunityIcons color={theme.colors.onPrimaryFixed} name="shower-head" size={20} />
          : <MaterialIcons color={theme.colors.onPrimaryFixed} name="spa" size={20} />}
        iconStyle="warm"
        label={t('confirmation.servicePackage')}
        title={t(booking.serviceKey)}
        value={money(booking.servicePrice)}
        uppercase={!isRTL}
      />
      <LineItem
        icon={<MaterialIcons color={theme.colors.textSecondary} name="add-circle" size={20} />}
        iconStyle="muted"
        label={t('confirmation.addOns')}
        title={t(booking.addOnKey)}
        value={money(booking.addOnPrice)}
        uppercase={!isRTL}
      />

    </View>
  );
}

function LineItem({
  icon,
  iconStyle,
  label,
  title,
  value,
  uppercase,
}: {
  icon: ReactNode;
  iconStyle: 'warm' | 'muted';
  label: string;
  title: string;
  value: string;
  uppercase: boolean;
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => petCardStyles(theme), [theme]);

  return (
    <View style={styles.line}>
      <View style={[styles.lineIcon, iconStyle === 'warm' ? styles.iconWarm : styles.iconMuted]}>
        {icon}
      </View>
      <View style={styles.lineCopy}>
        <Text style={[styles.lineLabel, uppercase && styles.uppercase]}>{label}</Text>
        <Text numberOfLines={1} style={styles.lineTitle}>{title}</Text>
      </View>
      <Text style={styles.lineValue}>{value}</Text>
    </View>
  );
}

function petCardStyles(theme: Theme) {
  return createStyles((t) => ({
    card: {
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.card,
      gap: t.spacing.md,
      padding: t.spacing.gutter,
      ...cardShadow(t.colors.overlay),
    },
    petRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: t.spacing.md,
    },
    avatarWrap: {
      height: 56,
      width: 56,
    },
    avatar: {
      borderRadius: t.radii.pill,
      height: 56,
      width: 56,
    },
    petBadge: {
      alignItems: 'center',
      backgroundColor: t.colors.secondaryContainer,
      borderRadius: t.radii.pill,
      bottom: 0,
      height: 16,
      justifyContent: 'center',
      position: 'absolute',
      end: 0,
      width: 16,
    },
    petCopy: {
      flex: 1,
      minWidth: 0,
    },
    nameRow: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: t.spacing.sm,
    },
    name: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyBold,
      fontSize: t.typography.sizes.title,
      lineHeight: t.typography.lineHeights.title,
    },
    tag: {
      borderRadius: t.radii.pill,
      paddingHorizontal: t.spacing.sm,
      paddingVertical: 2,
    },
    tagVip: {
      backgroundColor: t.colors.primaryFixed,
    },
    tagGuest: {
      backgroundColor: t.colors.secondaryContainer,
    },
    tagLabel: {
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    tagVipLabel: {
      color: t.colors.onPrimaryFixed,
    },
    tagGuestLabel: {
      color: t.colors.onSecondaryContainer,
    },
    meta: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
      marginTop: 2,
    },
    line: {
      alignItems: 'center',
      backgroundColor: t.colors.surfaceSecondary,
      borderRadius: t.radii.input,
      flexDirection: 'row',
      gap: t.spacing.sm,
      padding: t.spacing.sm,
    },
    lineIcon: {
      alignItems: 'center',
      borderRadius: t.radii.pill,
      height: 36,
      justifyContent: 'center',
      width: 36,
    },
    iconWarm: {
      backgroundColor: t.colors.primaryFixed,
    },
    iconMuted: {
      backgroundColor: t.colors.surfaceVariant,
    },
    lineCopy: {
      flex: 1,
      minWidth: 0,
    },
    lineLabel: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      letterSpacing: 0.6,
      lineHeight: t.typography.lineHeights.overline,
    },
    uppercase: {
      textTransform: 'uppercase',
    },
    lineTitle: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    lineValue: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
  }), theme);
}

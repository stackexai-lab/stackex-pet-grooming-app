import { useMemo, type ReactNode } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { cardShadow } from '@/components/ServiceCard';
import type { GroomingService, HighlightIcon, ServiceIcon } from '@/mocks/services';
import { createStyles, useTheme, type Theme } from '@/theme';

type ServicePackageCardProps = {
  service: GroomingService;
  selected: boolean;
  onPress: () => void;
};

export function ServicePackageCard({ service, selected, onPress }: ServicePackageCardProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => packageStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected && styles.cardSelected, pressed && styles.pressed]}
    >
      <View style={styles.media}>
        <Image source={service.photo} style={styles.photo} resizeMode="cover" />
        {service.popular ? (
          <View style={styles.badge}>
            <MaterialIcons color={theme.colors.onTertiaryFixed} name="favorite" size={14} />
            <Text style={styles.badgeLabel}>{t('selectService.mostPopular')}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        <View style={styles.top}>
          <View style={styles.titleRow}>
            <ServiceGlyph color={theme.colors.primary} name={service.icon} />
            <Text numberOfLines={1} style={styles.title}>{t(service.titleKey)}</Text>
          </View>
          <View style={styles.priceCol}>
            <Text style={styles.price}>{t('home.price', { value: service.price })}</Text>
            <Text style={styles.duration}>{t('selectService.duration', { minutes: service.minutes })}</Text>
          </View>
        </View>
        <Text style={styles.description}>{t(service.descriptionKey)}</Text>
        <View style={styles.footer}>
          <View style={styles.highlight}>
            <HighlightGlyph color={theme.colors.secondary} name={service.highlightIcon} />
            <Text style={styles.highlightLabel}>{t(service.highlightKey)}</Text>
          </View>
          <View style={[styles.radio, selected ? styles.radioOn : styles.radioOff]}>
            <MaterialIcons
              color={selected ? theme.colors.primaryText : 'transparent'}
              name="check"
              size={16}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function ServiceGlyph({ color, name }: { color: string; name: ServiceIcon }) {
  if (name === 'shower') return <MaterialCommunityIcons color={color} name="shower-head" size={20} />;
  if (name === 'sparkle') return <MaterialIcons color={color} name="auto-awesome" size={20} />;
  if (name === 'pets') return <MaterialIcons color={color} name="pets" size={20} />;
  return <MaterialIcons color={color} name="content-cut" size={20} />;
}

function HighlightGlyph({ color, name }: { color: string; name: HighlightIcon }) {
  const icons: Record<HighlightIcon, ReactNode> = {
    spa: <MaterialIcons color={color} name="spa" size={16} />,
    verified: <MaterialIcons color={color} name="verified" size={16} />,
    paw: <MaterialCommunityIcons color={color} name="dog" size={16} />,
    quiet: <MaterialIcons color={color} name="volume-off" size={16} />,
  };
  return icons[name];
}

function packageStyles(theme: Theme) {
  return createStyles((t) => ({
    card: {
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.card,
      overflow: 'hidden',
      ...cardShadow(t.colors.overlay),
    },
    cardSelected: {
      elevation: 4,
      shadowOpacity: 0.12,
    },
    pressed: {
      opacity: 0.94,
    },
    media: {
      height: t.spacing.media,
      width: '100%',
    },
    photo: {
      height: '100%',
      width: '100%',
    },
    badge: {
      alignItems: 'center',
      backgroundColor: t.colors.tertiaryFixed,
      borderRadius: t.radii.pill,
      end: t.spacing.sm + 4,
      flexDirection: 'row',
      gap: t.spacing.xs,
      paddingHorizontal: t.spacing.sm,
      paddingVertical: 2,
      position: 'absolute',
      top: 12,
    },
    badgeLabel: {
      color: t.colors.onTertiaryFixed,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    body: {
      padding: t.spacing.gutter,
    },
    top: {
      flexDirection: 'row',
      gap: t.spacing.sm,
      justifyContent: 'space-between',
    },
    titleRow: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      gap: t.spacing.sm,
      minWidth: 0,
    },
    title: {
      color: t.colors.ink,
      flexShrink: 1,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.heading,
      lineHeight: t.typography.lineHeights.heading,
    },
    priceCol: {
      alignItems: 'flex-end',
    },
    price: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.heading,
      lineHeight: t.typography.lineHeights.heading,
    },
    duration: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    description: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
      marginTop: t.spacing.xs,
    },
    footer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: t.spacing.md,
    },
    highlight: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      gap: t.spacing.xs,
      minWidth: 0,
      paddingEnd: t.spacing.sm,
    },
    highlightLabel: {
      color: t.colors.secondary,
      flexShrink: 1,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    radio: {
      alignItems: 'center',
      borderRadius: t.radii.pill,
      height: 24,
      justifyContent: 'center',
      width: 24,
    },
    radioOn: {
      backgroundColor: t.colors.primary,
    },
    radioOff: {
      backgroundColor: t.colors.surfaceContainer,
    },
  }), theme);
}

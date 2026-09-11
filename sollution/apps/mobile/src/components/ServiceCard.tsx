import { useMemo } from 'react';
import { I18nManager, Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import type { PopularService } from '@/mocks/home';
import { createStyles, useTheme, type Theme } from '@/theme';

type ServiceCardProps = {
  service: PopularService;
  onPress?: () => void;
};

export function ServiceCard({ service, onPress }: ServiceCardProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => serviceCardStyles(theme), [theme]);
  const iconColor = service.tone === 'warm' ? theme.colors.onPrimaryFixed : theme.colors.onSecondaryContainer;
  const iconBg = service.tone === 'warm' ? styles.iconWarm : styles.iconCool;
  const forward = I18nManager.isRTL ? 'arrow-back' : 'arrow-forward';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, iconBg]}>
        {service.icon === 'shower' ? (
          <MaterialCommunityIcons color={iconColor} name="shower-head" size={20} />
        ) : (
          <MaterialIcons color={iconColor} name="content-cut" size={20} />
        )}
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{t(service.titleKey)}</Text>
        <Text style={styles.description}>{t(service.descriptionKey)}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.price}>{t('home.price', { value: service.price })}</Text>
        <View style={styles.arrow}>
          <MaterialIcons color={theme.colors.textSecondary} name={forward} size={14} />
        </View>
      </View>
    </Pressable>
  );
}

function serviceCardStyles(theme: Theme) {
  return createStyles((t) => ({
    card: {
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.card,
      flex: 1,
      justifyContent: 'space-between',
      minHeight: 168,
      padding: t.spacing.md,
      ...cardShadow(t.colors.overlay),
    },
    pressed: {
      backgroundColor: t.colors.surfaceSecondary,
    },
    iconWrap: {
      alignItems: 'center',
      borderRadius: t.radii.pill,
      height: t.spacing.icon,
      justifyContent: 'center',
      width: t.spacing.icon,
    },
    iconWarm: {
      backgroundColor: t.colors.primaryFixed,
    },
    iconCool: {
      backgroundColor: t.colors.secondaryContainer,
    },
    copy: {
      gap: t.spacing.xs,
      marginTop: t.spacing.sm,
    },
    title: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    description: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    footer: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: t.spacing.md,
    },
    price: {
      color: t.colors.primary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    arrow: {
      alignItems: 'center',
      backgroundColor: t.colors.surfaceSecondary,
      borderRadius: t.radii.pill,
      height: 24,
      justifyContent: 'center',
      width: 24,
    },
  }), theme);
}

export function cardShadow(color: string) {
  return {
    elevation: 2,
    shadowColor: color,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  };
}

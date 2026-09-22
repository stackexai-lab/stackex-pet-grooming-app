import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { createStyles, useTheme, type Theme } from '@/theme';
import { useLanguage } from '@/i18n';

type BookingProgressProps = {
  current: number;
  total: number;
  aside?: string;
  variant?: 'badge' | 'plain' | 'segments';
};

export function BookingProgress({
  current,
  total,
  aside,
  variant = 'badge',
}: BookingProgressProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(() => progressStyles(theme), [theme]);
  const progress = Math.min(current / total, 1);
  const plain = variant === 'plain';
  const segments = variant === 'segments';

  return (
    <View style={styles.wrap}>
      <View style={styles.meta}>
        <View style={styles.step}>
          {plain ? null : (
            <View style={styles.badge}>
              {segments ? (
                <MaterialIcons color={theme.colors.onSecondaryContainer} name="check" size={14} />
              ) : (
                <Text style={styles.badgeLabel}>{current}</Text>
              )}
            </View>
          )}
          <Text
            style={[
              styles.stepLabel,
              plain && styles.stepLabelPlain,
              plain && !isRTL && styles.uppercase,
            ]}
          >
            {t('selectPet.stepOf', { current, total })}
          </Text>
        </View>
        {segments ? (
          <View style={[styles.segments, { direction: isRTL ? 'rtl' : 'ltr' }]}>
            {Array.from({ length: total }, (_, index) => {
              const active = index === current - 1;
              return (
                <View
                  key={index}
                  style={[styles.segment, active ? styles.segmentActive : styles.segmentDone]}
                />
              );
            })}
          </View>
        ) : aside ? (
          <Text style={styles.flow}>{aside}</Text>
        ) : null}
      </View>
      {segments ? null : (
        <View style={[styles.track, { direction: isRTL ? 'rtl' : 'ltr' }]}>
          <View
            style={[
              styles.fill,
              plain && styles.fillPlain,
              { width: `${progress * 100}%` },
            ]}
          />
        </View>
      )}
    </View>
  );
}

function progressStyles(theme: Theme) {
  return createStyles((t) => ({
    wrap: {
      gap: t.spacing.sm,
      marginBottom: t.spacing.md,
    },
    meta: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    step: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: t.spacing.sm,
    },
    badge: {
      alignItems: 'center',
      backgroundColor: t.colors.secondaryContainer,
      borderRadius: t.radii.pill,
      height: 24,
      justifyContent: 'center',
      width: 24,
    },
    badgeLabel: {
      color: t.colors.onSecondaryContainer,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    stepLabel: {
      color: t.colors.secondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    stepLabelPlain: {
      color: t.colors.primary,
      fontSize: t.typography.sizes.overline,
      letterSpacing: 0.8,
      lineHeight: t.typography.lineHeights.overline,
    },
    uppercase: {
      textTransform: 'uppercase',
    },
    flow: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    track: {
      backgroundColor: t.colors.surfaceHigh,
      borderRadius: t.radii.pill,
      height: t.spacing.track,
      overflow: 'hidden',
      width: '100%',
    },
    fill: {
      alignSelf: 'flex-start',
      backgroundColor: t.colors.primary,
      borderRadius: t.radii.pill,
      height: '100%',
    },
    fillPlain: {
      backgroundColor: t.colors.primary,
    },
    segments: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    segment: {
      borderRadius: t.radii.pill,
      height: t.spacing.track,
    },
    segmentDone: {
      backgroundColor: t.colors.secondary,
      width: 24,
    },
    segmentActive: {
      backgroundColor: t.colors.primary,
      width: 32,
    },
  }), theme);
}

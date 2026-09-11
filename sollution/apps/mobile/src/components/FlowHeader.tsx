import { useMemo } from 'react';
import { Image, Pressable, Text, View, I18nManager } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { homeImages } from '@/mocks/home';
import { createStyles, useTheme, type Theme } from '@/theme';

type FlowHeaderProps = {
  insetTop: number;
  title: string;
  dashedBack?: boolean;
  elevatedBack?: boolean;
  brandedLogo?: boolean;
};

export function FlowHeader({ insetTop, title, dashedBack, elevatedBack, brandedLogo }: FlowHeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => flowHeaderStyles(theme), [theme]);
  const backIcon = I18nManager.isRTL ? 'arrow-forward' : 'arrow-back';

  return (
    <View style={[styles.wrap, { paddingTop: insetTop }]}>
      <View style={styles.row}>
        <View style={styles.leading}>
          <View style={dashedBack ? styles.backHalo : undefined}>
            <Pressable
              accessibilityLabel={t('back')}
              accessibilityRole="button"
              hitSlop={8}
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.back,
                dashedBack && styles.backDashed,
                elevatedBack && styles.backElevated,
                pressed && styles.pressed,
              ]}
            >
              <MaterialIcons color={theme.colors.ink} name={backIcon} size={20} />
            </Pressable>
          </View>
          {brandedLogo ? (
            <View style={styles.logoMark}>
              <Image source={homeImages.logo} style={styles.logoBadge} resizeMode="contain" />
            </View>
          ) : (
            <Image source={homeImages.logo} style={styles.logo} resizeMode="contain" />
          )}
          <Text numberOfLines={1} style={styles.title}>{title}</Text>
        </View>
        <Pressable
          accessibilityLabel={t('home.profile')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
        >
          <MaterialIcons color={theme.colors.primaryText} name="person" size={20} />
        </Pressable>
      </View>
    </View>
  );
}

function flowHeaderStyles(theme: Theme) {
  return createStyles((t) => ({
    wrap: {
      backgroundColor: t.colors.background,
    },
    row: {
      alignItems: 'center',
      flexDirection: 'row',
      height: t.spacing.header,
      justifyContent: 'space-between',
      paddingHorizontal: t.spacing.gutter,
    },
    leading: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      gap: t.spacing.sm,
      minWidth: 0,
      paddingEnd: t.spacing.sm,
    },
    back: {
      alignItems: 'center',
      borderRadius: t.radii.pill,
      height: 44,
      justifyContent: 'center',
      marginStart: -t.spacing.xs,
      width: 44,
    },
    backHalo: {
      borderColor: t.colors.highlightBorder,
      borderRadius: t.radii.pill,
      borderStyle: 'dashed',
      borderWidth: 2,
      marginStart: -t.spacing.xs,
      padding: 3,
    },
    backDashed: {
      backgroundColor: t.colors.surface,
      height: 40,
      marginStart: 0,
      width: 40,
    },
    backElevated: {
      backgroundColor: t.colors.surface,
      elevation: 2,
      height: 40,
      marginStart: 0,
      shadowColor: t.colors.overlay,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      width: 40,
    },
    logo: {
      borderRadius: t.radii.input,
      height: 28,
      width: 36,
    },
    logoMark: {
      alignItems: 'center',
      backgroundColor: t.colors.logoWash,
      borderColor: t.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      height: 32,
      justifyContent: 'center',
      overflow: 'hidden',
      width: 32,
    },
    logoBadge: {
      height: 24,
      width: 24,
    },
    title: {
      color: t.colors.ink,
      flexShrink: 1,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.heading,
      letterSpacing: -0.4,
      lineHeight: t.typography.lineHeights.heading,
    },
    avatar: {
      alignItems: 'center',
      backgroundColor: t.colors.primary,
      borderRadius: t.radii.pill,
      height: 36,
      justifyContent: 'center',
      width: 36,
    },
    pressed: {
      opacity: 0.85,
    },
  }), theme);
}

import { useMemo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { homeImages } from '@/mocks/home';
import { createStyles, useTheme, type Theme } from '@/theme';

type AppHeaderProps = {
  insetTop: number;
};

export function AppHeader({ insetTop }: AppHeaderProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => headerStyles(theme), [theme]);

  return (
    <View style={[styles.wrap, { paddingTop: insetTop }]}>
      <View style={styles.row}>
        <View style={styles.brand}>
          <Image source={homeImages.logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>{t('appName')}</Text>
        </View>
        <Pressable
          accessibilityLabel={t('home.profile')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
        >
          <MaterialIcons color={theme.colors.primaryText} name="person" size={18} />
        </Pressable>
      </View>
    </View>
  );
}

function headerStyles(theme: Theme) {
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
    brand: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: t.spacing.sm,
    },
    logo: {
      height: 32,
      width: 40,
    },
    title: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.heading,
      letterSpacing: -0.4,
      lineHeight: t.typography.lineHeights.heading,
    },
    avatar: {
      alignItems: 'center',
      backgroundColor: t.colors.primary,
      borderRadius: t.radii.pill,
      height: 32,
      justifyContent: 'center',
      width: 32,
    },
    pressed: {
      opacity: 0.85,
    },
  }), theme);
}

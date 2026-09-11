import { useMemo } from 'react';
import { I18nManager, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { createStyles, useTheme, type Theme } from '@/theme';

type CenterHeaderProps = {
  insetTop: number;
  title: string;
  plain?: boolean;
};

export function CenterHeader({ insetTop, title, plain }: CenterHeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => centerHeaderStyles(theme), [theme]);
  const backIcon = I18nManager.isRTL ? 'arrow-forward' : 'arrow-back';

  return (
    <View style={[styles.wrap, { paddingTop: insetTop }]}>
      <View style={styles.row}>
        <Pressable
          accessibilityLabel={t('back')}
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.back, !plain && styles.backDashed, pressed && styles.pressed]}
        >
          <MaterialIcons color={theme.colors.ink} name={backIcon} size={20} />
        </Pressable>
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
        <View style={styles.spacer} />
      </View>
    </View>
  );
}

function centerHeaderStyles(theme: Theme) {
  return createStyles((t) => ({
    wrap: {
      backgroundColor: t.colors.background,
    },
    row: {
      alignItems: 'center',
      flexDirection: 'row',
      height: t.spacing.header,
      paddingHorizontal: t.spacing.gutter,
    },
    back: {
      alignItems: 'center',
      borderRadius: t.radii.pill,
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    backDashed: {
      borderColor: t.colors.primaryBorder,
      borderStyle: 'dashed',
      borderWidth: 1,
    },
    title: {
      color: t.colors.ink,
      flex: 1,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.heading,
      lineHeight: t.typography.lineHeights.heading,
      textAlign: 'center',
    },
    spacer: {
      width: 44,
    },
    pressed: {
      opacity: 0.85,
    },
  }), theme);
}

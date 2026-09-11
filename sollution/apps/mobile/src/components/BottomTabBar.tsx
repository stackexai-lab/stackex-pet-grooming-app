import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { createStyles, useTheme, type Theme } from '@/theme';

type TabKey = 'home' | 'bookings';

const tabs: { key: TabKey; icon: keyof typeof MaterialIcons.glyphMap; labelKey: `tabs.${TabKey}`; badge?: boolean }[] = [
  { key: 'home', icon: 'pets', labelKey: 'tabs.home' },
  { key: 'bookings', icon: 'calendar-today', labelKey: 'tabs.bookings', badge: true },
];

type BottomTabBarProps = {
  active: TabKey;
  insetBottom: number;
};

export function BottomTabBar({ active, insetBottom }: BottomTabBarProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = useMemo(() => tabBarStyles(theme), [theme]);

  return (
    <View style={[styles.wrap, { paddingBottom: insetBottom }]}>
      <View style={styles.row}>
        {tabs.map((tab) => {
          const selected = tab.key === active;
          const color = selected ? theme.colors.primary : theme.colors.textSecondary;

          return (
            <Pressable
              accessibilityLabel={t(tab.labelKey)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              key={tab.key}
              onPress={() => {
                if (tab.key === 'home') router.push('/');
                if (tab.key === 'bookings') router.push('/booking-history');
              }}
              style={styles.item}
            >
              <View>
                <MaterialIcons color={color} name={tab.icon} size={24} />
                {tab.badge ? <View style={styles.badge} /> : null}
              </View>
              <Text style={[styles.label, { color }]}>{t(tab.labelKey)}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function tabBarStyles(theme: Theme) {
  return createStyles((t) => ({
    wrap: {
      backgroundColor: t.colors.background,
      borderTopColor: t.colors.border,
      borderTopWidth: 0,
      elevation: 8,
      shadowColor: t.colors.overlay,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
    },
    row: {
      alignItems: 'center',
      flexDirection: 'row',
      height: t.spacing.tabBar,
      justifyContent: 'space-around',
      paddingHorizontal: t.spacing.gutter,
    },
    item: {
      alignItems: 'center',
      gap: t.spacing.xs,
      minHeight: 44,
      minWidth: 56,
    },
    label: {
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    badge: {
      backgroundColor: t.colors.primaryContainer,
      borderRadius: t.radii.pill,
      height: 8,
      position: 'absolute',
      right: -6,
      top: -2,
      width: 8,
    },
  }), theme);
}

import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme';

export function HeaderBrand() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', flexShrink: 0, gap: theme.spacing.sm }}>
      <Text style={{ color: theme.colors.ink, fontFamily: theme.typography.fontFamilies.bodyMedium, fontSize: theme.typography.sizes.heading }}>
        {t('appName')}
      </Text>
    </View>
  );
}

import { useMemo } from 'react';
import { View } from 'react-native';

import { HeaderBrand } from './HeaderBrand';
import { createStyles, useTheme, type Theme } from '@/theme';

type AppHeaderProps = {
  insetTop: number;
  showProfile?: boolean;
};

export function AppHeader({ insetTop }: AppHeaderProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => headerStyles(theme), [theme]);

  return (
    <View style={[styles.wrap, { paddingTop: insetTop }]}>
      <View style={styles.row}>
        <HeaderBrand />
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
      justifyContent: 'flex-end',
      paddingHorizontal: t.spacing.gutter,
    },
  }), theme);
}

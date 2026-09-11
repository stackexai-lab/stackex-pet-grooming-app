import { useMemo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import type { Pet } from '@/mocks/pets';
import { cardShadow } from '@/components/ServiceCard';
import { createStyles, useTheme, type Theme } from '@/theme';

const sizeKeys = {
  small: 'selectPet.sizeSmall',
  medium: 'selectPet.sizeMedium',
  large: 'selectPet.sizeLarge',
} as const;

type PetSelectCardProps = {
  pet: Pet;
  selected: boolean;
  onPress: () => void;
};

export function PetSelectCard({ pet, selected, onPress }: PetSelectCardProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => petCardStyles(theme), [theme]);
  const breed = pet.breedKey ? t(pet.breedKey) : pet.breed ?? '';
  const size = t(sizeKeys[pet.size]);
  const details = pet.weightLbs
    ? t('selectPet.details', { breed, size, weight: pet.weightLbs })
    : t('selectPet.detailsSizeOnly', { breed, size });
  const meta = pet.lastGroomedWeeks
    ? t('selectPet.lastGroomedWeeks', { count: pet.lastGroomedWeeks })
    : pet.noteKey
      ? t(pet.noteKey)
      : null;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected && styles.cardSelected, pressed && styles.pressed]}
    >
      <View style={[styles.accent, selected && styles.accentOn]} />
      {pet.photo ? (
        <Image source={pet.photo} style={[styles.photo, selected && styles.photoSelected]} resizeMode="cover" />
      ) : (
        <View style={[styles.photo, styles.photoFallback, selected && styles.photoSelected]}>
          <MaterialIcons color={theme.colors.primary} name="pets" size={28} />
        </View>
      )}
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.name}>{pet.name}</Text>
        <Text numberOfLines={1} style={styles.details}>{details}</Text>
        <View style={styles.metaRow}>
          <View style={[styles.species, selected ? styles.speciesOn : styles.speciesOff]}>
            {pet.species === 'cat' ? (
              <MaterialCommunityIcons
                color={selected ? theme.colors.onPrimaryFixedVariant : theme.colors.textSecondary}
                name="cat"
                size={13}
              />
            ) : (
              <MaterialIcons
                color={selected ? theme.colors.onPrimaryFixedVariant : theme.colors.textSecondary}
                name="pets"
                size={13}
              />
            )}
            <Text style={[styles.speciesLabel, selected ? styles.speciesLabelOn : styles.speciesLabelOff]}>
              {t(pet.species === 'cat' ? 'selectPet.cat' : 'selectPet.dog')}
            </Text>
          </View>
          {meta ? (
            <Text numberOfLines={1} style={[styles.note, selected && styles.noteOn]}>{meta}</Text>
          ) : null}
        </View>
      </View>
      <View style={[styles.check, selected ? styles.checkOn : styles.checkOff]}>
        <MaterialIcons
          color={selected ? theme.colors.primaryText : 'transparent'}
          name="check"
          size={18}
        />
      </View>
    </Pressable>
  );
}

function petCardStyles(theme: Theme) {
  return createStyles((t) => ({
    card: {
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderRadius: t.radii.card,
      flexDirection: 'row',
      overflow: 'hidden',
      padding: t.spacing.md,
      paddingStart: t.spacing.md + t.spacing.xs,
      ...cardShadow(t.colors.overlay),
    },
    cardSelected: {},
    pressed: {
      opacity: 0.92,
    },
    accent: {
      backgroundColor: 'transparent',
      bottom: 0,
      position: 'absolute',
      start: 0,
      top: 0,
      width: t.spacing.track,
    },
    accentOn: {
      backgroundColor: t.colors.primaryContainer,
    },
    photo: {
      borderRadius: t.radii.pill,
      height: t.spacing.portrait,
      width: t.spacing.portrait,
    },
    photoSelected: {
      borderColor: `${t.colors.primaryContainer}33`,
      borderWidth: 2,
    },
    photoFallback: {
      alignItems: 'center',
      backgroundColor: t.colors.surfaceSecondary,
      justifyContent: 'center',
    },
    copy: {
      flex: 1,
      minWidth: 0,
      paddingEnd: t.spacing.xs,
      paddingStart: t.spacing.md,
    },
    name: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.heading,
      lineHeight: t.typography.lineHeights.heading,
    },
    details: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
      marginTop: 2,
    },
    metaRow: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: t.spacing.sm,
      marginTop: t.spacing.sm,
    },
    species: {
      alignItems: 'center',
      borderRadius: t.radii.pill,
      flexDirection: 'row',
      gap: t.spacing.xs,
      paddingHorizontal: 10,
      paddingVertical: 2,
    },
    speciesOn: {
      backgroundColor: t.colors.primaryFixed,
    },
    speciesOff: {
      backgroundColor: t.colors.surfaceHigh,
    },
    speciesLabel: {
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    speciesLabelOn: {
      color: t.colors.onPrimaryFixedVariant,
    },
    speciesLabelOff: {
      color: t.colors.textSecondary,
    },
    note: {
      color: t.colors.textSecondary,
      flexShrink: 1,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
    },
    noteOn: {
      color: t.colors.secondary,
    },
    check: {
      alignItems: 'center',
      borderRadius: t.radii.pill,
      height: 28,
      justifyContent: 'center',
      width: 28,
    },
    checkOn: {
      backgroundColor: t.colors.primaryContainer,
    },
    checkOff: {
      backgroundColor: t.colors.surfaceHigh,
    },
  }), theme);
}

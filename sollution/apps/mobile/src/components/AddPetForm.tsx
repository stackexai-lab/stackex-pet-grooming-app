import { useMemo, type ReactNode } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import type { PetSize, PetSpecies } from '@/mocks/pets';
import { createStyles, useTheme, type Theme } from '@/theme';
import { useLanguage } from '@/i18n';

export type NewPetDraft = {
  name: string;
  breed: string;
  species: PetSpecies;
  size: PetSize;
};

type AddPetFormProps = {
  draft: NewPetDraft;
  onChange: (draft: NewPetDraft) => void;
  onClose: () => void;
};

const sizeTitleKeys = {
  small: 'selectPet.sizeSmall',
  medium: 'selectPet.sizeMedium',
  large: 'selectPet.sizeLarge',
} as const;

const sizeRangeKeys = {
  small: 'selectPet.rangeSmall',
  medium: 'selectPet.rangeMedium',
  large: 'selectPet.rangeLarge',
} as const;

export function AddPetForm({ draft, onChange, onClose }: AddPetFormProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(() => addPetStyles(theme), [theme]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{t('selectPet.petProfile')}</Text>
          <Text style={styles.hint}>{t('selectPet.profileHint')}</Text>
        </View>
        <Pressable
          accessibilityLabel={t('selectPet.close')}
          onPress={onClose}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <MaterialIcons color={theme.colors.textSecondary} name="close" size={18} />
        </Pressable>
      </View>

      <Text style={[styles.label, isRTL && styles.labelRtl]}>{t('selectPet.species')}</Text>
      <View style={styles.speciesRow}>
        <SpeciesChip
          active={draft.species === 'dog'}
          icon={<MaterialIcons color={chipColor(theme, draft.species === 'dog')} name="pets" size={18} />}
          label={t('selectPet.dog')}
          onPress={() => onChange({ ...draft, species: 'dog' })}
        />
        <SpeciesChip
          active={draft.species === 'cat'}
          icon={<MaterialCommunityIcons color={chipColor(theme, draft.species === 'cat')} name="cat" size={18} />}
          label={t('selectPet.cat')}
          onPress={() => onChange({ ...draft, species: 'cat' })}
        />
      </View>

      <Text style={[styles.label, isRTL && styles.labelRtl]}>{t('selectPet.petName')}</Text>
      <View style={styles.field}>
        <TextInput
          onChangeText={(name) => onChange({ ...draft, name })}
          placeholder={t('selectPet.petNamePlaceholder')}
          placeholderTextColor={theme.colors.border}
          style={styles.input}
          underlineColorAndroid="transparent"
          value={draft.name}
        />
        <MaterialIcons color={theme.colors.textMuted} name="edit" size={20} />
      </View>

      <Text style={[styles.label, isRTL && styles.labelRtl]}>{t('selectPet.breed')}</Text>
      <View style={styles.field}>
        <TextInput
          onChangeText={(breed) => onChange({ ...draft, breed })}
          placeholder={t('selectPet.breedPlaceholder')}
          placeholderTextColor={theme.colors.border}
          style={styles.input}
          underlineColorAndroid="transparent"
          value={draft.breed}
        />
      </View>

      <Text style={[styles.label, isRTL && styles.labelRtl]}>{t('selectPet.weightClass')}</Text>
      <View style={styles.sizeRow}>
        {(Object.keys(sizeTitleKeys) as PetSize[]).map((size) => {
          const active = draft.size === size;
          return (
            <Pressable
              key={size}
              onPress={() => onChange({ ...draft, size })}
              style={({ pressed }) => [styles.sizeChip, active && styles.sizeChipOn, pressed && styles.pressed]}
            >
              <Text style={[styles.sizeTitle, active && styles.sizeTitleOn]}>
                {t(sizeTitleKeys[size])}
              </Text>
              <Text style={[styles.sizeRange, active && styles.sizeTitleOn]}>
                {t(sizeRangeKeys[size])}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SpeciesChip({
  active,
  icon,
  label,
  onPress,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => addPetStyles(theme), [theme]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.speciesChip, active && styles.speciesChipOn, pressed && styles.pressed]}
    >
      {icon}
      <Text style={[styles.speciesLabel, active && styles.speciesLabelOn]}>{label}</Text>
    </Pressable>
  );
}

function chipColor(theme: Theme, active: boolean) {
  return active ? theme.colors.onPrimaryFixedVariant : theme.colors.textSecondary;
}

function addPetStyles(theme: Theme) {
  return createStyles((t) => ({
    card: {
      backgroundColor: t.colors.surface,
      paddingHorizontal: t.spacing.gutter,
      paddingBottom: t.spacing.sm,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: t.spacing.md,
    },
    headerCopy: {
      flex: 1,
      minWidth: 0,
    },
    title: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.heading,
      lineHeight: t.typography.lineHeights.heading,
    },
    hint: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    iconButton: {
      alignItems: 'center',
      backgroundColor: t.colors.surfaceSecondary,
      borderRadius: t.radii.pill,
      height: 32,
      justifyContent: 'center',
      width: 32,
    },
    label: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      letterSpacing: 0.8,
      lineHeight: t.typography.lineHeights.overline,
      marginBottom: t.spacing.xs,
      textTransform: 'uppercase',
    },
    labelRtl: {
      letterSpacing: 0,
      textTransform: 'none',
    },
    speciesRow: {
      flexDirection: 'row',
      gap: t.spacing.sm,
      marginBottom: t.spacing.md,
    },
    speciesChip: {
      alignItems: 'center',
      backgroundColor: t.colors.surfaceHigh,
      borderRadius: t.radii.pill,
      flex: 1,
      flexDirection: 'row',
      gap: t.spacing.sm,
      justifyContent: 'center',
      paddingHorizontal: t.spacing.md,
      paddingVertical: 10,
    },
    speciesChipOn: {
      backgroundColor: t.colors.primaryFixed,
    },
    speciesLabel: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    speciesLabelOn: {
      color: t.colors.onPrimaryFixedVariant,
    },
    field: {
      alignItems: 'center',
      backgroundColor: t.colors.surfaceSecondary,
      borderRadius: t.radii.input,
      flexDirection: 'row',
      height: t.spacing.control,
      marginBottom: t.spacing.md,
      paddingEnd: t.spacing.md,
      paddingStart: t.spacing.md,
    },
    input: {
      color: t.colors.ink,
      flex: 1,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.label,
      height: t.spacing.control,
      paddingVertical: 0,
    },
    sizeRow: {
      flexDirection: 'row',
      gap: t.spacing.xs,
      marginBottom: t.spacing.sm,
    },
    sizeChip: {
      alignItems: 'center',
      backgroundColor: t.colors.surfaceHigh,
      borderRadius: t.radii.input,
      flex: 1,
      paddingHorizontal: t.spacing.xs,
      paddingVertical: 10,
    },
    sizeChipOn: {
      backgroundColor: t.colors.primaryFixed,
    },
    sizeTitle: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    sizeTitleOn: {
      color: t.colors.onPrimaryFixedVariant,
    },
    sizeRange: {
      color: t.colors.textMuted,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.overline,
      lineHeight: t.typography.lineHeights.overline,
      marginTop: 2,
      opacity: 0.85,
    },
    pressed: {
      opacity: 0.88,
    },
  }), theme);
}

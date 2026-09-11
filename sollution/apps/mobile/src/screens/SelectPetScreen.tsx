import { useMemo, useRef, useState } from 'react';
import {
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddPetForm, type NewPetDraft } from '@/components/AddPetForm';
import { BookingProgress } from '@/components/BookingProgress';
import { FlowHeader } from '@/components/FlowHeader';
import { PetSelectCard } from '@/components/PetSelectCard';
import { cardShadow } from '@/components/ServiceCard';
import { initialPets, type Pet } from '@/mocks/pets';
import { createStyles, useTheme, type Theme } from '@/theme';

const emptyDraft: NewPetDraft = {
  name: '',
  breed: '',
  species: 'dog',
  size: 'medium',
};

export function SelectPetScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => selectPetStyles(theme), [theme]);
  const scrollRef = useRef<ScrollView>(null);
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [selectedId, setSelectedId] = useState(initialPets[0]?.id);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<NewPetDraft>(emptyDraft);
  const forward = I18nManager.isRTL ? 'arrow-back' : 'arrow-forward';

  function openAddForm() {
    if (adding) {
      closeAddForm();
      return;
    }

    setAdding(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }

  function closeAddForm() {
    setAdding(false);
    setDraft(emptyDraft);
  }

  function savePet() {
    const name = draft.name.trim();
    if (!name) return;

    const pet: Pet = {
      id: `pet-${Date.now()}`,
      name,
      breed: draft.breed.trim() || undefined,
      species: draft.species,
      size: draft.size,
    };

    setPets((current) => [...current, pet]);
    setSelectedId(pet.id);
    closeAddForm();
  }

  return (
    <View style={styles.screen}>
      <FlowHeader insetTop={insets.top} title={t('selectPet.title')} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
        >
          <BookingProgress aside={t('selectPet.bookingFlow')} current={2} total={4} />
          <View style={styles.intro}>
            <Text style={styles.headline}>{t('selectPet.headline')}</Text>
            <Text style={styles.subtitle}>{t('selectPet.subtitle')}</Text>
          </View>
          <View style={styles.list}>
            {pets.map((pet) => (
              <PetSelectCard
                key={pet.id}
                onPress={() => setSelectedId(pet.id)}
                pet={pet}
                selected={pet.id === selectedId}
              />
            ))}
            <Pressable
              onPress={openAddForm}
              style={({ pressed }) => [styles.add, adding && styles.addOpen, pressed && styles.pressed]}
            >
              <View style={styles.addIcon}>
                <MaterialIcons color={theme.colors.onTertiaryFixed} name={adding ? 'remove' : 'add'} size={20} />
              </View>
              <Text style={styles.addLabel}>{t('selectPet.addNewPet')}</Text>
            </Pressable>
            {adding ? (
              <AddPetForm
                draft={draft}
                onChange={setDraft}
                onClose={closeAddForm}
                onSave={savePet}
              />
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing.md) }]}>
        <Pressable
          accessibilityRole="button"
          disabled={!selectedId}
          onPress={() => router.push('/select-service')}
          style={({ pressed }) => [styles.continue, pressed && styles.continuePressed]}
        >
          <Text style={styles.continueLabel}>{t('selectPet.continueToServices')}</Text>
          <MaterialIcons color={theme.colors.primaryText} name={forward} size={20} />
        </Pressable>
      </View>
    </View>
  );
}

function selectPetStyles(theme: Theme) {
  return createStyles((t) => ({
    screen: {
      backgroundColor: t.colors.background,
      flex: 1,
    },
    flex: {
      flex: 1,
    },
    content: {
      paddingBottom: t.spacing.xxl,
      paddingHorizontal: t.spacing.gutter,
      paddingTop: t.spacing.sm,
    },
    intro: {
      marginBottom: t.spacing.xl,
      marginTop: t.spacing.xl,
    },
    headline: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.display,
      fontSize: t.typography.sizes.headline,
      letterSpacing: -0.2,
      lineHeight: t.typography.lineHeights.headline,
    },
    subtitle: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
      marginTop: t.spacing.xs,
    },
    list: {
      gap: t.spacing.md,
    },
    add: {
      alignItems: 'center',
      backgroundColor: t.colors.surfaceSecondary,
      borderRadius: t.radii.card,
      flexDirection: 'row',
      gap: t.spacing.sm,
      justifyContent: 'center',
      padding: t.spacing.md,
      ...cardShadow(t.colors.overlay),
    },
    addOpen: {
      backgroundColor: t.colors.surfaceHigh,
    },
    addIcon: {
      alignItems: 'center',
      backgroundColor: t.colors.tertiaryFixed,
      borderRadius: t.radii.pill,
      height: 32,
      justifyContent: 'center',
      width: 32,
    },
    addLabel: {
      color: t.colors.primary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    footer: {
      backgroundColor: t.colors.background,
      borderTopColor: t.colors.surfaceHigh,
      borderTopWidth: 1,
      paddingHorizontal: t.spacing.gutter,
      paddingTop: t.spacing.md,
    },
    continue: {
      alignItems: 'center',
      backgroundColor: t.colors.primaryContainer,
      borderRadius: t.radii.button,
      flexDirection: 'row',
      gap: t.spacing.sm,
      height: t.spacing.control,
      justifyContent: 'center',
    },
    continuePressed: {
      transform: [{ scale: 0.98 }],
    },
    continueLabel: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    pressed: {
      opacity: 0.9,
    },
  }), theme);
}

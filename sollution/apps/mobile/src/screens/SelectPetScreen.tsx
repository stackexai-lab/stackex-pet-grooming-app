import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  I18nManager,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
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
  const { height: windowHeight } = useWindowDimensions();
  const { theme } = useTheme();
  const styles = useMemo(() => selectPetStyles(theme), [theme]);
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [selectedId, setSelectedId] = useState(initialPets[0]?.id);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<NewPetDraft>(emptyDraft);
  const canSavePet = draft.name.trim().length > 0;
  const forward = I18nManager.isRTL ? 'arrow-back' : 'arrow-forward';
  const sheetHeight = Math.round(windowHeight * 0.76);
  const dim = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(1)).current;
  const closing = useRef(false);

  useEffect(() => {
    if (!adding) return;

    closing.current = false;
    Animated.parallel([
      Animated.timing(dim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 340,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [adding, dim, slide]);

  function openAddForm() {
    dim.setValue(0);
    slide.setValue(1);
    setAdding(true);
  }

  function closeAddForm() {
    if (!adding || closing.current) return;
    closing.current = true;
    Animated.parallel([
      Animated.timing(dim, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 1,
        duration: 260,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) return;
      setAdding(false);
      setDraft(emptyDraft);
      closing.current = false;
    });
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

  function removePet(pet: Pet) {
    Alert.alert(t('selectPet.remove'), t('selectPet.removeConfirm', { name: pet.name }), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('selectPet.remove'),
        style: 'destructive',
        onPress: () => {
          const next = pets.filter((item) => item.id !== pet.id);
          setPets(next);
          if (selectedId === pet.id) setSelectedId(next[0]?.id);
        },
      },
    ]);
  }

  function continueBooking() {
    if (!selectedId) return;
    router.push('/select-service');
  }

  return (
    <View style={styles.screen}>
      <FlowHeader elevatedBack insetTop={insets.top} title={t('selectPet.title')} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        style={styles.flex}
      >
          <BookingProgress aside={t('booking.nextService')} current={1} total={4} />
          <View style={styles.intro}>
            <Text style={styles.headline}>{t('selectPet.headline')}</Text>
            <Text style={styles.subtitle}>{t('selectPet.subtitle')}</Text>
          </View>
          <View style={styles.list}>
            {pets.length === 0 ? (
              <Text style={styles.empty}>{t('selectPet.empty')}</Text>
            ) : (
              pets.map((pet) => (
                <PetSelectCard
                  key={pet.id}
                  onPress={() => setSelectedId(pet.id)}
                  onRemove={() => removePet(pet)}
                  pet={pet}
                  selected={pet.id === selectedId}
                />
              ))
            )}
          </View>
        </ScrollView>
      {adding ? null : (
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing.md) }]}>
        <Pressable
          accessibilityRole="button"
          onPress={openAddForm}
          style={({ pressed }) => [styles.add, pressed && styles.pressed]}
        >
          <MaterialIcons color={theme.colors.primary} name="add" size={20} />
          <Text style={styles.addLabel}>{t('selectPet.addNewPet')}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={!selectedId}
          onPress={continueBooking}
          style={({ pressed }) => [
            styles.continue,
            !selectedId && styles.continueDisabled,
            pressed && selectedId && styles.continuePressed,
          ]}
        >
          <Text style={styles.continueLabel}>{t('selectPet.continueToServices')}</Text>
          <MaterialIcons color={theme.colors.primaryText} name={forward} size={20} />
        </Pressable>
      </View>
      )}
      <Modal
        animationType="none"
        onRequestClose={closeAddForm}
        presentationStyle="overFullScreen"
        statusBarTranslucent
        transparent
        visible={adding}
      >
        <View style={styles.modalRoot}>
          <Animated.View
            style={[
              styles.backdrop,
              { opacity: dim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] }) },
            ]}
          >
            <Pressable onPress={closeAddForm} style={styles.backdropHit} />
          </Animated.View>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.sheetLift}
          >
            <Animated.View
              style={[
                styles.sheet,
                {
                  height: sheetHeight,
                  paddingBottom: Math.max(insets.bottom, theme.spacing.md),
                  transform: [{
                    translateY: slide.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, windowHeight],
                    }),
                  }],
                },
              ]}
            >
              <View style={styles.handle} />
              <ScrollView
                bounces={false}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={styles.sheetBody}
              >
                <AddPetForm
                  draft={draft}
                  onChange={setDraft}
                  onClose={closeAddForm}
                />
              </ScrollView>
              <View style={styles.sheetFooter}>
                <Pressable
                  disabled={!canSavePet}
                  onPress={savePet}
                  style={({ pressed }) => [
                    styles.sheetSave,
                    !canSavePet && styles.sheetSaveDisabled,
                    pressed && canSavePet && styles.pressed,
                  ]}
                >
                  <MaterialIcons color={theme.colors.primaryText} name="done" size={20} />
                  <Text style={styles.sheetSaveLabel}>{t('selectPet.saveAndSelect')}</Text>
                </Pressable>
                <Pressable
                  onPress={closeAddForm}
                  style={({ pressed }) => [styles.sheetCancel, pressed && styles.pressed]}
                >
                  <Text style={styles.sheetCancelLabel}>{t('cancel')}</Text>
                </Pressable>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
    empty: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: t.typography.sizes.body,
      lineHeight: t.typography.lineHeights.body,
      textAlign: 'center',
    },
    add: {
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderColor: t.colors.primaryBorder,
      borderRadius: t.radii.button,
      borderStyle: 'dashed',
      borderWidth: 1.5,
      flexDirection: 'row',
      gap: t.spacing.sm,
      height: 48,
      justifyContent: 'center',
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
      gap: t.spacing.sm,
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
    continueDisabled: {
      opacity: 0.45,
    },
    continueLabel: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    modalRoot: {
      flex: 1,
      justifyContent: 'flex-end',
      zIndex: 20,
    },
    sheetLift: {
      width: '100%',
    },
    backdrop: {
      backgroundColor: t.colors.overlay,
      bottom: 0,
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    },
    backdropHit: {
      flex: 1,
    },
    sheet: {
      backgroundColor: t.colors.surface,
      borderTopLeftRadius: t.radii.hero,
      borderTopRightRadius: t.radii.hero,
      overflow: 'hidden',
      width: '100%',
    },
    sheetBody: {
      flex: 1,
    },
    handle: {
      alignSelf: 'center',
      backgroundColor: t.colors.surfaceHigh,
      borderRadius: t.radii.pill,
      height: 4,
      marginBottom: t.spacing.xs,
      marginTop: t.spacing.sm,
      width: 40,
    },
    sheetFooter: {
      borderTopColor: t.colors.surfaceContainer,
      borderTopWidth: 1,
      gap: t.spacing.sm,
      paddingHorizontal: t.spacing.gutter,
      paddingTop: t.spacing.md,
    },
    sheetSave: {
      alignItems: 'center',
      backgroundColor: t.colors.primaryContainer,
      borderRadius: t.radii.button,
      flexDirection: 'row',
      gap: t.spacing.sm,
      height: t.spacing.control,
      justifyContent: 'center',
    },
    sheetSaveDisabled: {
      opacity: 0.45,
    },
    sheetSaveLabel: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    sheetCancel: {
      alignItems: 'center',
      height: 40,
      justifyContent: 'center',
    },
    sheetCancelLabel: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    pressed: {
      opacity: 0.9,
    },
  }), theme);
}

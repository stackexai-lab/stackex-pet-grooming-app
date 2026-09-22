import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/AppHeader';
import { BottomTabBar } from '@/components/BottomTabBar';
import { createStyles, defaultThemeSelection, setTheme, useTheme, type Theme } from '@/theme';
import { useLanguage } from '@/i18n';

export function ProfileScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { locale, setLocale } = useLanguage();
  const styles = useMemo(() => profileStyles(theme), [theme]);
  const [address, setAddress] = useState(t('profilePage.address'));
  const [draftAddress, setDraftAddress] = useState(address);
  const [modal, setModal] = useState<'address' | 'theme' | 'language' | null>(null);
  const [themeMode, setThemeMode] = useState<'system' | 'pawcare'>('pawcare');

  const openAddressEditor = () => {
    setDraftAddress(address);
    setModal('address');
  };

  const saveAddress = () => {
    setAddress(draftAddress.trim() || address);
    setModal(null);
  };

  const selectedTheme = themeMode === 'pawcare' ? t('profilePage.pawcare') : t('profilePage.system');

  return (
    <View style={styles.screen}>
      <AppHeader insetTop={insets.top} showProfile={false} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: theme.spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('profilePage.title')}</Text>
        <Text style={styles.subtitle}>{t('profilePage.subtitle')}</Text>

        <Text style={styles.sectionLabel}>{t('profilePage.account')}</Text>
        <View style={styles.group}>
          <View style={styles.row}>
            <Text style={styles.label}>{t('profilePage.email')}</Text>
            <Text style={styles.value}>{t('profilePage.emailValue')}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>{t('profilePage.groomingAddress')}</Text>
        <View style={styles.group}>
          <View style={styles.addressRow}>
            <Text style={styles.address}>{address}</Text>
            <Pressable accessibilityRole="button" onPress={openAddressEditor} style={styles.editButton}>
              <Text style={styles.editLabel}>{t('profilePage.edit')}</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionLabel}>{t('profilePage.preferences')}</Text>
        <View style={styles.group}>
          <Pressable accessibilityRole="button" onPress={() => setModal('theme')} style={styles.preferenceRow}>
            <View>
              <Text style={styles.label}>{t('profilePage.theme')}</Text>
              <Text style={styles.value}>{selectedTheme}</Text>
            </View>
            <MaterialIcons color={theme.colors.ink} name="chevron-right" size={20} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable accessibilityRole="button" onPress={() => setModal('language')} style={styles.preferenceRow}>
            <View>
              <Text style={styles.label}>{t('profilePage.language')}</Text>
              <Text style={styles.value}>{locale === 'ar' ? t('profilePage.arabic') : t('profilePage.english')}</Text>
            </View>
            <MaterialIcons color={theme.colors.ink} name="chevron-right" size={20} />
          </Pressable>
        </View>
      </ScrollView>
      <BottomTabBar active="profile" insetBottom={insets.bottom} />

      <Modal animationType="slide" transparent visible={modal !== null} onRequestClose={() => setModal(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setModal(null)}>
          <Pressable style={styles.modalCard} onPress={(event) => event.stopPropagation()}>
            {modal === 'address' ? (
              <>
                <Text style={styles.modalTitle}>{t('profilePage.editAddress')}</Text>
                <TextInput
                  autoFocus
                  multiline
                  onChangeText={setDraftAddress}
                  placeholder={t('profilePage.addressPlaceholder')}
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.addressInput}
                  value={draftAddress}
                />
                <View style={styles.modalActions}>
                  <Pressable onPress={() => setModal(null)} style={styles.modalSecondary}>
                    <Text style={styles.modalSecondaryLabel}>{t('cancel')}</Text>
                  </Pressable>
                  <Pressable onPress={saveAddress} style={styles.modalPrimary}>
                    <Text style={styles.modalPrimaryLabel}>{t('save')}</Text>
                  </Pressable>
                </View>
              </>
            ) : modal === 'theme' ? (
              <>
                <Text style={styles.modalTitle}>{t('profilePage.chooseTheme')}</Text>
                <Pressable onPress={() => { setThemeMode('pawcare'); setTheme(defaultThemeSelection); setModal(null); }} style={styles.optionRow}>
                  <Text style={styles.optionLabel}>{t('profilePage.pawcare')}</Text>
                  {themeMode === 'pawcare' && <MaterialIcons color={theme.colors.primary} name="check" size={20} />}
                </Pressable>
                <Pressable onPress={() => { setThemeMode('system'); setTheme(defaultThemeSelection); setModal(null); }} style={styles.optionRow}>
                  <Text style={styles.optionLabel}>{t('profilePage.system')}</Text>
                  {themeMode === 'system' && <MaterialIcons color={theme.colors.primary} name="check" size={20} />}
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>{t('profilePage.chooseLanguage')}</Text>
                <Pressable onPress={() => { void setLocale('en'); setModal(null); }} style={styles.optionRow}>
                  <Text style={styles.optionLabel}>{t('profilePage.english')}</Text>
                  {locale === 'en' && <MaterialIcons color={theme.colors.primary} name="check" size={20} />}
                </Pressable>
                <Pressable onPress={() => { void setLocale('ar'); setModal(null); }} style={styles.optionRow}>
                  <Text style={styles.optionLabel}>{t('profilePage.arabic')}</Text>
                  {locale === 'ar' && <MaterialIcons color={theme.colors.primary} name="check" size={20} />}
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function profileStyles(theme: Theme) {
  return createStyles((t) => ({
    screen: {
      backgroundColor: t.colors.background,
      flex: 1,
    },
    content: {
      paddingHorizontal: t.spacing.gutter,
      paddingTop: t.spacing.sm,
    },
    title: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 25,
      lineHeight: 31,
    },
    subtitle: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: 13,
      lineHeight: 18,
      marginTop: 2,
    },
    sectionLabel: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 10,
      letterSpacing: 0.6,
      lineHeight: 14,
      marginBottom: 8,
      marginTop: 20,
      textTransform: 'uppercase',
    },
    group: {
      backgroundColor: t.colors.surface,
      borderColor: t.colors.border,
      borderWidth: 1,
    },
    row: {
      paddingHorizontal: t.spacing.md,
      paddingVertical: 12,
    },
    label: {
      color: t.colors.textSecondary,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: 10,
      lineHeight: 14,
    },
    value: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 13,
      lineHeight: 18,
      marginTop: 2,
    },
    addressRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: t.spacing.md,
      paddingVertical: 14,
    },
    address: {
      color: t.colors.ink,
      flex: 1,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: 13,
      lineHeight: 19,
      paddingEnd: t.spacing.md,
    },
    editButton: {
      paddingHorizontal: 4,
      paddingVertical: 6,
    },
    editLabel: {
      color: t.colors.primary,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 11,
      lineHeight: 16,
    },
    preferenceRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      minHeight: 58,
      paddingHorizontal: t.spacing.md,
    },
    divider: {
      backgroundColor: t.colors.border,
      height: 1,
      marginHorizontal: t.spacing.md,
    },
    modalBackdrop: {
      backgroundColor: 'rgba(15, 23, 42, 0.28)',
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalCard: {
      backgroundColor: t.colors.background,
      borderTopLeftRadius: t.radii.card,
      borderTopRightRadius: t.radii.card,
      paddingBottom: 28,
      paddingHorizontal: t.spacing.gutter,
      paddingTop: 22,
    },
    modalTitle: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 18,
      lineHeight: 24,
      marginBottom: 14,
    },
    addressInput: {
      backgroundColor: t.colors.surface,
      borderColor: t.colors.border,
      borderRadius: t.radii.input,
      borderWidth: 1,
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.body,
      fontSize: 14,
      minHeight: 88,
      paddingHorizontal: 14,
      paddingVertical: 12,
      textAlignVertical: 'top',
    },
    modalActions: {
      flexDirection: 'row',
      gap: t.spacing.sm,
      marginTop: 16,
    },
    modalSecondary: {
      alignItems: 'center',
      backgroundColor: t.colors.surface,
      borderColor: t.colors.border,
      borderRadius: t.radii.button,
      borderWidth: 1,
      flex: 1,
      justifyContent: 'center',
      minHeight: 46,
    },
    modalSecondaryLabel: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 14,
    },
    modalPrimary: {
      alignItems: 'center',
      backgroundColor: t.colors.primaryContainer,
      borderRadius: t.radii.button,
      flex: 1,
      justifyContent: 'center',
      minHeight: 46,
    },
    modalPrimaryLabel: {
      color: t.colors.primaryText,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 14,
    },
    optionRow: {
      alignItems: 'center',
      borderBottomColor: t.colors.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      minHeight: 56,
    },
    optionLabel: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: 15,
    },
  }), theme);
}

import { useMemo, useState, type ReactNode } from 'react';
import {
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FlowHeader } from '@/components/FlowHeader';
import { cardShadow } from '@/components/ServiceCard';
import { paymentMock } from '@/mocks/payment';
import { createStyles, useTheme, type Theme } from '@/theme';

export function PaymentScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const styles = useMemo(() => paymentStyles(theme), [theme]);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expires, setExpires] = useState('');
  const [cvc, setCvc] = useState('');
  const [zip, setZip] = useState('');
  const forward = I18nManager.isRTL ? 'arrow-back' : 'arrow-forward';
  const total = t('confirmation.money', { value: paymentMock.total.toFixed(2) });

  return (
    <View style={styles.screen}>
      <FlowHeader elevatedBack insetTop={insets.top} title={t('payment.title')} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{t('payment.cardInformation')}</Text>
              
            </View>

            <Field label={t('payment.cardholderName')}>
              <View style={styles.inputWrap}>
                <TextInput
                  onChangeText={setName}
                  placeholder={t('payment.cardholderName')}
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  value={name}
                />
                <MaterialCommunityIcons color={theme.colors.textMuted} name="card-account-details-outline" size={20} />
              </View>
            </Field>

            <Field label={t('payment.cardNumber')}>
              <View style={styles.inputWrap}>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={setNumber}
                  placeholder="4242 4242 4242 4242"
                  placeholderTextColor={theme.colors.textMuted}
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  value={number}
                />
                <MaterialIcons color={theme.colors.primaryContainer} name="credit-card" size={20} />
              </View>
            </Field>

            <View style={styles.row}>
              <Field label={t('payment.expires')} style={styles.half}>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={setExpires}
                  placeholder="MM/YY"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[styles.input, styles.inputSolo, styles.center]}
                  underlineColorAndroid="transparent"
                  value={expires}
                />
              </Field>
              <Field
                label={t('payment.cvc')}
                style={styles.half}
                trailing={(
                  <MaterialIcons
                    accessibilityLabel={t('payment.cvcHelp')}
                    color={theme.colors.textMuted}
                    name="help-outline"
                    size={14}
                  />
                )}
              >
                <View style={styles.inputWrap}>
                  <TextInput
                    keyboardType="number-pad"
                    onChangeText={setCvc}
                    placeholder="123"
                    placeholderTextColor={theme.colors.textMuted}
                    secureTextEntry
                    style={[styles.input, styles.center]}
                    underlineColorAndroid="transparent"
                    value={cvc}
                  />
                  
                </View>
              </Field>
            </View>

            <Field label={t('payment.billingZip')}>
              <View style={styles.zipRow}>
                <Pressable style={styles.country}>
                  <Text style={styles.countryCode}>{paymentMock.countryCode}</Text>
                  <MaterialIcons color={theme.colors.textMuted} name="keyboard-arrow-down" size={16} />
                </Pressable>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={setZip}
                  placeholder="94107"
                  placeholderTextColor={theme.colors.textMuted}
                  style={[styles.input, styles.inputSolo, styles.zip]}
                  underlineColorAndroid="transparent"
                  value={zip}
                />
              </View>
            </Field>

           
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, theme.spacing.lg) }]}>
        <Pressable
          onPress={() => router.replace('/success')}
          style={({ pressed }) => [styles.pay, pressed && styles.pressed]}
        >
          <View style={styles.payLead}>
            <MaterialIcons color={theme.colors.primaryText} name="lock" size={18} />
            <Text style={styles.payLabel}>{t('payment.confirmAndPay')}</Text>
          </View>
          <View style={styles.payLead}>
            <Text style={styles.payLabel}>{total}</Text>
            <MaterialIcons color={theme.colors.primaryText} name={forward} size={18} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

function Field({
  children,
  label,
  style,
  trailing,
}: {
  children: ReactNode;
  label: string;
  style?: object;
  trailing?: ReactNode;
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => paymentStyles(theme), [theme]);

  return (
    <View style={style}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {trailing}
      </View>
      {children}
    </View>
  );
}

function paymentStyles(theme: Theme) {
  return createStyles((t) => ({
    screen: {
      backgroundColor: t.colors.background,
      flex: 1,
    },
    flex: {
      flex: 1,
    },
    content: {
      paddingBottom: t.spacing.xl,
      paddingHorizontal: t.spacing.md,
      paddingTop: t.spacing.sm,
    },
    card: {
      alignSelf: 'center',
      backgroundColor: t.colors.surface,
      borderColor: t.colors.surfaceVariant,
      borderRadius: t.radii.hero,
      borderWidth: 1,
      gap: 14,
      maxWidth: 480,
      overflow: 'hidden',
      padding: t.spacing.gutter,
      width: '100%',
      ...cardShadow(t.colors.overlay),
    },
    cardHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'space-between',
      marginBottom: t.spacing.xs,
    },
    cardTitle: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyBold,
      fontSize: t.typography.sizes.body,
      lineHeight: t.typography.lineHeights.body,
    },
    brands: {
      flexDirection: 'row',
      flexShrink: 1,
      flexWrap: 'wrap',
      gap: 6,
      justifyContent: 'flex-end',
    },
    brand: {
      backgroundColor: t.colors.badgeSoft,
      borderRadius: 6,
      paddingHorizontal: t.spacing.sm,
      paddingVertical: 2,
    },
    brandLabel: {
      color: t.colors.badgeSoftText,
      fontFamily: t.typography.fontFamilies.bodyBold,
      fontSize: 10,
      letterSpacing: 0.6,
    },
    labelRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    label: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      lineHeight: t.typography.lineHeights.caption,
    },
    inputWrap: {
      alignItems: 'center',
      backgroundColor: t.colors.surfaceSecondary,
      borderRadius: t.radii.input,
      flexDirection: 'row',
      minWidth: 0,
      paddingEnd: t.spacing.md,
    },
    input: {
      color: t.colors.ink,
      flex: 1,
      fontFamily: t.typography.fontFamilies.bodyMedium,
      fontSize: t.typography.sizes.caption,
      minHeight: 44,
      paddingHorizontal: 14,
    },
    inputSolo: {
      backgroundColor: t.colors.surfaceSecondary,
      borderRadius: t.radii.input,
    },
    center: {
      textAlign: 'center',
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    half: {
      flex: 1,
      minWidth: 0,
    },
    zipRow: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
    },
    country: {
      alignItems: 'center',
      backgroundColor: t.colors.surfaceSecondary,
      borderRadius: t.radii.input,
      flexDirection: 'row',
      flexShrink: 0,
      gap: 6,
      minHeight: 44,
      minWidth: 64,
      paddingHorizontal: 10,
    },
    countryCode: {
      color: t.colors.textMuted,
      fontFamily: t.typography.fontFamilies.bodyBold,
      fontSize: t.typography.sizes.overline,
      textTransform: 'uppercase',
    },
    countryLabel: {
      color: t.colors.ink,
      fontFamily: t.typography.fontFamilies.bodyBold,
      fontSize: t.typography.sizes.caption,
    },
    zip: {
      flex: 1,
      minWidth: 0,
    },
    footer: {
      alignSelf: 'center',
      maxWidth: 480,
      paddingHorizontal: t.spacing.md,
      paddingTop: t.spacing.sm,
      width: '100%',
    },
    pay: {
      alignItems: 'center',
      backgroundColor: t.colors.primary,
      borderRadius: t.radii.button,
      flexDirection: 'row',
      justifyContent: 'space-between',
      maxWidth: 480,
      minHeight: 56,
      paddingHorizontal: t.spacing.gutter,
      paddingVertical: 14,
      width: '100%',
      shadowColor: t.colors.overlay,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 3,
    },
    payLead: {
      alignItems: 'center',
      flexDirection: 'row',
      flexShrink: 1,
      gap: t.spacing.sm,
      minWidth: 0,
    },
    payLabel: {
      color: t.colors.primaryText,
      flexShrink: 1,
      fontFamily: t.typography.fontFamilies.bodyBold,
      fontSize: t.typography.sizes.label,
      lineHeight: t.typography.lineHeights.label,
    },
    pressed: {
      opacity: 0.94,
    },
  }), theme);
}

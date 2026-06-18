import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Switch,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors, FontFamily, FontSize, Spacing, BorderRadius} from '../../theme';
import ScreenContainer from '../../components/common/ScreenContainer';
import {useTranslation} from 'react-i18next';
import {changeLanguage, SupportedLanguage} from '../../locales/i18n';
import {useUserStore} from '../../store/userStore';
import {deleteAllData} from '../../database';
import {
  requestNotificationPermissions,
  scheduleDailyReminder,
  cancelAllReminders,
} from '../../utils/notifications';

const VERSION = '1.0.0';
const NOTIF_ENABLED_KEY = 'notif_enabled';
const TIME_OPTIONS = ['09:00', '12:00', '18:00', '21:00'];

const LANGUAGES: {code: SupportedLanguage; label: string}[] = [
  {code: 'az', label: 'Azərbaycan dili'},
  {code: 'en', label: 'English'},
  {code: 'ru', label: 'Русский'},
];

export default function SettingsScreen() {
  const {t, i18n} = useTranslation();
  const {user, updateLanguage, updateNotificationTime, refreshUser} = useUserStore();
  const [deleting, setDeleting] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifTime, setNotifTime] = useState(user?.notification_time ?? '09:00');

  useEffect(() => {
    AsyncStorage.getItem(NOTIF_ENABLED_KEY).then(v => setNotifEnabled(v === '1'));
  }, []);

  useEffect(() => {
    if (user?.notification_time) setNotifTime(user.notification_time);
  }, [user?.notification_time]);

  async function handleLanguageChange(lang: SupportedLanguage) {
    changeLanguage(lang);
    await updateLanguage(lang);
  }

  async function handleToggleNotif(value: boolean) {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert('', t('settings.notifications.denied'));
        return;
      }
      await scheduleDailyReminder(notifTime, t('settings.notifications.reminderMessage'));
      setNotifEnabled(true);
      await AsyncStorage.setItem(NOTIF_ENABLED_KEY, '1');
    } else {
      await cancelAllReminders();
      setNotifEnabled(false);
      await AsyncStorage.setItem(NOTIF_ENABLED_KEY, '0');
    }
  }

  async function handleSelectTime(time: string) {
    setNotifTime(time);
    await updateNotificationTime(time);
    if (notifEnabled) {
      await scheduleDailyReminder(time, t('settings.notifications.reminderMessage'));
    }
  }

  function handleDeleteAll() {
    Alert.alert(
      t('settings.data.delete'),
      t('settings.data.deleteWarning'),
      [
        {text: t('settings.data.deleteCancel'), style: 'cancel'},
        {
          text: t('settings.data.deleteConfirm'),
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            await deleteAllData();
            await refreshUser();
            setDeleting(false);
          },
        },
      ],
    );
  }

  const currentLang = (i18n.language as SupportedLanguage) || 'az';

  return (
    <ScreenContainer edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>{t('settings.title')}</Text>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <View style={styles.langOptions}>
            {LANGUAGES.map(l => (
              <TouchableOpacity
                key={l.code}
                style={[
                  styles.langOption,
                  currentLang === l.code && styles.langOptionSelected,
                ]}
                onPress={() => handleLanguageChange(l.code)}>
                <Text
                  style={[
                    styles.langLabel,
                    currentLang === l.code && styles.langLabelSelected,
                  ]}>
                  {l.label}
                </Text>
                {currentLang === l.code && (
                  <Text style={styles.langCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.notifications.title')}</Text>
          <View style={styles.notifRow}>
            <Text style={styles.notifLabel}>{t('settings.notifications.daily')}</Text>
            <Switch
              value={notifEnabled}
              onValueChange={handleToggleNotif}
              trackColor={{false: Colors.border, true: Colors.terracotta}}
              thumbColor={Colors.surfaceElevated}
            />
          </View>
          {notifEnabled && (
            <View style={styles.timeBlock}>
              <Text style={styles.timeLabel}>{t('settings.notifications.time')}</Text>
              <View style={styles.timeChips}>
                {TIME_OPTIONS.map(time => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeChip,
                      notifTime === time && styles.timeChipSelected,
                    ]}
                    onPress={() => handleSelectTime(time)}>
                    <Text
                      style={[
                        styles.timeChipText,
                        notifTime === time && styles.timeChipTextSelected,
                      ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.data.title')}</Text>

          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleDeleteAll}>
            <Text style={styles.actionDanger}>
              {deleting ? '...' : t('settings.data.delete')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.aboutLogo}
            resizeMode="contain"
          />
          <Text style={styles.sectionTitle}>{t('settings.about.title')}</Text>
          <Text style={styles.aboutDesc}>{t('settings.about.description')}</Text>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => Linking.openURL('https://www.youtube.com/@ozum-ucun')}>
            <Text style={styles.linkIcon}>▶</Text>
            <Text style={styles.linkText}>{t('settings.about.youtube')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => Linking.openURL('https://www.instagram.com/ozum.ucun')}>
            <Text style={styles.linkIcon}>◎</Text>
            <Text style={styles.linkText}>{t('settings.about.instagram')}</Text>
          </TouchableOpacity>

          <Text style={styles.version}>
            {t('settings.about.version', {version: VERSION})}
          </Text>
        </View>

        {/* Fromm quote at bottom */}
        <View style={styles.footer}>
          <Text style={styles.footerQuote}>"{t('quotes.fromm5')}"</Text>
          <Text style={styles.footerAttrib}>— Erich Fromm</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing[6],
    gap: Spacing[6],
    paddingBottom: Spacing[12],
  },
  screenTitle: {
    fontFamily: FontFamily.serifBold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing[5],
    gap: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontFamily: FontFamily.sansCondensed,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 3,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[2],
  },
  notifLabel: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  timeBlock: {
    gap: Spacing[3],
    marginTop: Spacing[2],
  },
  timeLabel: {
    fontFamily: FontFamily.sansCondensed,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  timeChips: {
    flexDirection: 'row',
    gap: Spacing[2],
  },
  timeChip: {
    flex: 1,
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
  },
  timeChipSelected: {
    borderColor: Colors.terracotta,
    backgroundColor: Colors.terracotta,
  },
  timeChipText: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  timeChipTextSelected: {
    color: Colors.onAccent,
  },
  langOptions: {gap: Spacing[2]},
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.md,
  },
  langOptionSelected: {
    backgroundColor: Colors.surfaceElevated,
  },
  langLabel: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  langLabelSelected: {
    color: Colors.textPrimary,
    fontFamily: FontFamily.sansMedium,
  },
  langCheck: {
    color: Colors.terracotta,
    fontSize: FontSize.base,
  },
  actionRow: {
    paddingVertical: Spacing[3],
  },
  actionDanger: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.base,
    color: Colors.error,
  },
  aboutLogo: {
    width: 170,
    height: 142,
    alignSelf: 'center',
    marginBottom: Spacing[2],
  },
  aboutDesc: {
    fontFamily: FontFamily.serifItalic,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    lineHeight: FontSize.base * 1.5,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingVertical: Spacing[2],
  },
  linkIcon: {
    fontSize: FontSize.base,
    color: Colors.terracotta,
    width: 20,
  },
  linkText: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  version: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: Spacing[2],
  },
  footer: {
    gap: Spacing[2],
    alignItems: 'center',
    paddingVertical: Spacing[4],
  },
  footerQuote: {
    fontFamily: FontFamily.serifItalic,
    fontSize: FontSize.base,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.65,
  },
  footerAttrib: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});

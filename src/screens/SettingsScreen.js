import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {
  Key,
  GraduationCap,
  Trash2,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  LogOut,
  LayoutDashboard,
} from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../components/Theme';
import * as storage from '../database/services';
import { saveAdminGeminiApiKey } from '../config/adminApi';

const ADMIN_EMAILS = ['admin@germanspeaking.ai', 'admin@admin.com'];

export default function SettingsScreen({ navigation }) {
  const [apiKey, setApiKey] = useState('');
  const [level, setLevel] = useState('A2');
  const [isSaved, setIsSaved] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingApiKey, setSavingApiKey] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoadingSettings(true);

        const storedKey = await storage.getApiKey();
        const storedLevel = await storage.getLevel();
        const user = await storage.getCurrentUser();

        setApiKey(storedKey || '');
        setLevel(storedLevel || 'A2');
        setIsAdmin(user?.role === 'admin');
      } catch (error) {
        console.error('Load settings error:', error);
        Alert.alert('Lỗi', 'Không thể tải cấu hình người dùng.');
      } finally {
        setLoadingSettings(false);
      }
    }

    loadSettings();
  }, []);

  const handleSaveApiKey = async () => {
    try {
      setSavingApiKey(true);

      const cleanApiKey = apiKey.trim();

      if (!cleanApiKey) {
        Alert.alert('Lỗi', 'Vui lòng nhập Gemini API Key.');
        return;
      }

      const success = await storage.saveApiKey(cleanApiKey);

      if (!success) {
        Alert.alert('Lỗi', 'Không thể lưu API Key. Vui lòng thử lại.');
        return;
      }

      const user = await storage.getCurrentUser();

      if (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        await saveAdminGeminiApiKey(cleanApiKey);
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      console.error('Save API key error:', error);
      Alert.alert('Lỗi', error.message || 'Không thể lưu API Key.');
    } finally {
      setSavingApiKey(false);
    }
  };

  const handleSelectLevel = async (selectedLevel) => {
    try {
      const user = await storage.getCurrentUser();

      if (!user) {
        Alert.alert(
          'Chưa đăng nhập',
          'Phiên đăng nhập không tồn tại. Vui lòng đăng nhập lại.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              },
            },
          ]
        );
        return;
      }

      setLevel(selectedLevel);

      const success = await storage.saveLevel(selectedLevel);

      if (!success) {
        Alert.alert('Lỗi', 'Không thể lưu trình độ. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Save level error:', error);
      Alert.alert('Lỗi', error.message || 'Không thể lưu trình độ.');
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Xóa lịch sử',
      'Bạn có chắc chắn muốn xóa toàn bộ lịch sử luyện nói không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa sạch',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await storage.clearPracticeHistory();

              if (success) {
                Alert.alert('Thành công', 'Lịch sử luyện tập đã được xóa sạch.');
              } else {
                Alert.alert('Lỗi', 'Không thể xóa lịch sử luyện tập.');
              }
            } catch (error) {
              console.error('Clear history error:', error);
              Alert.alert('Lỗi', error.message || 'Không thể xóa lịch sử.');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await storage.logOut();

              if (result.success) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              } else {
                Alert.alert('Lỗi', result.error || 'Không thể đăng xuất');
              }
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Lỗi', error.message || 'Không thể đăng xuất');
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Cấu hình hệ thống</Text>
          <Text style={styles.subtitle}>
            Thiết lập tài khoản và mức độ học của bạn
          </Text>
        </View>

        {/* Admin Dashboard Block */}
        {isAdmin && (
          <TouchableOpacity
            style={[styles.section, SHADOWS.glass, { borderColor: COLORS.primary }]}
            onPress={() => navigation.navigate('AdminDashboard')}
            activeOpacity={0.85}
          >
            <View style={styles.sectionHeader}>
              <LayoutDashboard size={20} color={COLORS.primary} />
              <Text style={[styles.sectionTitle, { color: COLORS.primary }]}>
                Bảng điều khiển Admin
              </Text>
              <ChevronRight size={20} color={COLORS.primary} />
            </View>

            <Text style={styles.description}>
              Quản lý dữ liệu hệ thống: Chủ đề, từ vựng, đề thi và người dùng.
            </Text>
          </TouchableOpacity>
        )}

        {/* Review Mistakes Block */}
        <TouchableOpacity
          style={[styles.section, SHADOWS.glass]}
          onPress={() => navigation.navigate('Review')}
          activeOpacity={0.85}
        >
          <View style={styles.sectionHeader}>
            <BookOpen size={20} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Ôn tập từ sai</Text>
            <ChevronRight size={20} color={COLORS.textDark} />
          </View>

          <Text style={styles.description}>
            Xem lại và ôn tập các từ vựng, ngữ pháp, phát âm sai mà bạn đã ghi nhận.
          </Text>
        </TouchableOpacity>

        {/* Gemini API Key Block */}
        <View style={[styles.section, SHADOWS.glass]}>
          <View style={styles.sectionHeader}>
            <Key size={20} color={COLORS.primaryLight} />
            <Text style={styles.sectionTitle}>Gemini AI API Key</Text>
          </View>

          <Text style={styles.description}>
            Dùng cho chấm điểm phát âm cá nhân. Tài khoản admin: key này cũng dùng
            chung cho tạo chủ đề / flashcard AI.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="AIzaSy..."
            placeholderTextColor={COLORS.textDark}
            value={apiKey}
            onChangeText={(text) => {
              setApiKey(text);
              setIsSaved(false);
            }}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loadingSettings && !savingApiKey}
          />

          <TouchableOpacity
            style={[styles.saveBtn, isSaved && styles.savedBtn]}
            onPress={handleSaveApiKey}
            disabled={savingApiKey}
            activeOpacity={0.85}
          >
            {isSaved ? (
              <>
                <CheckCircle2 size={18} color="#FFF" />
                <Text style={styles.saveBtnText}>Đã lưu thành công!</Text>
              </>
            ) : (
              <Text style={styles.saveBtnText}>
                {savingApiKey ? 'Đang lưu...' : 'Lưu API Key'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Difficulty Level Selection */}
        <View style={[styles.section, SHADOWS.glass]}>
          <View style={styles.sectionHeader}>
            <GraduationCap size={20} color={COLORS.primaryLight} />
            <Text style={styles.sectionTitle}>Trình độ mục tiêu</Text>
          </View>

          <Text style={styles.description}>
            AI sẽ điều chỉnh tốc độ chấm, gợi ý sửa lỗi ngữ pháp dựa trên trình độ
            tiếng Đức bạn chọn.
          </Text>

          <View style={styles.levelGrid}>
            {['A1', 'A2', 'B1', 'B2'].map((lvl) => (
              <TouchableOpacity
                key={lvl}
                style={[
                  styles.levelCard,
                  level === lvl && styles.levelCardActive,
                ]}
                onPress={() => handleSelectLevel(lvl)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.levelText,
                    level === lvl && styles.levelTextActive,
                  ]}
                >
                  {lvl}
                </Text>

                <Text
                  style={[
                    styles.levelDesc,
                    level === lvl && styles.levelDescActive,
                  ]}
                >
                  {lvl === 'A1' && 'Cơ bản (Sơ cấp)'}
                  {lvl === 'A2' && 'Giao tiếp cơ bản'}
                  {lvl === 'B1' && 'Độc lập (Trung cấp)'}
                  {lvl === 'B2' && 'Lưu loát (Trung cao)'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Clear Data Block */}
        <View style={[styles.section, SHADOWS.glass, styles.dangerSection]}>
          <View style={styles.sectionHeader}>
            <Trash2 size={20} color={COLORS.error} />
            <Text style={[styles.sectionTitle, { color: COLORS.error }]}>
              Dữ liệu & Lịch sử
            </Text>
          </View>

          <Text style={styles.description}>
            Xóa sạch toàn bộ lịch sử luyện nói và điểm số đã lưu trên Supabase.
          </Text>

          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={handleClearHistory}
            activeOpacity={0.85}
          >
            <Text style={styles.dangerBtnText}>Xóa toàn bộ lịch sử</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Block */}
        <View style={[styles.section, SHADOWS.glass, styles.dangerSection]}>
          <View style={styles.sectionHeader}>
            <LogOut size={20} color={COLORS.error} />
            <Text style={[styles.sectionTitle, { color: COLORS.error }]}>
              Tài khoản
            </Text>
          </View>

          <Text style={styles.description}>
            Đăng xuất khỏi tài khoản và quay lại màn hình đăng nhập.
          </Text>

          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Text style={styles.dangerBtnText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>DeutschSprechen AI v1.0.0</Text>
          <Text style={styles.footerSub}>Powered by Gemini 2.0 Flash</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: SPACING.md,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h1,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyMuted,
    marginTop: 4,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: 24,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  description: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: 14,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: 15,
    marginBottom: SPACING.md,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  savedBtn: {
    backgroundColor: COLORS.accent,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  levelGrid: {
    gap: SPACING.sm,
  },
  levelCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
  },
  levelCardActive: {
    backgroundColor: COLORS.primaryAlpha15,
    borderColor: COLORS.primary,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textMuted,
    width: 40,
  },
  levelTextActive: {
    color: COLORS.primaryLight,
  },
  levelDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    flex: 1,
    textAlign: 'right',
  },
  levelDescActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  dangerSection: {
    borderColor: COLORS.error + '30',
  },
  dangerBtn: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerBtnText: {
    color: COLORS.error,
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textDark,
    fontSize: 12,
    fontWeight: '600',
  },
  footerSub: {
    color: COLORS.textDark,
    fontSize: 10,
    marginTop: 2,
  },
});
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Mail, Lock, User, UserPlus } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../components/Theme';
import { signUp } from '../utils/storage';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, name);
    setLoading(false);

    if (result.success) {
      Alert.alert('Thành công', 'Đăng ký thành công! Bạn sẽ được chuyển đến màn hình chính.');
      navigation.navigate('Home');
    } else {
      Alert.alert('Đăng ký thất bại', result.error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Đăng ký tài khoản</Text>
          <Text style={styles.subtitle}>Bắt đầu luyện nói tiếng Đức ngay</Text>
        </View>

        {/* Signup Form */}
        <View style={[styles.card, SHADOWS.glass]}>
          
          {/* Name Input */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <User size={16} color={COLORS.primaryLight} />
              <Text style={styles.label}>Tên của bạn</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Tên đầy đủ"
              placeholderTextColor={COLORS.textDark}
              value={name}
              onChangeText={setName}
              editable={!loading}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Mail size={16} color={COLORS.primaryLight} />
              <Text style={styles.label}>Email</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={COLORS.textDark}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Lock size={16} color={COLORS.primaryLight} />
              <Text style={styles.label}>Mật khẩu</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textDark}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              editable={!loading}
            />
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Lock size={16} color={COLORS.primaryLight} />
              <Text style={styles.label}>Xác nhận mật khẩu</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textDark}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              editable={!loading}
            />
          </View>

          {/* Signup Button */}
          <TouchableOpacity 
            style={[styles.signupBtn, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <UserPlus size={18} color="#FFF" />
                <Text style={styles.signupBtnText}>Đăng ký</Text>
              </>
            )}
          </TouchableOpacity>

        </View>

        {/* Login Link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.lg * 2,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textDark,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primaryLight,
    marginLeft: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    color: COLORS.text,
    fontSize: TYPOGRAPHY.body.fontSize,
  },
  signupBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signupBtnText: {
    color: '#FFF',
    ...TYPOGRAPHY.button,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textDark,
  },
  loginLink: {
    ...TYPOGRAPHY.button,
    color: COLORS.primary,
  },
});

import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Mail, Lock, LogIn } from 'lucide-react-native';

import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../components/Theme';
import * as storage from '../database/services';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail || !password.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
            return;
        }

        setLoading(true);

        try {
            const result = await storage.logIn(cleanEmail, password);

            if (result?.success) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            } else {
                Alert.alert(
                    'Đăng nhập thất bại',
                    result?.error || 'Email hoặc mật khẩu không đúng'
                );
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert(
                'Lỗi',
                error?.message || 'Có lỗi xảy ra khi đăng nhập'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Đăng nhập</Text>
                    <Text style={styles.subtitle}>
                        Luyện tập tiếng đức cùng Thiên Bảo nhaaaa!
                    </Text>
                </View>

                {/* Login Form */}
                <View style={[styles.card, SHADOWS.glass]}>
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
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="email"
                            textContentType="emailAddress"
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
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="password"
                            editable={!loading}
                        />
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[styles.loginBtn, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <LogIn size={18} color="#FFF" />
                                <Text style={styles.loginBtnText}>Đăng nhập</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Signup Link */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Chưa có tài khoản? </Text>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Signup')}
                        disabled={loading}
                    >
                        <Text style={styles.signupLink}>Tạo ngay</Text>
                    </TouchableOpacity>
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
        backgroundColor: COLORS.surfaceLight,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        borderRadius: 8,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        color: COLORS.text,
        fontSize: TYPOGRAPHY.body.fontSize,
    },

    loginBtn: {
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

    loginBtnText: {
        color: COLORS.germanyBlack,
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

    signupLink: {
        ...TYPOGRAPHY.button,
        color: COLORS.primary,
    },
});
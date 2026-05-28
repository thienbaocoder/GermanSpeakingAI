import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
} from 'react-native';
import {
    LayoutDashboard,
    BookOpen,
    PenLine,
    MessageSquare,
    Users,
    ChevronRight,
    ArrowLeft,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../components/Theme';

export default function AdminDashboardScreen({ navigation }) {
    const adminModules = [
        {
            title: 'Quản lý Chủ đề nói',
            desc: 'Thêm, sửa, xóa các chủ đề luyện nói và flashcards.',
            icon: <MessageSquare color={COLORS.primary} size={24} />,
            route: 'AdminTopics',
        },
        {
            title: 'Quản lý Từ vựng',
            desc: 'Quản lý danh sách từ vựng theo trình độ và chủ đề.',
            icon: <BookOpen color={COLORS.secondary} size={24} />,
            route: 'AdminVocabulary',
        },
        {
            title: 'Quản lý Đề Writing',
            desc: 'Cập nhật các đề thi viết Goethe A1-B2.',
            icon: <PenLine color={COLORS.warning} size={24} />,
            route: 'AdminWriting',
        },
        {
            title: 'Quản lý Ngữ pháp',
            desc: 'Thêm, sửa bài học ngữ pháp theo trình độ.',
            icon: <BookOpen color={COLORS.primaryLight || COLORS.primary} size={24} />,
            route: 'AdminGrammar',
        },
        {
            title: 'Quản lý Người dùng',
            desc: 'Xem danh sách người dùng và phân quyền.',
            icon: <Users color={COLORS.info || COLORS.primaryLight} size={24} />,
            route: 'AdminUsers',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft color={COLORS.text} size={24} />
                </TouchableOpacity>
                <View style={styles.headerTitleRow}>
                    <LayoutDashboard color={COLORS.primary} size={24} />
                    <Text style={styles.headerTitle}>Hệ thống Quản trị</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.welcomeBox}>
                    <Text style={styles.welcomeTitle}>Xin chào, Admin!</Text>
                    <Text style={styles.welcomeDesc}>
                        Chào mừng bạn quay lại hệ thống quản lý dữ liệu học tập German Speaking AI.
                    </Text>
                </View>

                <View style={styles.grid}>
                    {adminModules.map((module, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.moduleCard, SHADOWS.glass]}
                            onPress={() => {
                                if (module.route) {
                                    navigation.navigate(module.route);
                                } else {
                                    Alert.alert('Thông báo', 'Tính năng đang được phát triển');
                                }
                            }}
                        >
                            <View style={styles.moduleIcon}>{module.icon}</View>
                            <View style={styles.moduleInfo}>
                                <Text style={styles.moduleTitle}>{module.title}</Text>
                                <Text style={styles.moduleDesc}>{module.desc}</Text>
                            </View>
                            <ChevronRight color={COLORS.textDark} size={20} />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Lưu ý quan trọng</Text>
                    <Text style={styles.infoText}>
                        • Mọi thay đổi dữ liệu sẽ ảnh hưởng trực tiếp đến tất cả người dùng.{'\n'}
                        • Hãy kiểm tra kỹ nội dung (chính tả tiếng Đức, bản dịch) trước khi lưu.{'\n'}
                        • Đảm bảo định dạng JSON trong trường requirements của đề Writing.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundDeep || '#0F172A',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.glassBorder,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        ...TYPOGRAPHY.h3,
        color: COLORS.text,
    },
    scrollContent: {
        padding: SPACING.md,
    },
    welcomeBox: {
        marginBottom: SPACING.xl,
        paddingVertical: SPACING.md,
    },
    welcomeTitle: {
        ...TYPOGRAPHY.h1,
        color: COLORS.text,
        marginBottom: 4,
    },
    welcomeDesc: {
        ...TYPOGRAPHY.body,
        color: COLORS.textDark,
    },
    grid: {
        gap: SPACING.md,
    },
    moduleCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    moduleIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: COLORS.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    moduleInfo: {
        flex: 1,
    },
    moduleTitle: {
        ...TYPOGRAPHY.button,
        color: COLORS.text,
        fontSize: 16,
    },
    moduleDesc: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textDark,
        marginTop: 2,
    },
    infoBox: {
        marginTop: SPACING.xxl,
        padding: SPACING.lg,
        backgroundColor: COLORS.primaryAlpha10 || 'rgba(255, 204, 0, 0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.primaryAlpha20 || 'rgba(255, 204, 0, 0.2)',
    },
    infoTitle: {
        ...TYPOGRAPHY.button,
        color: COLORS.primary,
        marginBottom: 8,
    },
    infoText: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textDark,
        lineHeight: 18,
    },
});

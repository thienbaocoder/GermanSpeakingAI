import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
} from 'react-native';
import {
    ArrowLeft,
    User,
    Shield,
    ShieldOff,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../components/Theme';
import * as adminService from '../../database/services/adminService';

export default function AdminUsersScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const toggleAdmin = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        Alert.alert(
            'Xác nhận',
            `Bạn muốn đặt quyền ${newRole} cho ${user.email}?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Đồng ý',
                    onPress: async () => {
                        try {
                            await adminService.updateUserRole(user.id, newRole);
                            loadUsers();
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể cập nhật quyền');
                        }
                    },
                },
            ]
        );
    };

    const renderUserItem = ({ item }) => (
        <View style={[styles.userCard, SHADOWS.glass]}>
            <View style={styles.userIcon}>
                <User color={item.role === 'admin' ? COLORS.primary : COLORS.textDark} size={24} />
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name || 'Người dùng ẩn danh'}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <View style={[styles.roleTag, item.role === 'admin' && styles.adminTag]}>
                    <Text style={[styles.roleText, item.role === 'admin' && styles.adminText]}>
                        {item.role === 'admin' ? 'ADMIN' : 'USER'}
                    </Text>
                </View>
            </View>
            <TouchableOpacity 
                style={styles.actionBtn}
                onPress={() => toggleAdmin(item)}
            >
                {item.role === 'admin' ? (
                    <ShieldOff color={COLORS.error || '#FF4444'} size={20} />
                ) : (
                    <Shield color={COLORS.primary} size={20} />
                )}
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color={COLORS.text} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Quản lý Người dùng</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color={COLORS.primary} size="large" />
                </View>
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderUserItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Chưa có người dùng nào.</Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundDeep,
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
    backBtn: { padding: 4 },
    headerTitle: {
        ...TYPOGRAPHY.h3,
        color: COLORS.text,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: SPACING.md,
    },
    userCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    userIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        ...TYPOGRAPHY.button,
        color: COLORS.text,
        fontSize: 16,
    },
    userEmail: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textDark,
    },
    roleTag: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.surfaceLight,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    adminTag: {
        backgroundColor: COLORS.primaryAlpha20,
    },
    roleText: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.textDark,
    },
    adminText: {
        color: COLORS.primary,
    },
    actionBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        ...TYPOGRAPHY.body,
        color: COLORS.textDark,
        textAlign: 'center',
        marginTop: 40,
    },
});

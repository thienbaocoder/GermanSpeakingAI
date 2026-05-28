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
import { ArrowLeft, Book, ChevronRight, GraduationCap } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../components/Theme';
import * as storage from '../database/services';

export default function GrammarScreen({ navigation }) {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLevel, setUserLevel] = useState('A2');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const level = await storage.getLevel();
            setUserLevel(level);
            
            const data = await storage.getGrammarLessons(level);
            setLessons(data);
        } catch (error) {
            console.error('Error loading grammar:', error);
            Alert.alert('Lỗi', 'Không thể tải bài học ngữ pháp');
        } finally {
            setLoading(false);
        }
    };

    const renderLessonItem = ({ item }) => (
        <TouchableOpacity 
            style={[styles.lessonCard, SHADOWS.glass]}
            onPress={() => Alert.alert(item.title_de, item.content)}
        >
            <View style={styles.lessonIcon}>
                <Book color={COLORS.secondary} size={24} />
            </View>
            <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitleDe}>{item.title_de}</Text>
                <Text style={styles.lessonTitleVi}>{item.title}</Text>
                <View style={styles.lessonMeta}>
                    <Text style={styles.lessonCategory}>{item.category}</Text>
                </View>
            </View>
            <ChevronRight color={COLORS.textDark} size={20} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color={COLORS.text} size={24} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Ngữ pháp</Text>
                    <View style={styles.levelBadge}>
                        <GraduationCap color={COLORS.primary} size={14} />
                        <Text style={styles.levelText}>{userLevel}</Text>
                    </View>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color={COLORS.primary} size="large" />
                </View>
            ) : (
                <FlatList
                    data={lessons}
                    renderItem={renderLessonItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Chưa có bài học ngữ pháp nào cho trình độ {userLevel}.</Text>
                            <Text style={styles.emptySub}>Admin sẽ sớm cập nhật nội dung cho bạn!</Text>
                        </View>
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
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        ...TYPOGRAPHY.h3,
        color: COLORS.text,
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primaryAlpha10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        gap: 4,
    },
    levelText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '900',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: SPACING.md,
    },
    lessonCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 16,
        padding: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    lessonIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: COLORS.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    lessonInfo: {
        flex: 1,
    },
    lessonTitleDe: {
        ...TYPOGRAPHY.button,
        color: COLORS.text,
        fontSize: 16,
    },
    lessonTitleVi: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textDark,
        marginTop: 2,
    },
    lessonMeta: {
        marginTop: 4,
    },
    lessonCategory: {
        fontSize: 10,
        color: COLORS.secondary,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    emptyText: {
        ...TYPOGRAPHY.body,
        color: COLORS.text,
        textAlign: 'center',
    },
    emptySub: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textDark,
        marginTop: 8,
        textAlign: 'center',
    },
});

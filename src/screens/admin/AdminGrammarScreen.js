import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    Modal,
    TextInput,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import {
    ArrowLeft,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    Layout,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../components/Theme';
import * as adminService from '../../database/services/adminService';

export default function AdminGrammarScreen({ navigation }) {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [saving, setSaving] = useState(false);

    // Filter
    const [levelFilter, setLevelFilter] = useState('A1');

    // Form states
    const [title, setTitle] = useState('');
    const [titleDe, setTitleDe] = useState('');
    const [level, setLevel] = useState('A1');
    const [category, setCategory] = useState('General');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [sortOrder, setSortOrder] = useState('0');

    useEffect(() => {
        loadLessons();
    }, [levelFilter]);

    const loadLessons = async () => {
        try {
            setLoading(true);
            const data = await adminService.getGrammarLessonsAdmin(levelFilter);
            setLessons(data);
        } catch (error) {
            console.error('Error loading grammar lessons:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách bài ngữ pháp');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingLesson(null);
        setTitle('');
        setTitleDe('');
        setLevel(levelFilter);
        setCategory('General');
        setDescription('');
        setContent('');
        setSortOrder((lessons.length + 1).toString());
        setModalVisible(true);
    };

    const handleEdit = (lesson) => {
        setEditingLesson(lesson);
        setTitle(lesson.title);
        setTitleDe(lesson.title_de);
        setLevel(lesson.level);
        setCategory(lesson.category || 'General');
        setDescription(lesson.description || '');
        setContent(lesson.content);
        setSortOrder((lesson.sort_order || 0).toString());
        setModalVisible(true);
    };

    const handleDelete = (lesson) => {
        Alert.alert(
            'Xác nhận xóa',
            `Xóa bài học "${lesson.title}"?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await adminService.deleteGrammarLesson(lesson.id);
                            loadLessons();
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể xóa bài học');
                        }
                    },
                },
            ]
        );
    };

    const handleSave = async () => {
        if (!title.trim() || !titleDe.trim() || !content.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập Tiêu đề và Nội dung');
            return;
        }

        try {
            setSaving(true);
            const lessonData = {
                title,
                title_de: titleDe,
                level,
                category,
                description,
                content,
                sort_order: parseInt(sortOrder) || 0,
                updated_at: new Date().toISOString(),
            };

            await adminService.upsertGrammarLesson(lessonData, editingLesson?.id);

            setModalVisible(false);
            loadLessons();
        } catch (error) {
            console.error('Error saving grammar lesson:', error);
            Alert.alert('Lỗi', 'Không thể lưu bài ngữ pháp');
        } finally {
            setSaving(false);
        }
    };

    const renderLessonItem = ({ item }) => (
        <View style={[styles.lessonItem, SHADOWS.glass]}>
            <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitleDe}>{item.title_de}</Text>
                <Text style={styles.lessonTitleVi}>{item.title}</Text>
                <View style={styles.tagRow}>
                    <View style={styles.levelTag}><Text style={styles.tagText}>{item.level}</Text></View>
                    <View style={styles.categoryTag}><Text style={styles.tagText}>{item.category}</Text></View>
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
                    <Edit2 color={COLORS.primary} size={18} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionBtn}>
                    <Trash2 color={COLORS.error} size={18} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color={COLORS.text} size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Quản lý Ngữ pháp</Text>
                <TouchableOpacity onPress={handleAdd} style={styles.addBtn}>
                    <Plus color={COLORS.primary} size={24} />
                </TouchableOpacity>
            </View>

            <View style={styles.filterBar}>
                {['A1', 'A2', 'B1', 'B2'].map(lvl => (
                    <TouchableOpacity 
                        key={lvl} 
                        style={[styles.filterBtn, levelFilter === lvl && styles.filterBtnActive]}
                        onPress={() => setLevelFilter(lvl)}
                    >
                        <Text style={[styles.filterText, levelFilter === lvl && styles.filterTextActive]}>{lvl}</Text>
                    </TouchableOpacity>
                ))}
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
                        <Text style={styles.emptyText}>Chưa có bài ngữ pháp nào cho level này.</Text>
                    }
                />
            )}

            <Modal visible={modalVisible} animationType="slide">
                <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.backgroundDeep }}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{editingLesson ? 'Sửa bài học' : 'Thêm bài mới'}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}><X color={COLORS.text} size={24} /></TouchableOpacity>
                    </View>
                    <ScrollView style={styles.form}>
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <Text style={styles.label}>Level</Text>
                                <View style={styles.picker}>
                                    {['A1', 'A2', 'B1', 'B2'].map(l => (
                                        <TouchableOpacity key={l} onPress={() => setLevel(l)} style={[styles.pItem, level === l && styles.pItemActive]}>
                                            <Text style={[styles.pText, level === l && styles.pTextActive]}>{l}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View style={{ width: 80 }}>
                                <Text style={styles.label}>Thứ tự</Text>
                                <TextInput style={styles.input} value={sortOrder} onChangeText={setSortOrder} keyboardType="numeric" />
                            </View>
                        </View>

                        <Text style={styles.label}>Danh mục (vd: Verben, Nomen, Satzbau...)</Text>
                        <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="VD: Verben" placeholderTextColor={COLORS.textDark} />

                        <Text style={styles.label}>Tiêu đề tiếng Đức</Text>
                        <TextInput style={styles.input} value={titleDe} onChangeText={setTitleDe} placeholder="z.B. Modalverben im Präsens" placeholderTextColor={COLORS.textDark} />

                        <Text style={styles.label}>Tiêu đề tiếng Việt</Text>
                        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="VD: Động từ tình thái ở hiện tại" placeholderTextColor={COLORS.textDark} />

                        <Text style={styles.label}>Mô tả ngắn</Text>
                        <TextInput style={[styles.input, { height: 60 }]} value={description} onChangeText={setDescription} multiline placeholder="Tóm tắt về bài học..." placeholderTextColor={COLORS.textDark} />

                        <Text style={styles.label}>Nội dung chi tiết (Markdown / Text)</Text>
                        <TextInput style={[styles.input, { height: 200, textAlignVertical: 'top' }]} value={content} onChangeText={setContent} multiline placeholder="Giải thích chi tiết quy tắc ngữ pháp..." placeholderTextColor={COLORS.textDark} />

                        <TouchableOpacity style={[styles.saveBtn, saving && styles.disabledBtn]} onPress={handleSave} disabled={saving}>
                            {saving ? <ActivityIndicator color="#FFF" /> : <><Save color="#FFF" size={20} /><Text style={styles.saveBtnText}>Lưu bài học</Text></>}
                        </TouchableOpacity>
                        <View style={{ height: 40 }} />
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.backgroundDeep },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder },
    headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },
    filterBar: { flexDirection: 'row', padding: SPACING.md, gap: 10 },
    filterBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.glassBorder },
    filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    filterText: { color: COLORS.textDark, fontWeight: '700' },
    filterTextActive: { color: '#FFF' },
    listContent: { padding: SPACING.md },
    lessonItem: { backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.md, marginBottom: SPACING.md, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.glassBorder },
    lessonInfo: { flex: 1 },
    lessonTitleDe: { ...TYPOGRAPHY.button, color: COLORS.text, fontSize: 15 },
    lessonTitleVi: { ...TYPOGRAPHY.caption, color: COLORS.textDark },
    tagRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
    levelTag: { backgroundColor: COLORS.primaryAlpha20, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    categoryTag: { backgroundColor: COLORS.secondary + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    tagText: { fontSize: 10, fontWeight: '800', color: COLORS.text },
    actions: { flexDirection: 'row', gap: 10 },
    actionBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surfaceLight, justifyContent: 'center', alignItems: 'center' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder },
    modalTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },
    form: { padding: SPACING.md },
    label: { ...TYPOGRAPHY.caption, color: COLORS.primary, marginBottom: 4, marginTop: 15 },
    input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: 8, padding: 12, color: COLORS.text },
    row: { flexDirection: 'row' },
    picker: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 8, padding: 2, borderWidth: 1, borderColor: COLORS.glassBorder },
    pItem: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
    pItemActive: { backgroundColor: COLORS.primaryAlpha20 },
    pText: { color: COLORS.textDark, fontSize: 12, fontWeight: '600' },
    pTextActive: { color: COLORS.primary },
    saveBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 30, flexDirection: 'row', justifyContent: 'center', gap: 8 },
    saveBtnText: { ...TYPOGRAPHY.button, color: '#FFF' },
    disabledBtn: { opacity: 0.6 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: COLORS.textDark, textAlign: 'center', marginTop: 40 },
});

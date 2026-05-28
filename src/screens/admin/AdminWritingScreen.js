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
} from 'react-native';
import {
    ArrowLeft,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    FileText,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../components/Theme';
import * as adminService from '../../database/services/adminService';

export default function AdminWritingScreen({ navigation }) {
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [saving, setSaving] = useState(false);

    // Filter
    const [levelFilter, setLevelFilter] = useState('A2');

    // Form
    const [title, setTitle] = useState('');
    const [instruction, setInstruction] = useState('');
    const [taskType, setTaskType] = useState('Email');
    const [level, setLevel] = useState('A2');
    const [suggestedLength, setSuggestedLength] = useState('');
    const [requirements, setRequirements] = useState(''); // JSON string

    useEffect(() => {
        loadPrompts();
    }, [levelFilter]);

    const loadPrompts = async () => {
        try {
            setLoading(true);
            const data = await adminService.getWritingPrompts(levelFilter);
            setPrompts(data);
        } catch (error) {
            console.error('Error loading writing prompts:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách đề viết');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingItem(null);
        setTitle('');
        setInstruction('');
        setTaskType('Email');
        setLevel(levelFilter);
        setSuggestedLength('70–100 từ');
        setRequirements(JSON.stringify(['Chào hỏi', 'Nêu vấn đề', 'Kết thúc'], null, 2));
        setModalVisible(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setTitle(item.title);
        setInstruction(item.instruction);
        setTaskType(item.task_type || 'Email');
        setLevel(item.level);
        setSuggestedLength(item.suggested_length || '');
        setRequirements(JSON.stringify(item.requirements || [], null, 2));
        setModalVisible(true);
    };

    const handleDelete = (item) => {
        Alert.alert('Xác nhận', 'Xóa đề viết này?', [
            { text: 'Hủy' },
            {
                text: 'Xóa',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await adminService.deleteWritingPrompt(item.id);
                        loadPrompts();
                    } catch (e) { Alert.alert('Lỗi', 'Không thể xóa'); }
                }
            }
        ]);
    };

    const handleSave = async () => {
        if (!title.trim() || !instruction.trim()) {
            Alert.alert('Lỗi', 'Vui lòng điền đủ thông tin');
            return;
        }

        let requirementsArray = [];
        try {
            requirementsArray = JSON.parse(requirements);
            if (!Array.isArray(requirementsArray)) throw new Error();
        } catch (e) {
            Alert.alert('Lỗi định dạng', 'Trường yêu cầu phải là một mảng JSON (VD: ["A", "B"])');
            return;
        }

        try {
            setSaving(true);
            const data = {
                title,
                instruction,
                task_type: taskType,
                level,
                suggested_length: suggestedLength,
                requirements: requirementsArray,
                updated_at: new Date().toISOString(),
            };

            await adminService.upsertWritingPrompt(data, editingItem?.id);

            setModalVisible(false);
            loadPrompts();
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể lưu đề viết');
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft color={COLORS.text} size={24} /></TouchableOpacity>
                <Text style={styles.headerTitle}>Quản lý Đề Writing</Text>
                <TouchableOpacity onPress={handleAdd}><Plus color={COLORS.primary} size={24} /></TouchableOpacity>
            </View>

            <View style={styles.filterBar}>
                {['A1', 'A2', 'B1', 'B2'].map(lvl => (
                    <TouchableOpacity key={lvl} style={[styles.filterBtn, levelFilter === lvl && styles.filterBtnActive]} onPress={() => setLevelFilter(lvl)}>
                        <Text style={[styles.filterText, levelFilter === lvl && styles.filterTextActive]}>{lvl}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.primary} />
            ) : (
                <FlatList
                    data={prompts}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={{ padding: SPACING.md }}
                    renderItem={({ item }) => (
                        <View style={[styles.card, SHADOWS.glass]}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.typeTag}><Text style={styles.typeText}>{item.task_type}</Text></View>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.cardDesc} numberOfLines={2}>{item.instruction}</Text>
                            </View>
                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => handleEdit(item)}><Edit2 color={COLORS.primary} size={18} /></TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDelete(item)}><Trash2 color="#FF4444" size={18} /></TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            )}

            <Modal visible={modalVisible} animationType="slide">
                <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.backgroundDeep }}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{editingItem ? 'Sửa đề' : 'Thêm đề mới'}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}><X color={COLORS.text} size={24} /></TouchableOpacity>
                    </View>
                    <ScrollView style={{ padding: SPACING.md }}>
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <Text style={styles.label}>Trình độ</Text>
                                <View style={styles.picker}>
                                    {['A1', 'A2', 'B1', 'B2'].map(l => (
                                        <TouchableOpacity key={l} onPress={() => setLevel(l)} style={[styles.pItem, level === l && styles.pItemActive]}><Text style={[styles.pText, level === l && styles.pTextActive]}>{l}</Text></TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Dạng bài</Text>
                                <View style={styles.picker}>
                                    {['Email', 'Beschwerde', 'Meinung'].map(t => (
                                        <TouchableOpacity key={t} onPress={() => setTaskType(t)} style={[styles.pItem, taskType === t && styles.pItemActive]}><FileText color={taskType === t ? COLORS.primary : COLORS.textDark} size={14} /></TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>

                        <Text style={styles.label}>Tiêu đề đề bài</Text>
                        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="VD: E-Mail: Termin beim Arzt" placeholderTextColor={COLORS.textDark} />

                        <Text style={styles.label}>Độ dài gợi ý</Text>
                        <TextInput style={styles.input} value={suggestedLength} onChangeText={setSuggestedLength} placeholder="VD: 70–100 từ" placeholderTextColor={COLORS.textDark} />

                        <Text style={styles.label}>Nội dung hướng dẫn</Text>
                        <TextInput style={[styles.input, { height: 100 }]} value={instruction} onChangeText={setInstruction} multiline placeholder="Nội dung đề bài chi tiết..." placeholderTextColor={COLORS.textDark} />

                        <Text style={styles.label}>Yêu cầu (JSON Array)</Text>
                        <TextInput style={[styles.input, { height: 120, fontFamily: 'monospace' }]} value={requirements} onChangeText={setRequirements} multiline placeholder='["Yêu cầu 1", "Yêu cầu 2"]' placeholderTextColor={COLORS.textDark} />

                        <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.5 }]} onPress={handleSave} disabled={saving}>
                            <Text style={styles.saveBtnText}>{saving ? 'Đang lưu...' : 'Lưu đề viết'}</Text>
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
    card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.glassBorder },
    typeTag: { backgroundColor: COLORS.primaryAlpha20, alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
    typeText: { color: COLORS.primary, fontSize: 10, fontWeight: '800' },
    cardTitle: { color: COLORS.text, fontWeight: '700', fontSize: 15 },
    cardDesc: { color: COLORS.textDark, fontSize: 12, marginTop: 2 },
    actions: { gap: 15, marginLeft: 10 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder },
    modalTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },
    label: { ...TYPOGRAPHY.caption, color: COLORS.primary, marginBottom: 4, marginTop: 15 },
    input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: 8, padding: 12, color: COLORS.text },
    row: { flexDirection: 'row' },
    picker: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 8, padding: 2, borderWidth: 1, borderColor: COLORS.glassBorder },
    pItem: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
    pItemActive: { backgroundColor: COLORS.primaryAlpha20 },
    pText: { color: COLORS.textDark, fontSize: 12, fontWeight: '600' },
    pTextActive: { color: COLORS.primary },
    saveBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 30 },
    saveBtnText: { ...TYPOGRAPHY.button, color: '#FFF' }
});

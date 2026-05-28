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
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../components/Theme';
import * as adminService from '../../database/services/adminService';

export default function AdminVocabularyScreen({ navigation }) {
    const [vocab, setVocab] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [saving, setSaving] = useState(false);

    // Filter states
    const [levelFilter, setLevelFilter] = useState('A2');
    const [topicFilter, setTopicFilter] = useState('');
    const [topics, setTopics] = useState([]);

    // Form states
    const [term, setTerm] = useState('');
    const [article, setArticle] = useState('');
    const [meaning, setMeaning] = useState('');
    const [example, setExample] = useState('');
    const [usage, setUsage] = useState('');
    const [wordType, setWordType] = useState('noun');
    const [topic, setTopic] = useState('');
    const [level, setLevel] = useState('A2');

    useEffect(() => {
        loadTopics();
    }, []);

    useEffect(() => {
        loadVocab();
    }, [levelFilter, topicFilter]);

    const loadTopics = async () => {
        try {
            const uniqueTopics = await adminService.getUniqueVocabularyTopics();
            setTopics(uniqueTopics);
            if (uniqueTopics.length > 0 && !topicFilter) {
                setTopicFilter(uniqueTopics[0]);
            }
        } catch (error) {
            console.error('Error loading unique topics:', error);
        }
    };

    const loadVocab = async () => {
        if (!topicFilter) return;
        try {
            setLoading(true);
            const data = await adminService.getVocabularyItems(levelFilter, topicFilter);
            setVocab(data);
        } catch (error) {
            console.error('Error loading vocab:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách từ vựng');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingItem(null);
        setTerm('');
        setArticle('');
        setMeaning('');
        setExample('');
        setUsage('');
        setWordType('noun');
        setTopic(topicFilter);
        setLevel(levelFilter);
        setModalVisible(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setTerm(item.term);
        setArticle(item.article || '');
        setMeaning(item.meaning);
        setExample(item.example || '');
        setUsage(item.usage || '');
        setWordType(item.word_type || 'noun');
        setTopic(item.topic);
        setLevel(item.level);
        setModalVisible(true);
    };

    const handleDelete = (item) => {
        Alert.alert(
            'Xác nhận xóa',
            `Bạn có chắc muốn xóa từ "${item.term}"?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await adminService.deleteVocabularyItem(item.id);
                            loadVocab();
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể xóa từ vựng');
                        }
                    },
                },
            ]
        );
    };

    const handleSave = async () => {
        if (!term.trim() || !meaning.trim() || !topic.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập Từ, Nghĩa và Chủ đề');
            return;
        }

        try {
            setSaving(true);
            const itemData = {
                term,
                article,
                meaning,
                example,
                usage,
                word_type: wordType,
                topic,
                level,
                updated_at: new Date().toISOString(),
            };

            await adminService.upsertVocabularyItem(itemData, editingItem?.id);

            setModalVisible(false);
            loadVocab();
            loadTopics(); // Refresh topic list in case new topic added
        } catch (error) {
            console.error('Error saving vocab:', error);
            Alert.alert('Lỗi', 'Không thể lưu từ vựng');
        } finally {
            setSaving(false);
        }
    };

    const renderVocabItem = ({ item }) => (
        <View style={[styles.vocabItem, SHADOWS.glass]}>
            <View style={styles.vocabMain}>
                <Text style={styles.vocabTerm}>
                    {item.article ? <Text style={styles.article}>{item.article} </Text> : ''}
                    {item.term}
                </Text>
                <Text style={styles.vocabMeaning}>{item.meaning}</Text>
                <Text style={styles.vocabType}>{item.word_type.toUpperCase()}</Text>
            </View>
            <View style={styles.vocabActions}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
                    <Edit2 color={COLORS.primary} size={16} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionBtn}>
                    <Trash2 color="#FF4444" size={16} />
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
                <Text style={styles.headerTitle}>Quản lý Từ vựng</Text>
                <TouchableOpacity onPress={handleAdd} style={styles.addBtn}>
                    <Plus color={COLORS.primary} size={24} />
                </TouchableOpacity>
            </View>

            {/* Filter Bar */}
            <View style={styles.filterBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                    {['A1', 'A2', 'B1', 'B2'].map(lvl => (
                        <TouchableOpacity
                            key={lvl}
                            style={[styles.filterBtn, levelFilter === lvl && styles.filterBtnActive]}
                            onPress={() => setLevelFilter(lvl)}
                        >
                            <Text style={[styles.filterText, levelFilter === lvl && styles.filterTextActive]}>{lvl}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <View style={styles.topicSelector}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {topics.map(t => (
                            <TouchableOpacity
                                key={t}
                                style={[styles.topicChip, topicFilter === t && styles.topicChipActive]}
                                onPress={() => setTopicFilter(t)}
                            >
                                <Text style={[styles.topicChipText, topicFilter === t && styles.topicChipTextActive]}>{t}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color={COLORS.primary} size="large" />
                </View>
            ) : (
                <FlatList
                    data={vocab}
                    renderItem={renderVocabItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Chưa có từ vựng nào cho bộ lọc này.</Text>
                    }
                />
            )}

            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{editingItem ? 'Sửa từ' : 'Thêm từ mới'}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}><X color={COLORS.text} size={24} /></TouchableOpacity>
                        </View>

                        <ScrollView style={styles.form}>
                            <View style={styles.row}>
                                <View style={{ flex: 1, marginRight: 8 }}>
                                    <Text style={styles.label}>Level</Text>
                                    <View style={styles.pickerContainer}>
                                        {['A1', 'A2', 'B1', 'B2'].map(lvl => (
                                            <TouchableOpacity key={lvl} onPress={() => setLevel(lvl)} style={[styles.pickerItem, level === lvl && styles.pickerItemActive]}>
                                                <Text style={[styles.pickerText, level === lvl && styles.pickerTextActive]}>{lvl}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                                <View style={{ flex: 1.5 }}>
                                    <Text style={styles.label}>Loại từ</Text>
                                    <View style={styles.pickerContainer}>
                                        {['verb', 'noun', 'adjective'].map(type => (
                                            <TouchableOpacity key={type} onPress={() => setWordType(type)} style={[styles.pickerItem, wordType === type && styles.pickerItemActive]}>
                                                <Text style={[styles.pickerText, wordType === type && styles.pickerTextActive]}>{type[0].toUpperCase()}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>

                            <Text style={styles.label}>Chủ đề</Text>
                            <TextInput style={styles.input} value={topic} onChangeText={setTopic} placeholder="VD: Gia đình và mối quan hệ" placeholderTextColor={COLORS.textDark} />

                            <View style={styles.row}>
                                <View style={{ width: 60, marginRight: 8 }}>
                                    <Text style={styles.label}>Quán từ</Text>
                                    <TextInput style={styles.input} value={article} onChangeText={setArticle} placeholder="der/die..." placeholderTextColor={COLORS.textDark} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Từ vựng</Text>
                                    <TextInput style={styles.input} value={term} onChangeText={setTerm} placeholder="z.B. Vater" placeholderTextColor={COLORS.textDark} />
                                </View>
                            </View>

                            <Text style={styles.label}>Nghĩa tiếng Việt</Text>
                            <TextInput style={styles.input} value={meaning} onChangeText={setMeaning} placeholder="VD: Bố" placeholderTextColor={COLORS.textDark} />

                            <Text style={styles.label}>Ví dụ</Text>
                            <TextInput style={[styles.input, styles.textArea]} value={example} onChangeText={setExample} placeholder="Mein Vater arbeitet." placeholderTextColor={COLORS.textDark} multiline />

                            <Text style={styles.label}>Cách dùng / Ghi chú</Text>
                            <TextInput style={[styles.input, styles.textArea]} value={usage} onChangeText={setUsage} placeholder="der Vater / mein Vater" placeholderTextColor={COLORS.textDark} multiline />
                        </ScrollView>

                        <TouchableOpacity style={[styles.saveBtn, saving && styles.disabledBtn]} onPress={handleSave} disabled={saving}>
                            {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Lưu dữ liệu</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.backgroundDeep },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder },
    backBtn: { padding: 4 },
    headerTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },
    addBtn: { padding: 4 },
    filterBar: { paddingBottom: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder },
    filterScroll: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
    filterBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginRight: 8, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.glassBorder },
    filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    filterText: { color: COLORS.textDark, fontWeight: '700' },
    filterTextActive: { color: '#FFF' },
    topicSelector: { paddingHorizontal: SPACING.md, marginTop: 4 },
    topicChip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginRight: 8, backgroundColor: COLORS.surfaceLight },
    topicChipActive: { backgroundColor: COLORS.primaryAlpha20, borderWidth: 1, borderColor: COLORS.primary },
    topicChipText: { color: COLORS.textDark, fontSize: 12 },
    topicChipTextActive: { color: COLORS.primary, fontWeight: '700' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: SPACING.md },
    vocabItem: { backgroundColor: COLORS.surface, borderRadius: 12, flexDirection: 'row', padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.glassBorder },
    vocabMain: { flex: 1 },
    vocabTerm: { ...TYPOGRAPHY.button, color: COLORS.text, fontSize: 16 },
    article: { color: COLORS.primary, fontSize: 14 },
    vocabMeaning: { ...TYPOGRAPHY.caption, color: COLORS.textDark, marginTop: 2 },
    vocabType: { fontSize: 10, color: COLORS.primary, fontWeight: '800', marginTop: 4, letterSpacing: 1 },
    vocabActions: { justifyContent: 'center', gap: 12 },
    actionBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surfaceLight, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: COLORS.textDark, textAlign: 'center', marginTop: 40 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: SPACING.lg },
    modalContent: { backgroundColor: COLORS.backgroundDeep, borderRadius: 20, padding: SPACING.lg, maxHeight: '85%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
    modalTitle: { ...TYPOGRAPHY.h3, color: COLORS.text },
    form: { marginBottom: SPACING.lg },
    label: { ...TYPOGRAPHY.caption, color: COLORS.primary, marginBottom: 4, marginTop: 12 },
    input: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: 8, padding: 10, color: COLORS.text },
    textArea: { height: 60, textAlignVertical: 'top' },
    row: { flexDirection: 'row' },
    pickerContainer: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 8, padding: 2, borderWidth: 1, borderColor: COLORS.glassBorder },
    pickerItem: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
    pickerItemActive: { backgroundColor: COLORS.primaryAlpha20 },
    pickerText: { color: COLORS.textDark, fontSize: 12, fontWeight: '600' },
    pickerTextActive: { color: COLORS.primary },
    saveBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
    saveBtnText: { ...TYPOGRAPHY.button, color: '#FFF' },
    disabledBtn: { opacity: 0.6 }
});

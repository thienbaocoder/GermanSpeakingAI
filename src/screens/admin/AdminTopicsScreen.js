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

export default function AdminTopicsScreen({ navigation }) {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingTopic, setEditingTopic] = useState(null);
    const [saving, setSaving] = useState(false);

    // Form states
    const [title, setTitle] = useState('');
    const [titleDe, setTitleDe] = useState('');
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('BookOpen');
    const [color1, setColor1] = useState('#FFCC00');
    const [color2, setColor2] = useState('#C9A000');

    useEffect(() => {
        loadTopics();
    }, []);

    const loadTopics = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllSpeakingTopics();
            setTopics(data);
        } catch (error) {
            console.error('Error loading topics:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách chủ đề');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingTopic(null);
        setTitle('');
        setTitleDe('');
        setDescription('');
        setIcon('BookOpen');
        setColor1('#FFCC00');
        setColor2('#C9A000');
        setModalVisible(true);
    };

    const handleEdit = (topic) => {
        setEditingTopic(topic);
        setTitle(topic.title);
        setTitleDe(topic.title_de);
        setDescription(topic.description || '');
        setIcon(topic.icon || 'BookOpen');
        setColor1(topic.color_1 || '#FFCC00');
        setColor2(topic.color_2 || '#C9A000');
        setModalVisible(true);
    };

    const handleDelete = (topic) => {
        Alert.alert(
            'Xác nhận xóa',
            `Bạn có chắc chắn muốn xóa chủ đề "${topic.title}"?`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await adminService.deleteSpeakingTopic(topic.id);
                            loadTopics();
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể xóa chủ đề');
                        }
                    },
                },
            ]
        );
    };

    const handleSave = async () => {
        if (!title.trim() || !titleDe.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên chủ đề (Vi & De)');
            return;
        }

        try {
            setSaving(true);
            const topicData = {
                title,
                title_de: titleDe,
                description,
                icon,
                color_1: color1,
                color_2: color2,
                updated_at: new Date().toISOString(),
                ...(editingTopic ? {} : { sort_order: topics.length + 1 })
            };

            await adminService.upsertSpeakingTopic(topicData, editingTopic?.id);

            setModalVisible(false);
            loadTopics();
        } catch (error) {
            console.error('Error saving topic:', error);
            Alert.alert('Lỗi', 'Không thể lưu chủ đề');
        } finally {
            setSaving(false);
        }
    };

    const renderTopicItem = ({ item }) => (
        <View style={[styles.topicItem, SHADOWS.glass]}>
            <View style={[styles.topicColor, { backgroundColor: item.color_1 }]} />
            <View style={styles.topicInfo}>
                <Text style={styles.topicTitleDe}>{item.title_de}</Text>
                <Text style={styles.topicTitleVi}>{item.title}</Text>
            </View>
            <View style={styles.topicActions}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
                    <Edit2 color={COLORS.primary} size={18} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionBtn}>
                    <Trash2 color={COLORS.error || '#FF4444'} size={18} />
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
                <Text style={styles.headerTitle}>Quản lý Chủ đề</Text>
                <TouchableOpacity onPress={handleAdd} style={styles.addBtn}>
                    <Plus color={COLORS.primary} size={24} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color={COLORS.primary} size="large" />
                </View>
            ) : (
                <FlatList
                    data={topics}
                    renderItem={renderTopicItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Chưa có chủ đề nào.</Text>
                    }
                />
            )}

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editingTopic ? 'Sửa Chủ đề' : 'Thêm Chủ đề'}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X color={COLORS.text} size={24} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.form}>
                            <Text style={styles.label}>Tên tiếng Đức</Text>
                            <TextInput
                                style={styles.input}
                                value={titleDe}
                                onChangeText={setTitleDe}
                                placeholder="z.B. Familie und Beziehungen"
                                placeholderTextColor={COLORS.textDark}
                            />

                            <Text style={styles.label}>Tên tiếng Việt</Text>
                            <TextInput
                                style={styles.input}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="VD: Gia đình và mối quan hệ"
                                placeholderTextColor={COLORS.textDark}
                            />

                            <Text style={styles.label}>Mô tả (không bắt buộc)</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Mô tả ngắn về chủ đề"
                                placeholderTextColor={COLORS.textDark}
                                multiline
                                numberOfLines={3}
                            />

                            <View style={styles.row}>
                                <View style={{ flex: 1, marginRight: 8 }}>
                                    <Text style={styles.label}>Màu 1 (HEX)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={color1}
                                        onChangeText={setColor1}
                                        placeholder="#FFCC00"
                                        placeholderTextColor={COLORS.textDark}
                                    />
                                </View>
                                <View style={{ flex: 1, marginLeft: 8 }}>
                                    <Text style={styles.label}>Màu 2 (HEX)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={color2}
                                        onChangeText={setColor2}
                                        placeholder="#C9A000"
                                        placeholderTextColor={COLORS.textDark}
                                    />
                                </View>
                            </View>

                            <Text style={styles.label}>Icon (Lucide name)</Text>
                            <TextInput
                                style={styles.input}
                                value={icon}
                                onChangeText={setIcon}
                                placeholder="VD: User, ShoppingBag, MapPin"
                                placeholderTextColor={COLORS.textDark}
                            />
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.saveBtn, saving && styles.disabledBtn]}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <>
                                    <Save color="#FFF" size={20} />
                                    <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    addBtn: { padding: 4 },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: SPACING.md,
    },
    topicItem: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    topicColor: {
        width: 12,
        height: 40,
        borderRadius: 6,
        marginRight: SPACING.md,
    },
    topicInfo: {
        flex: 1,
    },
    topicTitleDe: {
        ...TYPOGRAPHY.button,
        color: COLORS.text,
        fontSize: 15,
    },
    topicTitleVi: {
        ...TYPOGRAPHY.caption,
        color: COLORS.textDark,
    },
    topicActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        ...TYPOGRAPHY.body,
        color: COLORS.textDark,
        textAlign: 'center',
        marginTop: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.backgroundDeep,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: SPACING.lg,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    modalTitle: {
        ...TYPOGRAPHY.h3,
        color: COLORS.text,
    },
    form: {
        marginBottom: SPACING.xl,
    },
    label: {
        ...TYPOGRAPHY.caption,
        color: COLORS.primary,
        marginBottom: 4,
        marginTop: 12,
    },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        borderRadius: 8,
        padding: 12,
        color: COLORS.text,
        fontSize: 14,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    saveBtnText: {
        ...TYPOGRAPHY.button,
        color: '#FFF',
    },
    disabledBtn: {
        opacity: 0.6,
    },
});

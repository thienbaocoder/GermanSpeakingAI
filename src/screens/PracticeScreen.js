import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { ChevronLeft, ChevronRight, Play, Square, RefreshCw, Send, ArrowLeft } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../components/Theme';
import Card from '../components/Card';
import RecordingWave from '../components/RecordingWave';
import { getApiKey, getLevel } from '../utils/storage';
import { evaluateSpokenGerman } from '../api/gemini';

export default function PracticeScreen({ route, navigation }) {
  const { topicTitle, cards } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Audio state
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [sound, setSound] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Request permissions on mount
    Audio.requestPermissionsAsync();
    
    // Configure audio mode for high-quality voice recording
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      shouldRouteThroughEarpieceAndroid: false,
      playThroughEarpieceAndroid: false,
    });

    return () => {
      // Clean up recordings and sounds
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const activeCard = cards[currentIndex];

  const startRecording = async () => {
    try {
      // Unload previous sound if exists
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        setRecordingUri(null);
      }

      await Audio.requestPermissionsAsync();

      // Configure for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingInstance = new Audio.Recording();
      // Set high-quality WAV/M4A presets depending on platforms
      await recordingInstance.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        }
      });

      setRecording(recordingInstance);
      await recordingInstance.startAsync();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Lỗi', 'Không thể khởi động ghi âm. Vui lòng kiểm tra quyền micro.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
      
      // Configure audio mode back for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const playRecordedAudio = async () => {
    if (!recordingUri) return;
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      setIsPlayingBack(true);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true }
      );
      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlayingBack(false);
        }
      });
    } catch (err) {
      console.error('Failed to play sound', err);
      setIsPlayingBack(false);
    }
  };

  const stopAudioPlayback = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlayingBack(false);
    }
  };

  const handleResetRecording = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    setRecordingUri(null);
    setIsPlayingBack(false);
  };

  const handleAnalyzeAnswer = async () => {
    if (!recordingUri) {
      Alert.alert('Chưa ghi âm', 'Vui lòng nhấn Ghi âm để trả lời trước khi gửi.');
      return;
    }

    const apiKey = await getApiKey();
    if (!apiKey) {
      Alert.alert(
        'Yêu cầu API Key',
        'Vui lòng thêm Gemini API Key ở trang Cài đặt để chấm điểm nói bằng AI.',
        [{ text: 'Đi đến Cài đặt', onPress: () => navigation.navigate('Settings') }]
      );
      return;
    }

    try {
      setIsAnalyzing(true);

      // Read local recording file as a base64 string
      const base64Audio = await FileSystem.readAsStringAsync(recordingUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const userLevel = await getLevel();

      // Trigger Gemini evaluation API
      const result = await evaluateSpokenGerman(
        base64Audio,
        activeCard.question,
        activeCard.suggestedStructure,
        userLevel,
        apiKey
      );

      if (result) {
        // Successful evaluation -> navigate to Evaluation Screen
        navigation.navigate('Evaluation', {
          evaluation: result,
          question: activeCard.question,
          topic: topicTitle,
          audioUri: recordingUri
        });
      } else {
        throw new Error('Chấm điểm thất bại');
      }

    } catch (error) {
      console.error(error);
      Alert.alert('Chấm điểm thất bại', 'Có lỗi xảy ra trong quá trình kết nối với AI. Hãy kiểm tra kết nối mạng hoặc API key.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      handleResetRecording();
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      handleResetRecording();
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Dynamic Overlay Loader when Analyzing */}
      {isAnalyzing && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={COLORS.primaryLight} />
          <Text style={styles.loaderText}>AI đang phân tích câu nói của bạn...</Text>
          <Text style={styles.loaderSub}>Nhận diện giọng nói, kiểm tra phát âm và ngữ pháp</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Topic Header Info */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft color={COLORS.text} size={20} />
          </TouchableOpacity>
          <View style={styles.topicHeaderInfo}>
            <Text style={styles.topicTitleText} numberOfLines={1}>{topicTitle}</Text>
            <Text style={styles.progressText}>Câu hỏi {currentIndex + 1} / {cards.length}</Text>
          </View>
        </View>

        {/* Main Flashcard Component */}
        <Card card={activeCard} />

        {/* Recording Controls Section */}
        <View style={[styles.controlBox, SHADOWS.glass]}>
          <Text style={styles.controlTitle}>Nhấn giữ hoặc chạm để trả lời</Text>
          
          <View style={styles.recordingSection}>
            <RecordingWave isRecording={isRecording} />
            
            {/* Action Record Button */}
            <TouchableOpacity
              style={[
                styles.recordBtn,
                isRecording && styles.recordBtnActive
              ]}
              onPressIn={startRecording}
              onPressOut={stopRecording}
            >
              <Text style={styles.recordBtnText}>
                {isRecording ? 'Đang ghi âm...' : 'Giữ và nói tiếng Đức'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Post-recording triggers */}
          {recordingUri && (
            <View style={styles.postRecordingRow}>
              <TouchableOpacity 
                style={styles.actionCircleBtn} 
                onPress={isPlayingBack ? stopAudioPlayback : playRecordedAudio}
              >
                {isPlayingBack ? <Square size={18} color={COLORS.text} /> : <Play size={18} color={COLORS.text} />}
                <Text style={styles.actionBtnLabel}>{isPlayingBack ? 'Dừng' : 'Nghe lại'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCircleBtn} onPress={handleResetRecording}>
                <RefreshCw size={18} color={COLORS.textMuted} />
                <Text style={styles.actionBtnLabel}>Ghi lại</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionCircleBtn, styles.submitBtn]} onPress={handleAnalyzeAnswer}>
                <Send size={18} color="#FFF" />
                <Text style={[styles.actionBtnLabel, { color: COLORS.primaryLight, fontWeight: '700' }]}>Chấm điểm</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Previous / Next Card Row */}
        <View style={styles.navRow}>
          <TouchableOpacity 
            style={[styles.navBtn, currentIndex === 0 && styles.disabledNavBtn]}
            onPress={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft color={currentIndex === 0 ? COLORS.textDark : COLORS.text} size={24} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navBtn, currentIndex === cards.length - 1 && styles.disabledNavBtn]}
            onPress={handleNext}
            disabled={currentIndex === cards.length - 1}
          >
            <ChevronRight color={currentIndex === cards.length - 1 ? COLORS.textDark : COLORS.text} size={24} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicHeaderInfo: {
    flex: 1,
  },
  topicTitleText: {
    ...TYPOGRAPHY.h3,
    fontSize: 16,
    color: COLORS.text,
  },
  progressText: {
    ...TYPOGRAPHY.caption,
    marginTop: 2,
  },
  controlBox: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: 24,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  controlTitle: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 13,
    marginBottom: SPACING.sm,
  },
  recordingSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  recordBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  recordBtnActive: {
    backgroundColor: COLORS.error,
    shadowColor: COLORS.error,
  },
  recordBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  postRecordingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopColor: COLORS.glassBorder,
    borderTopWidth: 1,
  },
  actionCircleBtn: {
    alignItems: 'center',
    gap: 6,
  },
  submitBtn: {
    // custom glowing style for submit
  },
  actionBtnLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  navBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledNavBtn: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 9, 14, 0.95)',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loaderText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  loaderSub: {
    ...TYPOGRAPHY.bodyMuted,
    fontSize: 13,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
});

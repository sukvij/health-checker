import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { ChatMessage, BackendChatMessage } from '../../types/chats';
import Markdown from 'react-native-markdown-display';
import Voice from '@react-native-community/voice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAX_INPUT_HEIGHT = 120;
const MIN_INPUT_HEIGHT = 40;

export default function ChatAIScreen() {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState<string>('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isListening, setIsListening] = useState<boolean>(false);
    const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);
    const flatListRef = useRef<FlatList>(null);

    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
    const [historyError, setHistoryError] = useState<string | null>(null);

    const recognizedTextRef = useRef<string>(''); // ← Fix voice input
    const voiceError = useRef<string | null>(null);

    // --- Voice Listeners ---
    useEffect(() => {
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechRecognized = onSpeechRecognized;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechStart = useCallback(() => {
        setIsListening(true);
        recognizedTextRef.current = '';
        voiceError.current = null;
        setInputText('बोलिए...');
    }, []);

    const onSpeechRecognized = useCallback(() => {}, []);

    const onSpeechEnd = useCallback(() => {
        setIsListening(false);
        if (voiceError.current) {
            setInputText('');
            Alert.alert('Voice Input Error', voiceError.current);
            voiceError.current = null;
        } else if (recognizedTextRef.current) {
            setInputText(recognizedTextRef.current);
        } else {
            setInputText('');
        }
    }, []);

    const onSpeechResults = useCallback((e: any) => {
        if (e.value && e.value.length > 0) {
            recognizedTextRef.current = e.value[0];
        }
    }, []);

    const onSpeechError = useCallback((e: any) => {
        voiceError.current = e.error?.message || 'Speech recognition failed.';
        setIsListening(false);
        setInputText('');
    }, []);

    const startVoiceToText = async () => {
        if (isListening || isSending) return;

        if (!Voice || typeof Voice.start !== 'function') {
            Alert.alert('Voice module error', 'Voice recognition is not available. Please rebuild the app.');
            return;
        }

        try {
            await Voice.start('en-IN');
        } catch (error: any) {
            console.error('Voice start error:', error);
            Alert.alert('Voice Input Error', error.message || 'Cannot start voice recognition.');
            setIsListening(false);
            setInputText('');
        }
    };

    const stopVoiceToText = async () => {
        if (!isListening) return;
        try {
            await Voice.stop();
        } catch (error: any) {
            console.error('Stop voice error:', error);
        }
    };

    // --- Fetch chat history ---
    useEffect(() => {
        const loadChatData = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('currentUserId');
                if (!storedUserId) throw new Error('User not logged in.');
                // alert(storedUserId)

                const userId = Number(storedUserId);
                setCurrentUserId(userId);

                const response = await fetch(`https://health-backend-xrim.onrender.com/history/${userId}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed: ${response.status} - ${errorText}`);
                }

                const fetchedHistory: BackendChatMessage[] = await response.json();
                const transformed: ChatMessage[] = [];

                fetchedHistory.forEach((chat) => {
                    transformed.push({
                        // id: chat.id,
                        userId: chat.user_id,
                        text: chat.text,
                        sender: 'user',
                        timestamp: chat.timestamp,
                    });
                    if (chat.response) {
                        transformed.push({
                            // id: `${chat.id}-res`,
                            userId: chat.user_id,
                            text: chat.response,
                            sender: 'ai',
                            timestamp: chat.timestamp,
                        });
                    }
                });

                setMessages(
                    transformed.length
                        ? transformed
                        : [
                              {
                                //   id: 1,
                                  userId,
                                  text: 'नमस्ते! मैं आपका हेल्थचेक AI हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?',
                                  sender: 'ai',
                                  timestamp: new Date().toISOString(),
                              },
                          ]
                );
            } catch (e: any) {
                setHistoryError(e.message || 'Failed to load chat history.');
                setMessages([
                    {
                        // id: 1,
                        userId: 0,
                        text: `त्रुटि: ${e.message}`,
                        sender: 'ai',
                        timestamp: new Date().toISOString(),
                    },
                ]);
            } finally {
                setIsLoadingHistory(false);
            }
        };

        loadChatData();
    }, []);

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputText.trim() || !currentUserId || isSending) return;

        const userMessage: ChatMessage = {
            // id: Date.now(),
            userId: currentUserId,
            text: inputText.trim(),
            sender: 'user',
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');
        setIsSending(true);

        try {
            const response = await fetch(`https://health-backend-xrim.onrender.com/history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: currentUserId,
                    text: userMessage.text,
                    sender: 'user',
                    timestamp: userMessage.timestamp,
                }),
            });

            const aiText = await response.text();
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    userId: currentUserId,
                    text: aiText,
                    sender: 'ai',
                    timestamp: new Date().toISOString(),
                },
            ]);
        } catch (e: any) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    userId: currentUserId,
                    text: `AI प्रतिक्रिया नहीं मिल सकी। ${e.message}`,
                    sender: 'ai',
                    timestamp: new Date().toISOString(),
                },
            ]);
        } finally {
            setIsSending(false);
        }
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => (
        <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
            {item.sender === 'ai' ? (
                <Markdown style={markdownStyles}>{item.text}</Markdown>
            ) : (
                <Text style={styles.userText}>{item.text}</Text>
            )}
            <Text style={item.sender === 'user' ? styles.userTimestamp : styles.aiTimestamp}>
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );

    if (isLoadingHistory) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>चैट हिस्ट्री लोड हो रही है...</Text>
            </View>
        );
    }

    if (historyError || !currentUserId) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{historyError || 'यूज़र आईडी लोड करने में विफल।'}</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 60}
        >
            <View style={{ flex: 1 }}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    // keyExtractor={(item) => String(item.id)}
                    renderItem={renderMessage}
                    contentContainerStyle={[styles.messageList, { paddingBottom: 100 }]}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.textInput, { height: inputHeight }]}
                        placeholder={isListening ? 'बोलिए...' : 'अपना संदेश लिखें...'}
                        placeholderTextColor="#888"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        onContentSizeChange={(e) =>
                            setInputHeight(
                                Math.max(MIN_INPUT_HEIGHT, Math.min(MAX_INPUT_HEIGHT, e.nativeEvent.contentSize.height))
                            )
                        }
                        editable={!isSending && !isListening}
                    />
                    <TouchableOpacity
                        style={[styles.microphoneButton, isListening && styles.microphoneButtonActive]}
                        onPress={isListening ? stopVoiceToText : startVoiceToText}
                    >
                        <MaterialCommunityIcons
                            name={isListening ? 'microphone-off' : 'microphone'}
                            size={24}
                            color={isListening ? '#fff' : '#333'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sendButton, (!inputText.trim() || isSending) && styles.sendButtonDisabled]}
                        onPress={handleSendMessage}
                        disabled={!inputText.trim() || isSending}
                    >
                        {isSending ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.sendButtonText}>भेजें</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorText: { fontSize: 16, color: '#d9534f', textAlign: 'center' },
    messageList: { padding: 10 },
    messageBubble: {
        maxWidth: '75%',
        padding: 10,
        borderRadius: 15,
        marginBottom: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    userBubble: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6', borderBottomRightRadius: 2 },
    aiBubble: { alignSelf: 'flex-start', backgroundColor: '#E5E5EA', borderBottomLeftRadius: 2 },
    userText: { fontSize: 16, color: '#333' },
    userTimestamp: { fontSize: 10, color: '#666', alignSelf: 'flex-end', marginTop: 5 },
    aiTimestamp: { fontSize: 10, color: '#666', alignSelf: 'flex-start', marginTop: 5 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: '#fff',
        marginBottom: 100
    },
    textInput: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        maxHeight: MAX_INPUT_HEIGHT,
        minHeight: MIN_INPUT_HEIGHT,
    },
    microphoneButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    microphoneButtonActive: {
        backgroundColor: '#FF0000',
    },
    sendButton: {
        width: 50,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#A0C8FF',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

const markdownStyles = StyleSheet.create({
    body: { fontSize: 16, lineHeight: 24, color: '#333' },
    heading1: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#222' },
    heading2: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#222' },
    list_item: { fontSize: 16, color: '#333', marginLeft: 10, marginBottom: 4 },
    bullet_list: { marginBottom: 5 },
    strong: { fontWeight: 'bold' },
    em: { fontStyle: 'italic' },
});

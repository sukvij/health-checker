// app/(screens)/chat_ai.tsx
import { View, Text, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { ChatMessage, BackendChatMessage } from '../../types/chats'; // Import both types
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Markdown from 'react-native-markdown-display'; // Import the Markdown component

const MAX_INPUT_HEIGHT = 120;
const MIN_INPUT_HEIGHT = 40;

export default function ChatAIScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);
  const flatListRef = useRef<FlatList>(null);

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // --- Effect to fetch userId from AsyncStorage and load chat history ---
  useEffect(() => {
    const loadChatData = async () => {
      setIsLoadingHistory(true);
      setHistoryError(null);
      
      try {
        const storedUserId = await localStorage.getItem('currentUserId');
        if (!storedUserId) {
          throw new Error('User not logged in. User ID not found.');
        }
        const userId = Number(storedUserId);
        setCurrentUserId(userId);

        const response = await fetch(`http://localhost:8080/history/${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch chat history: ${response.status} - ${errorText || response.statusText}`);
        }

        const fetchedHistory: BackendChatMessage[] = await response.json();
        
        const transformedMessages: ChatMessage[] = [];
        fetchedHistory.forEach((chatEntry, index) => {
            // Add user's message
            transformedMessages.push({
                id: chatEntry.id, // Using backend ID for user message part
                userId: chatEntry.user_id,
                text: chatEntry.text,
                sender: 'user',
                timestamp: chatEntry.timestamp,
            });
            // Add AI's response if it exists
            if (chatEntry.response) {
                // Generate a unique ID for the AI's response part
                transformedMessages.push({
                    id: chatEntry.id + 0.5, // Simple way to make it unique for this pair
                    userId: chatEntry.user_id,
                    text: chatEntry.response,
                    sender: 'ai',
                    timestamp: chatEntry.timestamp, // You might use a different timestamp if AI has its own
                });
            }
        });

        if (transformedMessages.length === 0) {
          setMessages([
            { id: Date.now(), userId: userId, text: "नमस्ते! मैं आपका हेल्थचेक AI हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?", sender: 'ai', timestamp: new Date().toISOString() },
          ]);
        } else {
          setMessages(transformedMessages);
        }

      } catch (e: any) {
        console.error('Chat history error:', e);
        setHistoryError(`चैट हिस्ट्री लोड नहीं हो सकी। ${e.message || 'नेटवर्क समस्या।'}`);
        setMessages([
          { id: Date.now(), userId: 0, text: `त्रुटि: चैट लोड नहीं हो सकी: ${e.message || 'कृपया अपना कनेक्शन जांचें।'}`, sender: 'ai', timestamp: new Date().toISOString() },
        ]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatData();
  }, []);

  // --- Effect to scroll to bottom when messages array changes ---
  useEffect(() => {
    if (messages.length > 0 && !isSending) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, isSending]);

  // --- Handle sending a new message ---
  const handleSendMessage = async () => {
    if (inputText.trim() === '' || !currentUserId || isSending) return;

    const userMessageText = inputText.trim();
    const newUserMessage: ChatMessage = {
      id: Date.now(), // Frontend ID
      userId: currentUserId,
      text: userMessageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    // Optimistically add user's message to UI
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputText('');
    setInputHeight(MIN_INPUT_HEIGHT);
    setIsSending(true);

    try {
      const response = await fetch(`http://localhost:8080/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUserId, // Backend expects user_id
          text: userMessageText,
          sender: 'user',
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`संदेश भेजने में विफल: ${response.status} - ${errorText || response.statusText}`);
      }

      // Backend returns a single string AI response
      const aiResponseText: string = await response.text(); 
      console.log('AI रॉ प्रतिक्रिया:', aiResponseText);

      const newAiMessage: ChatMessage = {
        id: Date.now() + 1, // Unique ID for AI message
        userId: currentUserId,
        text: aiResponseText, // AI's response is the text for this message
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      // Add AI's response to UI
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);

    } catch (e: any) {
      console.error('संदेश भेजने का API त्रुटि:', e);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now() + 2, // Unique ID for error message
          userId: currentUserId || 0,
          text: `त्रुटि: AI प्रतिक्रिया नहीं मिल सकी। ${e.message || 'नेटवर्क समस्या।'}`,
          sender: 'ai',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleContentSizeChange = (event: any) => {
    const newHeight = Math.max(MIN_INPUT_HEIGHT, Math.min(MAX_INPUT_HEIGHT, event.nativeEvent.contentSize.height));
    setInputHeight(newHeight);
  };

  // --- renderMessage function remains the same, as it now receives proper ChatMessage objects ---
  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
      {item.sender === 'ai' ? (
        // Render AI messages using Markdown
        <Markdown style={markdownStyles}>{item.text}</Markdown>
      ) : (
        // Render user messages as plain Text
        <Text style={styles.userText}>{item.text}</Text>
      )}
      {item.timestamp && (
        <Text style={item.sender === 'user' ? styles.userTimestamp : styles.aiTimestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}
    </View>
  );

  // const handleGoToDashboard = () => {
  //   router.back();
  // };

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
        <Text style={styles.errorText}>{historyError || 'यूज़र आईडी लोड करने में विफल। कृपया फिर से लॉग इन करें।'}</Text>
        {/* <TouchableOpacity onPress={handleGoToDashboard} style={styles.backButton}>
          <Text style={styles.backButtonText}>← डैशबोर्ड पर वापस</Text>
        </TouchableOpacity> */}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} 
    >
      {/* <TouchableOpacity onPress={handleGoToDashboard} style={styles.backButton}>
        <Text style={styles.backButtonText}>← डैशबोर्ड पर वापस</Text>
      </TouchableOpacity> */}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList} 
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.textInput, { height: inputHeight }]}
          placeholder="अपना संदेश लिखें..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
          onContentSizeChange={handleContentSizeChange}
          onSubmitEditing={handleSendMessage} 
          returnKeyType="send" 
          editable={!isSending} 
          multiline 
          textAlignVertical="top" 
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={isSending || inputText.trim() === ''} 
        >
          {isSending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.sendButtonText}>भेजें</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#ECE5DD', 
  },
  messageList: {
    paddingVertical: 10,
    paddingHorizontal: 10, 
    flexGrow: 1, 
    justifyContent: 'flex-end', 
    paddingBottom: 20,
  },
  messageBubble: {
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 8, 
    marginBottom: 8, 
    maxWidth: '80%',
    position: 'relative', 
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6', 
    borderTopLeftRadius: 18, 
    borderTopRightRadius: 18, 
    borderBottomLeftRadius: 18, 
    borderBottomRightRadius: 4, 
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 18, 
    borderTopRightRadius: 18, 
    borderBottomRightRadius: 18, 
    borderBottomLeftRadius: 4, 
    borderColor: '#E0E0E0', 
    borderWidth: 1,
  },
  userText: {
    color: '#000', 
    fontSize: 16,
  },
  aiText: { 
    color: '#000', 
    fontSize: 16,
  },
  userTimestamp: {
    color: '#777', 
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  aiTimestamp: {
    color: '#777', 
    fontSize: 10,
    marginTop: 4,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 8, 
    backgroundColor: '#F0F0F0', 
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC', 
    borderRadius: 25, 
    paddingHorizontal: 15,
    paddingVertical: 10, 
    marginRight: 8, 
    backgroundColor: '#fff',
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#128C7E', 
    borderRadius: 25, 
    width: 50, 
    height: 50, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECE5DD',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ECE5DD',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Styles for Markdown rendering. Adjust these as needed to match your design.
const markdownStyles = StyleSheet.create({
    body: { // General text style applied to the whole Markdown content
        fontSize: 16,
        color: '#000',
    },
    heading1: { // Styles for # headings
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        color: '#333', // Ensure color is explicitly set
    },
    heading2: { // Styles for ## headings
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 4,
        color: '#333', // Ensure color is explicitly set
    },
    strong: { // Styles for **bold** text
        fontWeight: 'bold',
    },
    em: { // Styles for *italic* text
        fontStyle: 'italic',
    },
    list_item: { // Styles for list items
        marginBottom: 4,
        fontSize: 16,
        color: '#000',
    },
    bullet_list: { // Container for unordered lists
        marginBottom: 8,
    },
    ordered_list: { // Container for ordered lists
        marginBottom: 8,
    },
    link: { // Styles for [links](url)
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
    paragraph: { // Styles for paragraphs
        marginBottom: 5,
        marginTop: 0, 
        paddingTop: 0,
        paddingBottom: 0,
        color: '#000', // Ensure color is explicitly set for paragraphs
    },
    text: { // General text style for any non-specific markdown text nodes
      color: '#000',
      fontSize: 16,
    }
});

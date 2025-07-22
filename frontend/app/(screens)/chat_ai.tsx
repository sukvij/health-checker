// app/(screens)/chat_ai.tsx
import { View, Text, StyleSheet, FlatList, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../../types/chats'; // Import ChatMessage type
import * as aiService from '../../services/AIService'; // Import AI service (which also uses dummy data)

// Define a maximum height for the input text area to prevent it from taking up too much screen space
const MAX_INPUT_HEIGHT = 120; // Example: roughly 3-4 lines of text
const MIN_INPUT_HEIGHT = 40; // Initial minimum height for the input field

export default function ChatAIScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init-ai', text: "Hello! I'm your HealthCheck AI. How can I assist you today?", sender: 'ai', timestamp: new Date().toISOString() },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT); // State to manage TextInput height
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    // --- DATABASE INITIALIZATION (COMMENTED OUT) ---
    // In a real application, you might initialize your database service here.
    // databaseService.initializeFirebase();

    // --- REAL-TIME CHAT HISTORY FETCH (COMMENTED OUT) ---
    /*
    const unsubscribe = databaseService.onChatHistoryUpdate((fetchedMessages) => {
      if (fetchedMessages.length === 0) {
        setMessages([{ id: 'init-ai', text: "Hello! I'm your HealthCheck AI. How can I assist you today?", sender: 'ai', timestamp: new Date().toISOString() }]);
      } else {
        setMessages(fetchedMessages);
      }
    });
    return () => {
      // unsubscribe(); // Uncomment in a real app to clean up database listener
    };
    */
    // --- END COMMENTED OUT DATABASE LOGIC ---
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages array changes
    // This is crucial to keep the latest messages visible above the keyboard.
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessageText = inputText.trim();
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputText(''); // Clear input field after sending
    setInputHeight(MIN_INPUT_HEIGHT); // Reset input height after sending
    setIsSending(true);

    // --- SAVE USER MESSAGE TO DATABASE (COMMENTED OUT) ---
    // await databaseService.saveChatHistory(updatedMessages);
    // --- END COMMENTED OUT DATABASE LOGIC ---

    const aiResponseText = await aiService.getAISuggestion(userMessageText);
    const newAiMessage: ChatMessage = {
      id: Date.now().toString() + 'ai',
      text: aiResponseText,
      sender: 'ai',
      timestamp: new Date().toISOString(),
    };

    const finalMessages = [...updatedMessages, newAiMessage];
    setMessages(finalMessages);
    setIsSending(false);

    // --- SAVE FULL CHAT HISTORY TO DATABASE (COMMENTED OUT) ---
    // await databaseService.saveChatHistory(finalMessages);
    // --- END COMMENTED OUT DATABASE LOGIC ---
  };

  // Function to dynamically adjust TextInput height
  const handleContentSizeChange = (event: any) => {
    const newHeight = Math.max(MIN_INPUT_HEIGHT, Math.min(MAX_INPUT_HEIGHT, event.nativeEvent.contentSize.height));
    setInputHeight(newHeight);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.messageBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
      <Text style={item.sender === 'user' ? styles.userText : styles.aiText}>{item.text}</Text>
      {item.timestamp && (
        <Text style={item.sender === 'user' ? styles.userTimestamp : styles.aiTimestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      // Offset for iOS. This value often needs fine-tuning based on your specific device/emulator.
      // It should account for the height of your navigation bar/header and any bottom safe area.
      // A value of 90-100 is common. Adjust if the input is still obscured.
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} 
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        // Add sufficient padding at the bottom of the FlatList content
        // This ensures the last messages are not hidden behind the input bar
        contentContainerStyle={styles.messageList} 
        // These ensure the list scrolls to the end when content changes
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.textInput, { height: inputHeight }]} // Apply dynamic height
          placeholder="Type your message..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
          onContentSizeChange={handleContentSizeChange} // Listen for content size changes
          onSubmitEditing={handleSendMessage} 
          returnKeyType="send" 
          editable={!isSending} 
          multiline // Ensure multiline input is enabled
          textAlignVertical="top" // Ensure text starts from the top
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={isSending || inputText.trim() === ''} 
        >
          {isSending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.sendButtonText}>Send</Text>
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
    paddingBottom: 20, // Keep a base padding at the bottom
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
    alignItems: 'flex-end', // Align items to the bottom of the container
    paddingHorizontal: 10,
    paddingVertical: 8, 
    backgroundColor: '#F0F0F0', 
    marginBottom: 100,
    // No marginBottom here, KeyboardAvoidingView handles the lift.
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC', 
    borderRadius: 25, 
    paddingHorizontal: 15,
    paddingVertical: 10, // Adjust padding to control initial height
    marginRight: 8, 
    backgroundColor: '#fff',
    fontSize: 16,
    // minHeight is now managed by the state `inputHeight`
    // maxHeight is implicitly handled by `MAX_INPUT_HEIGHT` in `handleContentSizeChange`
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
});

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Send, Heart, Zap, Stethoscope, User } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import Constants from 'expo-constants';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

// OpenAI API Configuration
// Try multiple sources for API key (works in both dev and production builds)
const getOpenAIApiKey = () => {
  // Priority 1: From expo config (works in all builds including APK)
  const fromConfig = Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY;
  if (fromConfig && fromConfig.trim() !== '' && !fromConfig.includes('your-openai-api-key')) {
    return fromConfig;
  }
  
  // Priority 2: From process.env (works in dev)
  const fromEnv = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (fromEnv && fromEnv.trim() !== '' && !fromEnv.includes('your-openai-api-key')) {
    return fromEnv;
  }
  
  return null;
};

const OPENAI_API_KEY = getOpenAIApiKey();
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Debug: Log API key status (always log for debugging)
console.log('🔑 [AI] API Key Status:', {
  hasKey: !!OPENAI_API_KEY,
  keyPreview: OPENAI_API_KEY ? `${OPENAI_API_KEY.substring(0, 10)}...` : 'NOT FOUND',
  fromConfig: !!Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY,
  fromEnv: !!process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  isDev: __DEV__
});

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are Mewi, a friendly and knowledgeable AI cat assistant integrated into the PawfectMatch mobile application, specifically designed for users in Bangladesh. Your personality is warm, caring, playful, and professional yet casual - like a wise cat who loves helping pet owners in the Bangladeshi context.

ABOUT PAWFECTMATCH APP:
- PawfectMatch is a comprehensive pet adoption and care platform operating in Bangladesh
- Developed by CoreWe5 - a talented development team
- Users can discover pets, save favorites, learn about pet care, shop for pet supplies, and chat with you (Mewi)
- The app helps connect pet lovers with their perfect furry companions across Bangladesh
- Users can browse pet profiles, apply for adoptions, and access educational resources
- You are part of the "AI Vet" feature within the app's main navigation
- When users ask about the app or developers, you can mention that PawfectMatch is developed by CoreWe5

BANGLADESH-SPECIFIC CONTEXT:
- You are operating in Bangladesh, so provide advice relevant to the local environment
- Climate: Tropical monsoon climate with hot, humid summers and mild winters
- Common pets in Bangladesh: Cats, dogs, birds (parrots, mynahs), rabbits, fish
- Local currency: Bangladeshi Taka (BDT/৳)
- Common pet food brands available: Local and international brands
- Veterinary services: Available in major cities (Dhaka, Chittagong, Sylhet, etc.)
- Pet adoption: Growing trend, especially in urban areas
- Local pet care practices: Mix of traditional and modern approaches
- Seasonal considerations: Monsoon season (June-October), hot summer (March-May), mild winter (November-February)
- Common health issues: Heat-related issues in summer, skin problems during monsoon, respiratory issues in winter
- Pet supplies: Available in pet shops in major cities, online platforms, and local markets
- Language: You can use Bangla terms when appropriate (like "বিড়াল" for cat, "কুকুর" for dog) but primarily communicate in English

Key characteristics:
- Your name is Mewi - introduce yourself as Mewi
- Use emojis naturally to make responses engaging (🐾 🐱 🐈 💕 😸 etc.)
- Keep responses concise but informative (2-4 sentences usually)
- Be encouraging and supportive
- Add a playful cat-like personality when appropriate
- Always consider Bangladesh's climate, local availability of resources, and cultural context
- Provide practical advice that works in the Bangladeshi environment
- Mention local veterinary clinics or pet shops when relevant
- Consider local pet food availability and pricing in BDT when discussing nutrition
- Be aware of seasonal pet care needs (monsoon, summer heat, etc.)
- Always remind users to consult a licensed veterinarian for serious health concerns
- Focus on general pet care, nutrition, training, and behavior relevant to Bangladesh
- Be empathetic and understanding of pet owners' concerns
- When relevant, you can mention that users can browse pets, save favorites, or access learning resources within the PawfectMatch app
- If users ask about adopting pets, you can guide them to use the Discover tab in the app
- Understand that pet ownership culture is growing in Bangladesh, especially in urban areas

Remember: You provide helpful guidance but are NOT a replacement for professional veterinary care. Always encourage users to see a vet for emergencies or serious medical issues. Provide advice that is practical and relevant to the Bangladeshi context.`;

// AI Avatar Configuration - Using local Mewi image
const MEWI_AVATAR = require('../../assets/images/Mewi.jpg');

export default function AIVetScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "🐱 Meow! Hi there! I'm Mewi, your friendly AI cat assistant! I'm here to help with basic pet care questions. What would you like to know about your furry friend today? Remember, for serious health concerns, always consult with a licensed veterinarian! 💕",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Check if API key is loaded
      if (!OPENAI_API_KEY || OPENAI_API_KEY.includes('your-openai-api-key') || OPENAI_API_KEY.trim() === '') {
        console.error('❌ [AI] OpenAI API Key not configured properly');
        console.error('❌ [AI] Key value:', OPENAI_API_KEY ? 'Present but invalid' : 'Missing');
        
        // Provide different messages for dev vs production
        if (__DEV__) {
          return "🐾 Oops! The OpenAI API key is not configured. Please add your API key to the .env file and restart the dev server with 'npx expo start --clear'.";
        } else {
          return "🐾 Sorry! Mewi is temporarily unavailable. The AI service needs to be configured. Please contact support or try again later.";
        }
      }

      console.log('API Key loaded (first 10 chars):', OPENAI_API_KEY.substring(0, 10));

      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));

      // Add the new user message
      conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // Call OpenAI ChatGPT API using fetch
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory.slice(-10) // Keep last 10 messages for context
          ],
          max_tokens: 250,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', response.status, errorData);
        throw { status: response.status, data: errorData };
      }

      const data = await response.json();
      console.log('API Response received successfully');
      return data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again! 🐾";
    } catch (error: any) {
      console.error('ChatGPT API Error:', error);
      
      // Handle specific error cases
      if (error?.status === 429) {
        return "🐾 I'm getting too many requests right now! Please wait a moment and try again.";
      } else if (error?.status === 401) {
        console.error('❌ [AI] 401 Error - API Key authentication failed. Error details:', error.data);
        if (__DEV__) {
          return "🐾 Authentication failed! Please check your OpenAI API key in the .env file and restart the dev server with 'npx expo start --clear'.";
        } else {
          return "🐾 Sorry! Mewi couldn't authenticate with the AI service. This might be a configuration issue. Please try again later or contact support.";
        }
      } else if (Platform.OS === 'web' && typeof navigator !== 'undefined' && !navigator.onLine) {
        return "🐾 It seems you're offline! Please check your internet connection and try again.";
      }
      
      return "🐾 I'm having trouble connecting right now. Please try again in a moment! If the issue persists, consult your veterinarian directly.";
    }
  };

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Scroll to bottom after user message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const aiResponse = await getAIResponse(userMessage.text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Scroll to bottom after AI response
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error in handleSend:', error);
      setIsTyping(false);
      Alert.alert('Error', 'Failed to get response. Please try again.');
    }
  };

  const renderMessage = (message: Message) => {
    const timeString = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
      <View key={message.id} style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage
      ]}>
        {!message.isUser && (
          <View style={styles.aiAvatar}>
            <View style={styles.aiAvatarContainer}>
              <Image 
                source={MEWI_AVATAR}
                style={styles.aiAvatarImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.stethoscopeIcon}>
              <Stethoscope size={12} color={COLORS.primary} />
            </View>
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.aiBubble
        ]}>
          <Text 
            style={[
              styles.messageText,
              message.isUser ? styles.userText : styles.aiText
            ]}
            allowFontScaling={true}
            selectable={true}
          >
            {message.text}
          </Text>
          <View style={[
            styles.timestampContainer,
            message.isUser ? styles.userTimestampContainer : styles.aiTimestampContainer
          ]}>
            <Text style={[
              styles.timestamp,
              message.isUser ? styles.userTimestamp : styles.aiTimestamp
            ]}>
              {timeString}
            </Text>
          </View>
        </View>
        
        {message.isUser && (
          <View style={styles.userAvatar}>
            {profile?.avatar_url ? (
              <Image 
                source={{ uri: profile.avatar_url }}
                style={styles.userAvatarImage}
              />
            ) : (
              <User size={16} color="white" />
            )}
          </View>
        )}
      </View>
    );
  };

  const quickQuestions = [
    "How often should I feed my puppy?",
    "What are signs of a healthy pet?",
    "How to train my dog to sit?",
    "Emergency first aid for pets"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Profile Button */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Mewi</Text>
          <Text style={styles.headerSubtitle}>AI Cat Assistant</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.onlineIndicator}>
            <Zap size={16} color="#10B981" />
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <User size={24} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
          
          {isTyping && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={styles.aiAvatar}>
                <View style={styles.aiAvatarContainer}>
                  <Image 
                    source={MEWI_AVATAR}
                    style={styles.aiAvatarImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.stethoscopeIcon}>
                  <Stethoscope size={12} color={COLORS.primary} />
                </View>
              </View>
              <View style={[styles.messageBubble, styles.aiBubble]}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {messages.length === 1 && (
          <View style={styles.quickQuestionsContainer}>
            <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
            {quickQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickQuestionButton}
                onPress={() => handleQuickQuestion(question)}
              >
                <Text style={styles.quickQuestionText}>{question}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask Mewi anything about your pet..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, inputText.trim() !== '' && styles.sendButtonActive]}
            onPress={handleSend}
            disabled={inputText.trim() === ''}
          >
            <Send size={20} color={inputText.trim() !== '' ? "white" : "#CCC"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.disclaimer}>
        <View style={styles.disclaimerIcon}>
          <Text style={styles.disclaimerEmoji}>💡</Text>
        </View>
        <Text style={styles.disclaimerText}>
          Mewi provides general pet care guidance. For emergencies, consult a licensed veterinarian.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingBottom: 90, // Add padding for tab bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  onlineIndicator: {
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 20,
  },
  profileButton: {
    padding: 10,
    backgroundColor: `${COLORS.secondary}15`,
    borderRadius: 12,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
    paddingLeft: 50, // Add space on left for user messages
  },
  aiMessage: {
    justifyContent: 'flex-start',
    paddingRight: 50, // Add space on right for AI messages
  },
  aiAvatar: {
    width: 36,
    height: 36,
    marginRight: 12,
    position: 'relative',
    alignSelf: 'flex-end',
  },
  aiAvatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF5E6',
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catEmoji: {
    fontSize: 20,
  },
  aiAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  stethoscopeIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    overflow: 'hidden',
  },
  userAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  messageBubble: {
    maxWidth: '75%',
    minWidth: 60,
    borderRadius: 16,
    padding: 14,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    marginLeft: 'auto',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'Nunito-Regular',
    lineHeight: 22,
    marginBottom: 6,
    flexShrink: 1,
    // Default color - will be overridden by userText or aiText
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#000000', // Pure black for maximum contrast on white background
    fontWeight: '400' as const,
  },
  timestampContainer: {
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestampContainer: {
    alignSelf: 'flex-end',
  },
  aiTimestampContainer: {
    alignSelf: 'flex-start',
  },
  timestamp: {
    fontSize: 11,
    fontFamily: 'Nunito-Medium',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  aiTimestamp: {
    color: '#999',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#999',
    marginHorizontal: 2,
  },
  quickQuestionsContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#333',
    marginBottom: 12,
  },
  quickQuestionButton: {
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  quickQuestionText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#333',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: COLORS.primary,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 10,
  },
  disclaimerIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disclaimerEmoji: {
    fontSize: 14,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Nunito-Regular',
    color: '#666',
    lineHeight: 15,
  },
});

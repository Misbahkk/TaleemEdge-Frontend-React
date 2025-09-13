"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Send, Bot, User, Loader2, Plus, MessageSquare } from "lucide-react"
import api from "@/components/axiosInstance"

interface Message {
  id: string
  content: string
  message_type: "user" | "bot"
  timestamp: string
  metadata?: any
}

interface ChatSession {
  id: string
  title: string
  created_at: string
  updated_at: string
  is_active: boolean
  messages: Message[]
  latest_message?: {
    content: string
    timestamp: string
    message_type: string
  }
  message_count: number
}

interface SendMessageResponse {
  session_id: string
  user_message: {
    id: string
    message_type: string
    content: string
    timestamp: string
    metadata: any
  }
  bot_response: {
    id: string
    message_type: string
    content: string
    timestamp: string
    metadata: any
  }
}

interface SessionListItem {
  id: string
  title: string
  created_at: string
  updated_at: string
  is_active: boolean
  latest_message?: {
    content: string
    timestamp: string
    message_type: string
  }
  message_count: number
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sessions, setSessions] = useState<SessionListItem[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [currentSessionTitle, setCurrentSessionTitle] = useState<string>("")
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load sessions and restore last active session on component mount
  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setIsLoadingSessions(true)
      const response = await api.get('/chatbot/sessions/')
      const sessionsList: SessionListItem[] = response.data
      setSessions(sessionsList)
      
      // Get last active session from localStorage or use the most recent one
      const savedSessionId = localStorage.getItem('currentChatSessionId')
      let sessionToLoad = null
      
      if (savedSessionId) {
        sessionToLoad = sessionsList.find(s => s.id === savedSessionId)
      }
      
      // If no saved session or saved session not found, use the most recent one
      if (!sessionToLoad && sessionsList.length > 0) {
        sessionToLoad = sessionsList[0] // Most recent session
      }
      
      if (sessionToLoad) {
        await loadSessionMessages(sessionToLoad.id)
      } else {
        // No sessions found, show welcome message
        setMessages([
          {
            id: "welcome",
            content: "Hello! I'm your AI learning assistant. How can I help you today?",
            message_type: "bot",
            timestamp: new Date().toISOString(),
          },
        ])
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
      // If error loading sessions, show welcome message
      setMessages([
        {
          id: "welcome",
          content: "Hello! I'm your AI learning assistant. How can I help you today?",
          message_type: "bot",
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setIsLoadingSessions(false)
    }
  }

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const response = await api.get(`/chatbot/sessions/${sessionId}/`)
      const sessionData: ChatSession = response.data
      
      setCurrentSessionId(sessionId)
      setCurrentSessionTitle(sessionData.title)
      setMessages(sessionData.messages || [])
      
      // Save current session to localStorage
      localStorage.setItem('currentChatSessionId', sessionId)
    } catch (error) {
      console.error('Error loading session messages:', error)
      setError('Failed to load chat history')
    }
  }

  const createNewSession = async (firstMessage: string): Promise<string> => {
    try {
      const response = await api.post('/chatbot/sessions/', {
        first_message: firstMessage
      })
      
      const sessionData: ChatSession = response.data
      setCurrentSessionId(sessionData.id)
      setCurrentSessionTitle(sessionData.title)
      
      // Update messages with the session data
      if (sessionData.messages && sessionData.messages.length > 0) {
        setMessages(sessionData.messages)
      }
      
      // Save current session to localStorage
      localStorage.setItem('currentChatSessionId', sessionData.id)
      
      // Reload sessions list to include the new session
      loadSessions()
      
      return sessionData.id
    } catch (error) {
      console.error('Error creating session:', error)
      throw new Error('Failed to create chat session')
    }
  }

  const sendMessageToSession = async (message: string, sessionId: string): Promise<SendMessageResponse> => {
    try {
      const response = await api.post('/chatbot/send-message/', {
        message: message,
        session_id: sessionId
      })
      
      return response.data
    } catch (error) {
      console.error('Error sending message:', error)
      throw new Error('Failed to send message')
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      if (!currentSessionId) {
        // Create new session with first message
        await createNewSession(inputMessage)
      } else {
        // Add user message to UI immediately
        const userMessage: Message = {
          id: `temp-${Date.now()}`,
          content: inputMessage,
          message_type: "user",
          timestamp: new Date().toISOString(),
        }
        
        setMessages((prev) => [...prev, userMessage])
        
        // Send message to backend
        const response = await sendMessageToSession(inputMessage, currentSessionId)
        
        // Replace temp message with actual response
        setMessages((prev) => {
          const filteredMessages = prev.filter(msg => msg.id !== userMessage.id)
          return [
            ...filteredMessages,
            {
              id: response.user_message.id,
              content: response.user_message.content,
              message_type: response.user_message.message_type as "user" | "bot",
              timestamp: response.user_message.timestamp,
              metadata: response.user_message.metadata
            },
            {
              id: response.bot_response.id,
              content: response.bot_response.content,
              message_type: response.bot_response.message_type as "user" | "bot",
              timestamp: response.bot_response.timestamp,
              metadata: response.bot_response.metadata
            }
          ]
        })
        
        // Update sessions list
        loadSessions()
      }
      
      setInputMessage("")
    } catch (error) {
      console.error('Error in handleSendMessage:', error)
      setError('Failed to send message. Please try again.')
      
      // Remove the temporary user message on error
      setMessages((prev) => prev.filter(msg => !msg.id.startsWith('temp-')))
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    // Clear current session
    setCurrentSessionId(null)
    setCurrentSessionTitle("")
    localStorage.removeItem('currentChatSessionId')
    
    // Show welcome message
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your AI learning assistant. How can I help you today?",
        message_type: "bot",
        timestamp: new Date().toISOString(),
      },
    ])
    
    setError(null)
  }

  const handleSelectSession = (sessionId: string) => {
    if (sessionId !== currentSessionId) {
      loadSessionMessages(sessionId)
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateText = (text: string, maxLength: number = 30) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  if (isLoadingSessions) {
    return (
      <div className="main-content flex flex-col h-screen">
        <div className="flex items-center space-x-4 p-6 border-b bg-white">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Learning Assistant</h1>
            <p className="text-gray-600">Loading your chat history...</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="text-lg text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="main-content flex flex-col h-screen">
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Learning Assistant</h1>
            <p className="text-gray-600">
              {currentSessionTitle || "Get instant help with your learning journey"}
            </p>
          </div>
        </div>
        
        <Button
          onClick={handleNewChat}
          className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Chat</span>
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sessions Sidebar */}
        {sessions.length > 0 && (
          <div className="w-80 border-r bg-gray-50 flex flex-col">
            <div className="p-4 border-b bg-white">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Previous Chats ({sessions.length})
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentSessionId === session.id
                      ? 'bg-green-100 border border-green-200'
                      : 'bg-white hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">
                        {session.title}
                      </h4>
                      {session.latest_message && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {truncateText(session.latest_message.content, 50)}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(session.updated_at).toLocaleDateString()} • {session.message_count} messages
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <Card className="h-full flex flex-col border-0 rounded-none">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-green-600" />
                Chat with AI Assistant
                {currentSessionId && (
                  <span className="ml-2 text-sm text-gray-500 font-normal">
                    Active Session
                  </span>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {error && (
                <div className="p-4 bg-red-50 border-b">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex w-full ${message.message_type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.message_type === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.message_type === "bot" && <Bot className="h-4 w-4 mt-0.5 text-green-600" />}
                        {message.message_type === "user" && <User className="h-4 w-4 mt-0.5 text-white" />}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.message_type === "user" ? "text-green-100" : "text-gray-500"}`}>
                            {formatTimestamp(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start w-full">
                    <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-green-600" />
                        <div className="flex items-center space-x-1">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          <span className="text-sm text-gray-500">AI is typing...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask me anything about your learning journey..."
                    onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
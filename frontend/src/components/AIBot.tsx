import React, { useState } from 'react'
import { MessageCircle, Mic, X, Send } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
// import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
// import { useConversation } from '@11labs/react'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

const AIBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can help you with DEX trading, answer questions, or have a voice conversation. How can I assist you today?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isVoiceMode, setIsVoiceMode] = useState(false)

  // Commented out ElevenLabs integration for now - uncomment when API key is configured
  // const conversation = useConversation({
  //   onConnect: () => console.log('Voice conversation connected'),
  //   onDisconnect: () => {
  //     setIsVoiceMode(false)
  //     console.log('Voice conversation disconnected')
  //   },
  //   onMessage: (message) => {
  //     if (message.type === 'agent_response') {
  //       addMessage(message.message, false)
  //     }
  //   },
  //   onError: (error) => console.error('Voice conversation error:', error)
  // })

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    addMessage(inputText, true)
    setInputText('')

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      addMessage('I understand your query. As an AI assistant for this DEX, I can help with trading strategies, token information, and market analysis. What specific aspect would you like to explore?', false)
    }, 1000)
  }

  const handleVoiceToggle = async () => {
    if (!isVoiceMode) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        // Placeholder for voice functionality - integrate ElevenLabs when ready
        setIsVoiceMode(true)
        addMessage('Voice mode activated! (ElevenLabs integration coming soon)', false)
      } catch (error) {
        console.error('Failed to start voice conversation:', error)
        addMessage('Voice conversation failed to start. Please check your microphone permissions.', false)
      }
    } else {
      setIsVoiceMode(false)
      addMessage('Voice mode deactivated.', false)
    }
  }

  return (
    <div className="fixed bottom-20 right-6 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-dex-green hover:bg-dex-green-hover shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-80 h-96 bg-dex-card border-border animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-dex-green rounded-full animate-pulse" />
              <span className="text-dex-text-primary font-medium">AI Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleVoiceToggle}
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${isVoiceMode ? 'bg-dex-green text-black' : 'text-dex-text-muted hover:text-dex-text-primary'}`}
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-dex-text-muted hover:text-dex-text-primary"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 h-60">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.isUser
                        ? 'bg-dex-green text-black'
                        : 'bg-dex-card-hover text-dex-text-primary'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              {/* <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-dex-card border-border text-dex-text-primary placeholder:text-dex-text-muted"
                disabled={isVoiceMode}
              /> */}
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="bg-dex-green hover:bg-dex-green-hover text-black"
                disabled={!inputText.trim() || isVoiceMode}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {isVoiceMode && (
              <p className="text-xs text-dex-text-muted mt-2 text-center">
                Voice mode active - listening...
              </p>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

export default AIBot
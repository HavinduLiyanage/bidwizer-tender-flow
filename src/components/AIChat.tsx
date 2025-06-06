
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatProps {
  tenderTitle: string;
  isAnalysisComplete: boolean;
}

const AIChat = ({ tenderTitle, isAnalysisComplete }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello! I'm your AI assistant with full context about the "${tenderTitle}" tender. I've analyzed all the documents and requirements. How can I help you with your proposal?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isAnalysisComplete) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('requirement') || input.includes('criteria')) {
      return "Based on the tender analysis, the key requirements include: 10MW solar installation, licensed electrical contractor certification, minimum 5 years experience, and $1M+ working capital. The scoring criteria prioritizes technical approach (40%), experience (30%), price (20%), and local workforce (10%).";
    }
    
    if (input.includes('deadline') || input.includes('timeline')) {
      return "The submission deadline is July 30, 2025. I recommend starting the proposal preparation immediately, allowing 2-3 weeks for technical documentation, 1 week for pricing, and 1 week for final review and submission.";
    }
    
    if (input.includes('competition') || input.includes('competitors')) {
      return "This tender is likely to attract 8-15 qualified bidders. To stand out, emphasize your local presence, recent similar projects, and competitive pricing. Your 8+ years of solar experience gives you a strong advantage.";
    }
    
    if (input.includes('price') || input.includes('cost') || input.includes('budget')) {
      return "The tender value is estimated at $2.5M-$5M. Based on similar projects, I recommend pricing around $3.2M to be competitive while maintaining healthy margins. Focus on value-added services in your proposal.";
    }
    
    if (input.includes('team') || input.includes('personnel')) {
      return "For this project, you'll need a project manager, 2-3 electrical engineers, site supervisor, and 8-12 installation technicians. Highlight any local workforce in your proposal as it's worth 10% of the total score.";
    }
    
    return "I understand your question about the solar power facility tender. Could you be more specific about what aspect you'd like to discuss? I can help with requirements, timeline, pricing strategy, competition analysis, or any technical details.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-96">
      <ScrollArea className="flex-1 p-4 border rounded-lg bg-gray-50" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' ? 'bg-blue-600' : 'bg-green-600'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <Card className={`${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                  <CardContent className="p-3">
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-600">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <Card className="bg-white">
                  <CardContent className="p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="mt-4 flex space-x-2">
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isAnalysisComplete ? "Ask me anything about this tender..." : "Run AI analysis first to enable chat"}
          className="flex-1 min-h-[60px] max-h-[120px]"
          disabled={!isAnalysisComplete}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || !isAnalysisComplete}
          className="self-end"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      
      {!isAnalysisComplete && (
        <p className="text-sm text-gray-500 mt-2">
          Please run the AI analysis first to enable chat functionality.
        </p>
      )}
    </div>
  );
};

export default AIChat;

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar as UIAvatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Send, AlertTriangle, Volume2, VolumeX } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { geminiService } from "../lib/gemini";
import { textToSpeechService } from "../lib/textToSpeech";
import { useUser } from "../hooks/useUserData";
import { useToast } from "../hooks/use-toast";
import { Canvas } from "@react-three/fiber";
import Field from "./Field";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  riskLevel?: "low" | "medium" | "high";
}

const quickReplies = [
  { text: "I'm feeling stressed", emoji: "😰" },
  { text: "I'm feeling anxious", emoji: "😟" },
  { text: "I'm feeling overwhelmed", emoji: "😵" },
  { text: "I need someone to talk to", emoji: "💬" },
  { text: "I can't sleep", emoji: "😴" },
  { text: "I'm having trouble focusing", emoji: "🤔" },
];

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi there! I'm your AI mental health companion. I'm here to listen, support, and help you navigate any challenges you're facing. How are you feeling today?",
      timestamp: new Date(),
      riskLevel: "low",
    },
  ]);
  const [input, setInput] = useState("");
  const [riskDetected, setRiskDetected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const context = messages.slice(-5).map((m) => `${m.role}: ${m.content}`);
      return await geminiService.sendMessage(message, context);
    },
    onSuccess: async (response) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
        riskLevel: response.riskLevel,
      };

      setMessages((prev) => [...prev, newMessage]);

      // Speak the response if speech is enabled
      if (speechEnabled) {
        try {
          await textToSpeechService.speak(
            response.response,
            () => setIsSpeaking(true),
            () => setIsSpeaking(false)
          );
        } catch (error) {
          console.error("Text-to-speech error:", error);
          setIsSpeaking(false);
        }
      }

      // Handle high-risk situations
      if (response.riskLevel === "high") {
        setRiskDetected(true);
        toast({
          title: "Support Available",
          description:
            "We've detected you might need additional support. Consider reaching out to a counselor.",
          variant: "default",
        });
      }

      // Show suggested actions if any
      if (response.suggestedActions.length > 0) {
        setTimeout(
          () => {
            const actionsMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: `Here are some things that might help:\n\n${response.suggestedActions
                .map((action) => `• ${action}`)
                .join("\n")}`,
              timestamp: new Date(),
              riskLevel: response.riskLevel,
            };
            setMessages((prev) => [...prev, actionsMessage]);

            // Speak the suggested actions too if speech is enabled
            if (speechEnabled) {
              const actionsText = `Here are some things that might help: ${response.suggestedActions.join(
                ". "
              )}`;
              textToSpeechService
                .speak(
                  actionsText,
                  () => setIsSpeaking(true),
                  () => setIsSpeaking(false)
                )
                .catch((error) => {
                  console.error("Text-to-speech error:", error);
                  setIsSpeaking(false);
                });
            }
          },
          speechEnabled ? 2000 : 1000
        );
      }
    },
    onError: (error) => {
      toast({
        title: "Connection Error",
        description:
          error.message ||
          "I'm having trouble connecting right now. Please try again.",
        variant: "destructive",
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (messageText?: string) => {
    const messageToSend = messageText || input.trim();
    if (!messageToSend) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Send to AI
    chatMutation.mutate(messageToSend);
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      textToSpeechService.stop();
      setIsSpeaking(false);
    }
    setSpeechEnabled(!speechEnabled);
  };

  // Speak the initial message when component mounts
  useEffect(() => {
    if (speechEnabled && messages.length === 1) {
      setTimeout(() => {
        textToSpeechService
          .speak(
            messages[0].content,
            () => setIsSpeaking(true),
            () => setIsSpeaking(false)
          )
          .catch((error) => {
            console.error("Text-to-speech error:", error);
            setIsSpeaking(false);
          });
      }, 1000);
    }
  }, []);

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* 3D Character Section */}
      <div className="flex-1 relative">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
          <color attach="background" args={["#f8fafc"]} />
          <Field isSpeaking={isSpeaking} />
        </Canvas>

        {/* 3D Section Header */}
        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Meet Your AI Companion
          </h2>
          <p className="text-sm text-gray-600">
            Interactive 3D mental health assistant
          </p>
        </div>
      </div>

      {/* Chat Section */}
      <div className="w-96 bg-white shadow-2xl flex flex-col">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <UIAvatar className="w-12 h-12 border-2 border-white/30">
                <AvatarFallback className="bg-white/20 text-white">
                  <Bot className="w-6 h-6" />
                </AvatarFallback>
              </UIAvatar>
              <div>
                <h3 className="font-bold text-xl">WellNest AI</h3>
                <p className="text-sm opacity-90">
                  Your mental health companion
                </p>
                <div className="flex items-center mt-1">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      isSpeaking ? "bg-red-400 animate-pulse" : "bg-green-400"
                    }`}
                  ></div>
                  <span className="text-xs opacity-80">
                    {isSpeaking ? "Speaking..." : "Online & Ready to Help"}
                  </span>
                </div>
              </div>
            </div>

            {/* Speech Toggle Button */}
            <Button
              onClick={toggleSpeech}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 transition-colors"
              title={speechEnabled ? "Disable voice" : "Enable voice"}
            >
              {speechEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Risk Alert */}
        {riskDetected && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Additional Support Available</span>
            </div>
            <p className="text-sm mt-2">
              If you're in crisis, please contact campus counseling at (555)
              123-HELP or call 988 for immediate support.
            </p>
          </div>
        )}

        {/* Messages Container */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          style={{ scrollbarWidth: "thin" }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <UIAvatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </UIAvatar>
              )}

              <Card
                className={`max-w-xs shadow-lg transition-all duration-200 hover:shadow-xl ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "bg-white border-gray-200"
                }`}
              >
                <CardContent className="p-4">
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {message.content}
                  </p>
                  {message.riskLevel && message.riskLevel !== "low" && (
                    <Badge
                      variant={
                        message.riskLevel === "high"
                          ? "destructive"
                          : "secondary"
                      }
                      className="mt-2 text-xs"
                    >
                      {message.riskLevel} risk detected
                    </Badge>
                  )}
                </CardContent>
              </Card>

              {message.role === "user" && (
                <UIAvatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-gray-400 to-gray-600 text-white">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </UIAvatar>
              )}
            </div>
          ))}

          {chatMutation.isPending && (
            <div className="flex items-start space-x-3">
              <UIAvatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </UIAvatar>
              <Card className="bg-white shadow-lg">
                <CardContent className="p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    AI is thinking...
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies Section */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="mb-4">
            <p className="text-xs text-gray-600 mb-2 font-medium">
              Quick responses:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply(reply.text)}
                  className="text-xs hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-200 hover:scale-105"
                  disabled={chatMutation.isPending}
                >
                  <span className="mr-1">{reply.emoji}</span>
                  {reply.text}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                disabled={chatMutation.isPending}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || chatMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 rounded-lg px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Status and Disclaimer */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">
                  {chatMutation.isPending ? "Processing..." : "Ready to chat"}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                This AI companion provides support but isn't a substitute for
                professional care.
                <br />
                <span className="font-medium">
                  Crisis? Call 988 immediately.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

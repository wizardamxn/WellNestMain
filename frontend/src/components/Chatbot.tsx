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
import "./chatbot-animations.css";

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
  const [currentEmotion, setCurrentEmotion] = useState<
    "happy" | "sad" | "thinking" | "greeting" | "idle"
  >("greeting");
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

      // Analyze emotion for 3D character animation
      analyzeEmotion(response.response, response.riskLevel);

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

  // Analyze message emotion and set character animation
  const analyzeEmotion = (message: string, riskLevel?: string) => {
    const lowerMessage = message.toLowerCase();

    if (
      riskLevel === "high" ||
      lowerMessage.includes("sad") ||
      lowerMessage.includes("depressed") ||
      lowerMessage.includes("cry")
    ) {
      setCurrentEmotion("sad");
    } else if (
      lowerMessage.includes("happy") ||
      lowerMessage.includes("good") ||
      lowerMessage.includes("great") ||
      lowerMessage.includes("thank")
    ) {
      setCurrentEmotion("happy");
    } else if (
      lowerMessage.includes("think") ||
      lowerMessage.includes("wonder") ||
      lowerMessage.includes("confused")
    ) {
      setCurrentEmotion("thinking");
    } else {
      setCurrentEmotion("idle");
    }

    // Reset to idle after 5 seconds
    setTimeout(() => {
      setCurrentEmotion("idle");
    }, 5000);
  };

  // Set greeting emotion on component mount
  useEffect(() => {
    setCurrentEmotion("greeting");
    setTimeout(() => {
      setCurrentEmotion("idle");
    }, 3000);
  }, []);

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* 3D Character Section */}
      <div className="flex-1 relative">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
          <color attach="background" args={["#fefefe"]} />
          <Field isSpeaking={isSpeaking} emotion={currentEmotion} />
        </Canvas>

        {/* 3D Section Header */}
        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Meet Your AI Companion
            </h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Interactive 3D mental health assistant with emotional intelligence
          </p>
          <div className="mt-3 flex items-center space-x-2">
            <div className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-xs font-medium text-indigo-700">
              Emotion: {currentEmotion}
            </div>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30 animate-float"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="w-[420px] bg-white/95 backdrop-blur-md shadow-2xl flex flex-col border-l border-white/20 relative">
        {/* Decorative gradient border */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-pink-500/10 pointer-events-none"></div>

        {/* Chat Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 relative overflow-hidden">
          {/* Header background pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <UIAvatar className="w-14 h-14 border-3 border-white/40 shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-white/30 to-white/10 text-white">
                    <Bot className="w-7 h-7" />
                  </AvatarFallback>
                </UIAvatar>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-bold text-2xl mb-1 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  WellNest AI
                </h3>
                <p className="text-sm opacity-90 font-medium">
                  Your empathetic mental health companion
                </p>
                <div className="flex items-center mt-2 space-x-3">
                  <div className="flex items-center">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mr-2 ${
                        isSpeaking
                          ? "bg-red-400 animate-pulse"
                          : "bg-green-400 animate-pulse"
                      }`}
                    ></div>
                    <span className="text-xs opacity-90 font-medium">
                      {isSpeaking ? "Speaking..." : "Online & Ready"}
                    </span>
                  </div>
                  <div className="text-xs opacity-75 bg-white/20 px-2 py-1 rounded-full">
                    {messages.length - 1} messages
                  </div>
                </div>
              </div>
            </div>

            {/* Speech Toggle Button */}
            <Button
              onClick={toggleSpeech}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 rounded-xl p-3"
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
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-5 text-red-700 relative overflow-hidden animate-pulse">
            <div className="absolute inset-0 bg-red-100/30 animate-pulse"></div>
            <div className="flex items-center space-x-3 relative z-10">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <span className="font-bold text-lg">
                  Additional Support Available
                </span>
                <p className="text-sm mt-1 font-medium">
                  If you're in crisis, please contact campus counseling at (555)
                  123-HELP or call 988 for immediate support.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages Container */}
        <div
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/80 to-white/80 backdrop-blur-sm relative"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#e5e7eb #f9fafb",
          }}
        >
          {/* Message background pattern */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-opacity='0.03'%3E%3Cpolygon fill='%23000' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-start space-x-4 relative z-10 animate-fade-in ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {message.role === "assistant" && (
                <div className="relative">
                  <UIAvatar className="w-10 h-10 flex-shrink-0 shadow-lg border-2 border-white">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </UIAvatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
                </div>
              )}

              <Card
                className={`max-w-sm shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white border-0"
                    : "bg-white/90 backdrop-blur-sm border border-gray-200/50"
                }`}
              >
                <CardContent className="p-5">
                  <p className="text-sm whitespace-pre-line leading-relaxed font-medium">
                    {message.content}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span
                      className={`text-xs ${
                        message.role === "user"
                          ? "text-white/70"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {message.riskLevel && message.riskLevel !== "low" && (
                      <Badge
                        variant={
                          message.riskLevel === "high"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs font-medium"
                      >
                        {message.riskLevel} risk
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {message.role === "user" && (
                <div className="relative">
                  <UIAvatar className="w-10 h-10 flex-shrink-0 shadow-lg border-2 border-white">
                    <AvatarFallback className="bg-gradient-to-br from-gray-500 to-gray-700 text-white">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </UIAvatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full border-2 border-white"></div>
                </div>
              )}
            </div>
          ))}

          {chatMutation.isPending && (
            <div className="flex items-start space-x-4 relative z-10">
              <div className="relative">
                <UIAvatar className="w-10 h-10 shadow-lg border-2 border-white">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </UIAvatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200/50">
                <CardContent className="p-5">
                  <div className="flex space-x-2 mb-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-3 h-3 bg-gradient-to-r from-pink-400 to-red-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    AI is thinking deeply...
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies Section */}
        <div className="p-6 bg-gradient-to-r from-white/95 to-gray-50/95 backdrop-blur-md border-t border-gray-200/50 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5"></div>
          <div className="mb-5 relative z-10">
            <p className="text-sm text-gray-700 mb-3 font-semibold flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2"></span>
              Quick responses:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply(reply.text)}
                  className="text-xs font-medium hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-300 hover:scale-105 hover:shadow-md rounded-full border-gray-300"
                  disabled={chatMutation.isPending}
                >
                  <span className="mr-2 text-base">{reply.emoji}</span>
                  {reply.text}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-4 relative z-10">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind..."
                  className="w-full border-2 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-2xl px-4 py-3 text-sm bg-white/80 backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400"
                  disabled={chatMutation.isPending}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl pointer-events-none opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
              </div>
              <Button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || chatMutation.isPending}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-2xl px-6 py-3 text-white font-medium"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>

            {/* Status and Disclaimer */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full animate-pulse ${
                    chatMutation.isPending ? "bg-yellow-500" : "bg-green-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600 font-medium">
                  {chatMutation.isPending
                    ? "Processing your message..."
                    : "Ready to chat securely"}
                </span>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200/50">
                <p className="text-xs text-gray-600 leading-relaxed">
                  This AI companion provides emotional support but isn't a
                  substitute for professional mental health care.
                  <br />
                  <span className="font-bold text-red-600 mt-1 inline-block">
                    🚨 Crisis? Call 988 or your local emergency services
                    immediately.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

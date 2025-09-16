// import { useState, useRef, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent } from '@/components/ui/card';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Bot, User, Send, AlertTriangle } from 'lucide-react';
// import { useMutation } from '@tanstack/react-query';
// import { chatApi } from '../lib/api';
// import { useUser } from '../hooks/useUserData';
// import { useToast } from '../hooks/use-toast';

import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { Canvas } from "@react-three/fiber";
import Field from "./Field";

// interface Message {
//   id: string;
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: Date;
//   riskLevel?: 'low' | 'medium' | 'high';
// }

// const quickReplies = [
//   { text: "I'm feeling stressed", emoji: "😰" },
//   { text: "I'm feeling anxious", emoji: "😟" },
//   { text: "I'm feeling overwhelmed", emoji: "😵" },
//   { text: "I need someone to talk to", emoji: "💬" },
//   { text: "I can't sleep", emoji: "😴" },
//   { text: "I'm having trouble focusing", emoji: "🤔" }
// ];

// export default function Chatbot() {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       role: 'assistant',
//       content: "Hi there! I'm your AI mental health companion. I'm here to listen, support, and help you navigate any challenges you're facing. How are you feeling today?",
//       timestamp: new Date(),
//       riskLevel: 'low'
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [riskDetected, setRiskDetected] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const { user } = useUser();
//   const { toast } = useToast();

//   const chatMutation = useMutation({
//     mutationFn: (message: string) => chatApi.sendMessage({ userId: user?.id || '', message }),
//     onSuccess: (response) => {
//       const newMessage: Message = {
//         id: Date.now().toString(),
//         role: 'assistant',
//         content: response.response,
//         timestamp: new Date(),
//         riskLevel: response.riskLevel
//       };

//       setMessages(prev => [...prev, newMessage]);

//       // Handle high-risk situations
//       if (response.riskLevel === 'high') {
//         setRiskDetected(true);
//         toast({
//           title: "Support Available",
//           description: "We've detected you might need additional support. Consider reaching out to a counselor.",
//           variant: "default"
//         });
//       }

//       // Show suggested actions if any
//       if (response.suggestedActions.length > 0) {
//         setTimeout(() => {
//           const actionsMessage: Message = {
//             id: (Date.now() + 1).toString(),
//             role: 'assistant',
//             content: `Here are some things that might help:\n\n${response.suggestedActions.map(action => `• ${action}`).join('\n')}`,
//             timestamp: new Date(),
//             riskLevel: response.riskLevel
//           };
//           setMessages(prev => [...prev, actionsMessage]);
//         }, 1000);
//       }
//     },
//     onError: () => {
//       toast({
//         title: "Connection Error",
//         description: "I'm having trouble connecting right now. Please try again or contact campus support if you need immediate help.",
//         variant: "destructive"
//       });
//     }
//   });

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSendMessage = (messageText?: string) => {
//     const messageToSend = messageText || input.trim();
//     if (!messageToSend) return;

//     // Add user message
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: 'user',
//       content: messageToSend,
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInput('');

//     // Send to AI
//     if (user?.id) {
//       chatMutation.mutate(messageToSend);
//     }
//   };

//   const handleQuickReply = (reply: string) => {
//     handleSendMessage(reply);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div data-testid="component-chatbot" className="flex flex-col h-[600px]">
//       {/* Header */}
//       <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
//         <div className="flex items-center space-x-3">
//           <Avatar className="w-10 h-10">
//             <AvatarFallback className="bg-primary-foreground/20">
//               <Bot className="w-5 h-5" />
//             </AvatarFallback>
//           </Avatar>
//           <div>
//             <h3 className="font-semibold">WellNest AI Companion</h3>
//             <p className="text-sm opacity-80">Always here to listen and support you</p>
//           </div>
//         </div>
//       </div>

//       {/* Risk Alert */}
//       {riskDetected && (
//         <div data-testid="alert-risk-detected" className="bg-destructive/10 border-l-4 border-destructive p-4 text-destructive">
//           <div className="flex items-center space-x-2">
//             <AlertTriangle className="w-5 h-5" />
//             <span className="font-medium">Additional Support Available</span>
//           </div>
//           <p className="text-sm mt-2">
//             If you're in crisis, please contact campus counseling at (555) 123-HELP or call 988 for immediate support.
//           </p>
//         </div>
//       )}

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             data-testid={`message-${message.role}`}
//             className={`flex items-start space-x-3 chat-message ${
//               message.role === 'user' ? 'justify-end' : 'justify-start'
//             }`}
//           >
//             {message.role === 'assistant' && (
//               <Avatar className="w-8 h-8 flex-shrink-0">
//                 <AvatarFallback className="bg-primary text-primary-foreground">
//                   <Bot className="w-4 h-4" />
//                 </AvatarFallback>
//               </Avatar>
//             )}

//             <Card className={`max-w-xs ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
//               <CardContent className="p-3">
//                 <p className="text-sm whitespace-pre-line">{message.content}</p>
//                 {message.riskLevel && message.riskLevel !== 'low' && (
//                   <Badge
//                     variant={message.riskLevel === 'high' ? 'destructive' : 'secondary'}
//                     className="mt-2 text-xs"
//                   >
//                     {message.riskLevel} risk detected
//                   </Badge>
//                 )}
//               </CardContent>
//             </Card>

//             {message.role === 'user' && (
//               <Avatar className="w-8 h-8 flex-shrink-0">
//                 <AvatarFallback className="bg-muted">
//                   <User className="w-4 h-4" />
//                 </AvatarFallback>
//               </Avatar>
//             )}
//           </div>
//         ))}

//         {chatMutation.isPending && (
//           <div data-testid="loading-indicator" className="flex items-start space-x-3">
//             <Avatar className="w-8 h-8">
//               <AvatarFallback className="bg-primary text-primary-foreground">
//                 <Bot className="w-4 h-4" />
//               </AvatarFallback>
//             </Avatar>
//             <Card className="bg-muted">
//               <CardContent className="p-3">
//                 <div className="flex space-x-1">
//                   <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
//                   <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                   <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Quick Replies */}
//       <div className="p-4 border-t border-border">
//         <div className="flex flex-wrap gap-2 mb-4">
//           {quickReplies.map((reply, index) => (
//             <Button
//               key={index}
//               data-testid={`quick-reply-${index}`}
//               variant="outline"
//               size="sm"
//               onClick={() => handleQuickReply(reply.text)}
//               className="text-xs"
//             >
//               <span className="mr-1">{reply.emoji}</span>
//               {reply.text}
//             </Button>
//           ))}
//         </div>

//         {/* Input */}
//         <div className="flex space-x-2">
//           <Input
//             data-testid="input-chat-message"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Type your message..."
//             className="flex-1"
//             disabled={chatMutation.isPending}
//           />
//           <Button
//             data-testid="button-send-message"
//             onClick={() => handleSendMessage()}
//             disabled={!input.trim() || chatMutation.isPending}
//             size="icon"
//           >
//             <Send className="w-4 h-4" />
//           </Button>
//         </div>

//         {/* Disclaimer */}
//         <p className="text-xs text-muted-foreground mt-2 text-center">
//           This AI companion is not a substitute for professional mental health care.
//           If you're in crisis, please seek immediate help.
//         </p>
//       </div>
//     </div>
//   );
// }

const Chatbot = () => {
  return (
    <div className="w-full h-screen">
      <Canvas shadows camera={{position: [0,0,8], fov: 42}}>
        <color attach="background" args={["#ececec"]}></color>
        <Field/>
      </Canvas>
    </div>
  );
};

export default Chatbot;

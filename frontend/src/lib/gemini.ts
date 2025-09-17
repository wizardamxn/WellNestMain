import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async sendMessage(
    message: string,
    context?: string[]
  ): Promise<{
    response: string;
    riskLevel: "low" | "medium" | "high";
    suggestedActions: string[];
  }> {
    try {
      // Check if API key is available
      if (!GEMINI_API_KEY) {
        throw new Error(
          "Gemini API key is not configured. Please check your environment variables."
        );
      }

      console.log("Sending message to Gemini:", message);

      const systemPrompt = `You are WellNest AI, a compassionate mental health companion for college students. 
      
      Guidelines:
      - Be empathetic, supportive, and non-judgmental
      - Provide helpful mental health insights and coping strategies
      - Assess risk levels: low (general support), medium (concerning patterns), high (crisis indicators)
      - Suggest practical actions when appropriate
      - Keep responses concise but meaningful (2-3 sentences max)
      - If someone mentions self-harm, suicide, or crisis, immediately flag as high risk
      - Always respond with natural, conversational text - do NOT use JSON format
      
      Please respond naturally and conversationally to help the user.`;

      const fullPrompt =
        context && context.length > 0
          ? `${systemPrompt}\n\nConversation context:\n${context.join(
              "\n"
            )}\n\nUser message: ${message}`
          : `${systemPrompt}\n\nUser message: ${message}`;

      console.log("Sending request to Gemini API...");
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      console.log("Received response from Gemini:", text);

      // Always use fallback parsing since we're not requesting JSON format
      const finalResponse = {
        response: text.trim(),
        riskLevel: this.assessRiskLevel(text, message),
        suggestedActions: this.generateSuggestedActions(message),
      };

      console.log("Final processed response:", finalResponse);
      return finalResponse;
    } catch (error) {
      console.error("Gemini API error details:", error);

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          throw new Error("API configuration error. Please check your setup.");
        } else if (
          error.message.includes("quota") ||
          error.message.includes("limit")
        ) {
          throw new Error("API quota exceeded. Please try again later.");
        } else if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          throw new Error(
            "Network error. Please check your internet connection."
          );
        }
      }

      // Provide a fallback response if API fails
      console.warn("Using fallback response due to API error");
      return {
        response:
          "I'm having trouble connecting right now, but I'm here to listen. Can you tell me more about what's on your mind? In the meantime, remember that it's okay to feel what you're feeling, and seeking support is a sign of strength.",
        riskLevel: this.assessRiskLevel("", message),
        suggestedActions: this.generateSuggestedActions(message),
      };
    }
  }

  private assessRiskLevel(
    response: string,
    userMessage: string
  ): "low" | "medium" | "high" {
    const highRiskKeywords = [
      "suicide",
      "kill myself",
      "end it all",
      "not worth living",
      "self-harm",
      "hurt myself",
      "want to die",
      "better off dead",
      "no point in living",
      "cutting myself",
      "overdose",
    ];
    const mediumRiskKeywords = [
      "depressed",
      "hopeless",
      "can't cope",
      "overwhelmed",
      "panic",
      "anxiety attack",
      "worthless",
      "hate myself",
      "can't go on",
      "everything is falling apart",
      "breaking down",
    ];

    const combinedText = (response + " " + userMessage).toLowerCase();

    if (highRiskKeywords.some((keyword) => combinedText.includes(keyword))) {
      return "high";
    }
    if (mediumRiskKeywords.some((keyword) => combinedText.includes(keyword))) {
      return "medium";
    }
    return "low";
  }

  private generateSuggestedActions(userMessage: string): string[] {
    const actions = [];
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes("stress") ||
      lowerMessage.includes("overwhelmed")
    ) {
      actions.push(
        "Try the 4-7-8 breathing technique",
        "Take a 10-minute nature walk",
        "Practice progressive muscle relaxation"
      );
    }
    if (
      lowerMessage.includes("sleep") ||
      lowerMessage.includes("tired") ||
      lowerMessage.includes("insomnia")
    ) {
      actions.push(
        "Create a consistent bedtime routine",
        "Avoid screens 1 hour before bed",
        "Try guided sleep meditation"
      );
    }
    if (
      lowerMessage.includes("anxious") ||
      lowerMessage.includes("worry") ||
      lowerMessage.includes("panic")
    ) {
      actions.push(
        "Practice the 5-4-3-2-1 grounding technique",
        "Write your worries in a journal",
        "Try mindfulness meditation"
      );
    }
    if (
      lowerMessage.includes("lonely") ||
      lowerMessage.includes("isolated") ||
      lowerMessage.includes("alone")
    ) {
      actions.push(
        "Join a campus club or activity",
        "Reach out to a friend or family member",
        "Visit the student center or library"
      );
    }
    if (
      lowerMessage.includes("sad") ||
      lowerMessage.includes("down") ||
      lowerMessage.includes("depressed")
    ) {
      actions.push(
        "Engage in physical activity",
        "Connect with supportive friends",
        "Consider talking to a counselor"
      );
    }
    if (
      lowerMessage.includes("focus") ||
      lowerMessage.includes("concentrate") ||
      lowerMessage.includes("distracted")
    ) {
      actions.push(
        "Try the Pomodoro technique",
        "Create a distraction-free study space",
        "Take regular breaks every 25 minutes"
      );
    }

    // If no specific actions, provide general wellness tips
    if (actions.length === 0) {
      actions.push(
        "Take deep breaths and stay present",
        "Remember that this feeling will pass",
        "Consider reaching out for support"
      );
    }

    return actions.slice(0, 3); // Limit to 3 suggestions
  }
}

export const geminiService = new GeminiService();

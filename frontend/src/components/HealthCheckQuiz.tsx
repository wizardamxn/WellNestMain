import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { assessmentApi } from "../lib/api";
import { useUser } from "../hooks/useUserData";
import { useToast } from "../hooks/use-toast";
import { useLocation } from "wouter";

interface Question {
  id: string;
  text: string;
  options: { value: number; text: string }[];
}

const questions: Question[] = [
  {
    id: "mood",
    text: "Over the past two weeks, how often have you been feeling down, depressed, or hopeless?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" },
    ],
  },
  {
    id: "interest",
    text: "How often have you had little interest or pleasure in doing things?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" },
    ],
  },
  {
    id: "sleep",
    text: "How often have you had trouble falling or staying asleep, or sleeping too much?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" },
    ],
  },
  {
    id: "energy",
    text: "How often have you felt tired or had little energy?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" },
    ],
  },
  {
    id: "appetite",
    text: "How often have you had poor appetite or been overeating?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" },
    ],
  },
  {
    id: "self_worth",
    text: "How often have you been feeling bad about yourself or that you are a failure or have let yourself or your family down?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" },
    ],
  },
  {
    id: "concentration",
    text: "How often have you had trouble concentrating on things, such as reading the newspaper or watching television?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" },
    ],
  },
  {
    id: "psychomotor",
    text: "How often have you been moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" },
    ],
  },
  {
    id: "self_harm",
    text: "How often have you had thoughts that you would be better off dead, or of hurting yourself in some way?",
    options: [
      { value: 0, text: "Not at all" },
      { value: 1, text: "Several days" },
      { value: 2, text: "More than half the days" },
      { value: 3, text: "Nearly every day" },
    ],
  },
  {
    id: "stress",
    text: "How would you rate your current stress levels regarding academic performance?",
    options: [
      { value: 0, text: "Very low" },
      { value: 1, text: "Low" },
      { value: 2, text: "Moderate" },
      { value: 3, text: "High" },
      { value: 4, text: "Very high" },
    ],
  },
  {
    id: "social_support",
    text: "How often do you feel you have adequate social support from friends, family, or peers?",
    options: [
      { value: 0, text: "Always" },
      { value: 1, text: "Often" },
      { value: 2, text: "Sometimes" },
      { value: 3, text: "Rarely" },
      { value: 4, text: "Never" },
    ],
  },
  {
    id: "coping",
    text: "How well do you feel you are coping with daily life challenges?",
    options: [
      { value: 0, text: "Very well" },
      { value: 1, text: "Well" },
      { value: 2, text: "Moderately" },
      { value: 3, text: "Poorly" },
      { value: 4, text: "Very poorly" },
    ],
  },
];

interface AssessmentResult {
  totalScore: number;
  depressionScore: number; // PHQ-9 based score (0-27)
  stressScore: number;
  socialSupportScore: number;
  copingScore: number;
  riskLevel: "minimal" | "mild" | "moderate" | "moderately-severe" | "severe";
  depressionSeverity:
    | "minimal"
    | "mild"
    | "moderate"
    | "moderately-severe"
    | "severe";
  insights: string;
  recommendations: string[];
  professionalHelpRecommended: boolean;
  emergencySupport: boolean;
}

// Comprehensive scoring function
const calculateAssessmentScores = (
  responses: Record<string, number>
): AssessmentResult => {
  // PHQ-9 questions (depression screening)
  const phq9Questions = [
    "mood",
    "interest",
    "sleep",
    "energy",
    "appetite",
    "self_worth",
    "concentration",
    "psychomotor",
    "self_harm",
  ];
  const depressionScore = phq9Questions.reduce(
    (sum, questionId) => sum + (responses[questionId] || 0),
    0
  );

  // Additional scores
  const stressScore = responses.stress || 0;
  const socialSupportScore = responses.social_support || 0;
  const copingScore = responses.coping || 0;

  const totalScore =
    depressionScore + stressScore + socialSupportScore + copingScore;

  // Determine depression severity based on PHQ-9 scoring
  let depressionSeverity: AssessmentResult["depressionSeverity"];
  if (depressionScore <= 4) depressionSeverity = "minimal";
  else if (depressionScore <= 9) depressionSeverity = "mild";
  else if (depressionScore <= 14) depressionSeverity = "moderate";
  else if (depressionScore <= 19) depressionSeverity = "moderately-severe";
  else depressionSeverity = "severe";

  // Determine overall risk level
  const riskLevel = depressionSeverity;

  // Check for emergency support needs
  const emergencySupport = responses.self_harm >= 2 || depressionScore >= 20;
  const professionalHelpRecommended =
    depressionScore >= 10 || stressScore >= 3 || copingScore >= 3;

  // Generate insights
  let insights = `Your depression screening score is ${depressionScore}/27, indicating ${depressionSeverity} symptoms. `;

  if (depressionScore <= 4) {
    insights +=
      "You're showing minimal signs of depression, which is great! Continue maintaining your mental wellness.";
  } else if (depressionScore <= 9) {
    insights +=
      "You're experiencing mild depressive symptoms. This is manageable with self-care and support.";
  } else if (depressionScore <= 14) {
    insights +=
      "You're experiencing moderate depressive symptoms. Consider speaking with a counselor or mental health professional.";
  } else if (depressionScore <= 19) {
    insights +=
      "You're experiencing moderately severe depressive symptoms. Professional support is strongly recommended.";
  } else {
    insights +=
      "You're experiencing severe depressive symptoms. Please seek immediate professional help.";
  }

  if (stressScore >= 3) {
    insights +=
      " Your stress levels are elevated, which may be impacting your overall wellbeing.";
  }

  if (socialSupportScore >= 3) {
    insights +=
      " You may benefit from strengthening your social support network.";
  }

  // Generate recommendations
  const recommendations: string[] = [];

  if (depressionScore >= 15 || emergencySupport) {
    recommendations.push(
      "Schedule an appointment with a mental health professional immediately"
    );
    recommendations.push(
      "Contact your campus counseling center or call 988 for crisis support"
    );
  } else if (depressionScore >= 10) {
    recommendations.push(
      "Consider scheduling a consultation with a campus counselor"
    );
    recommendations.push(
      "Explore therapy options through your student health services"
    );
  }

  if (stressScore >= 3) {
    recommendations.push(
      "Practice stress management techniques like deep breathing or meditation"
    );
    recommendations.push(
      "Consider time management strategies to reduce academic pressure"
    );
  }

  if (socialSupportScore >= 3) {
    recommendations.push(
      "Join student organizations or clubs to build social connections"
    );
    recommendations.push(
      "Reach out to friends, family, or peer support groups"
    );
  }

  if (copingScore >= 3) {
    recommendations.push(
      "Develop healthy coping strategies like exercise, journaling, or creative activities"
    );
    recommendations.push("Learn mindfulness and relaxation techniques");
  }

  // Always include general wellness recommendations
  if (recommendations.length < 3) {
    recommendations.push("Maintain a regular sleep schedule and healthy diet");
    recommendations.push("Engage in regular physical activity");
    recommendations.push("Practice self-care and stress management techniques");
  }

  return {
    totalScore,
    depressionScore,
    stressScore,
    socialSupportScore,
    copingScore,
    riskLevel,
    depressionSeverity,
    insights,
    recommendations: recommendations.slice(0, 5), // Limit to 5 recommendations
    professionalHelpRecommended,
    emergencySupport,
  };
};

export default function HealthCheckQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const assessmentMutation = useMutation({
    mutationFn: async (data: {
      userId: string;
      responses: Record<string, number>;
    }) => {
      // Calculate scores locally first
      const localResults = calculateAssessmentScores(data.responses);

      // Submit to API (you can still save to database)
      try {
        await assessmentApi.createAssessment(data);
      } catch (error) {
        console.warn("API submission failed, using local calculation:", error);
      }

      return localResults;
    },
    onSuccess: (calculatedResults) => {
      setResults(calculatedResults);
      setShowResults(true);

      // Show appropriate notifications based on severity
      if (calculatedResults.emergencySupport) {
        toast({
          title: "🚨 Immediate Support Needed",
          description:
            "Please contact emergency services or call 988 immediately. You don't have to go through this alone.",
          variant: "destructive",
        });
      } else if (calculatedResults.professionalHelpRecommended) {
        toast({
          title: "Professional Support Recommended",
          description:
            "Consider reaching out to a mental health professional for additional support.",
          variant: "default",
        });
      } else {
        toast({
          title: "Assessment Complete",
          description:
            "Thank you for taking the time to check in with your mental health.",
          variant: "default",
        });
      }
    },
    onError: () => {
      toast({
        title: "Assessment Error",
        description:
          "There was an issue processing your assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = responses[currentQ.id] !== undefined;

  const handleAnswerChange = (value: string) => {
    setResponses((prev) => ({
      ...prev,
      [currentQ.id]: parseInt(value),
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => Math.max(0, prev - 1));
  };

  const handleSubmit = () => {
    if (!user?.id) return;

    assessmentMutation.mutate({
      userId: user.id,
      responses,
    });
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setResponses({});
    setShowResults(false);
    setResults(null);
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "minimal":
        return "bg-green-100 text-green-800 border-green-200";
      case "mild":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "moderately-severe":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "severe":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "minimal":
        return <CheckCircle className="w-5 h-5" />;
      case "mild":
        return <Heart className="w-5 h-5" />;
      case "moderate":
        return <Heart className="w-5 h-5" />;
      case "moderately-severe":
        return <AlertTriangle className="w-5 h-5" />;
      case "severe":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  if (showResults && results) {
    return (
      <div
        data-testid="assessment-results"
        className="max-w-2xl mx-auto space-y-6"
      >
        <Card>
          <CardHeader className="text-center">
            <div
              className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${getRiskLevelColor(
                results.riskLevel
              )}`}
            >
              {getRiskLevelIcon(results.riskLevel)}
            </div>
            <CardTitle className="text-xl">Assessment Complete</CardTitle>
            <p className="text-muted-foreground">
              Thank you for taking the time to check in with yourself.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Risk Level */}
            <div className="text-center">
              <Badge
                data-testid={`risk-level-${results.riskLevel}`}
                className={`text-lg px-4 py-2 ${getRiskLevelColor(
                  results.riskLevel
                )}`}
              >
                {results.riskLevel.charAt(0).toUpperCase() +
                  results.riskLevel.slice(1)}{" "}
                Risk Level
              </Badge>
              <div className="text-sm text-muted-foreground mt-3 space-y-1">
                <p data-testid="assessment-score">
                  Depression Score: {results.depressionScore}/27 (PHQ-9)
                </p>
                <p>Total Assessment Score: {results.totalScore}</p>
                <p>Stress Level: {results.stressScore}/4</p>
              </div>
            </div>

            {/* Detailed Score Breakdown */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <h5 className="font-semibold text-blue-800 mb-1">Depression</h5>
                <p className="text-2xl font-bold text-blue-600">
                  {results.depressionScore}
                </p>
                <p className="text-xs text-blue-600">out of 27</p>
                <p className="text-xs text-blue-700 mt-1 capitalize">
                  {results.depressionSeverity}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <h5 className="font-semibold text-purple-800 mb-1">Stress</h5>
                <p className="text-2xl font-bold text-purple-600">
                  {results.stressScore}
                </p>
                <p className="text-xs text-purple-600">out of 4</p>
                <p className="text-xs text-purple-700 mt-1">
                  {results.stressScore <= 1
                    ? "Low"
                    : results.stressScore <= 2
                    ? "Moderate"
                    : "High"}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <h5 className="font-semibold text-green-800 mb-1">
                  Social Support
                </h5>
                <p className="text-2xl font-bold text-green-600">
                  {results.socialSupportScore}
                </p>
                <p className="text-xs text-green-600">out of 4</p>
                <p className="text-xs text-green-700 mt-1">
                  {results.socialSupportScore <= 1
                    ? "Strong"
                    : results.socialSupportScore <= 2
                    ? "Adequate"
                    : "Needs Improvement"}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <h5 className="font-semibold text-orange-800 mb-1">Coping</h5>
                <p className="text-2xl font-bold text-orange-600">
                  {results.copingScore}
                </p>
                <p className="text-xs text-orange-600">out of 4</p>
                <p className="text-xs text-orange-700 mt-1">
                  {results.copingScore <= 1
                    ? "Good"
                    : results.copingScore <= 2
                    ? "Fair"
                    : "Struggling"}
                </p>
              </div>
            </div>

            {/* Professional Help Recommendation */}
            {results.professionalHelpRecommended && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-800">
                    Professional Support Recommended
                  </h4>
                </div>
                <p className="text-sm text-blue-700 mt-2">
                  Based on your responses, speaking with a mental health
                  professional could be beneficial for your wellbeing.
                </p>
              </div>
            )}

            {/* Insights */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">
                Detailed Analysis
              </h4>
              <p
                data-testid="assessment-insights"
                className="text-sm text-muted-foreground leading-relaxed"
              >
                {results.insights}
              </p>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium text-foreground mb-3">
                Recommended Next Steps
              </h4>
              <div
                data-testid="assessment-recommendations"
                className="space-y-2"
              >
                {results.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-card border border-border rounded-lg"
                  >
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Resources */}
            {(results.emergencySupport ||
              results.riskLevel === "severe" ||
              results.riskLevel === "moderately-severe") && (
              <Card className="bg-destructive/5 border-destructive/20">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                    <div>
                      <h4 className="font-medium text-destructive mb-2">
                        Immediate Support Available
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          National Crisis Helpline:{" "}
                          <strong className="text-destructive">988</strong>
                        </div>
                        <div>
                          Campus Counseling:{" "}
                          <strong className="text-destructive">
                            (555) 123-HELP
                          </strong>
                        </div>
                        <div>
                          Crisis Text Line: Text{" "}
                          <strong className="text-destructive">HOME</strong> to{" "}
                          <strong className="text-destructive">741741</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                data-testid="button-retake-assessment"
                onClick={handleRestart}
                variant="outline"
                className="flex-1"
              >
                Take Assessment Again
              </Button>
              <Button
                data-testid="button-book-counselor"
                className="flex-1"
                onClick={() => {
                  toast({
                    title: "Redirecting to Booking",
                    description:
                      "Taking you to the counselor booking system...",
                  });
                  setLocation("/features/booking");
                }}
              >
                Book a Counselor Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div data-testid="health-check-quiz" className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Mental Health Check-In</CardTitle>
            <Badge variant="secondary" className="text-xs">
              Confidential & Anonymous
            </Badge>
          </div>
          <p className="text-muted-foreground">
            This brief assessment helps us understand how you're feeling and
            provide appropriate support.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress
              data-testid="quiz-progress"
              value={progress}
              className="h-2"
            />
          </div>

          {/* Question */}
          <div className="space-y-4">
            <h3
              data-testid="current-question"
              className="text-lg font-medium leading-relaxed"
            >
              {currentQ.text}
            </h3>

            <RadioGroup
              value={responses[currentQ.id]?.toString() || ""}
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {currentQ.options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem
                    data-testid={`option-${option.value}`}
                    value={option.value.toString()}
                    id={`option-${option.value}`}
                    className="text-primary"
                  />
                  <Label
                    htmlFor={`option-${option.value}`}
                    className="flex-1 cursor-pointer text-sm"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              data-testid="button-previous"
              onClick={handlePrevious}
              variant="outline"
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              data-testid="button-next"
              onClick={handleNext}
              disabled={!canProceed || assessmentMutation.isPending}
            >
              {assessmentMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                !isLastQuestion && <ArrowRight className="w-4 h-4 mr-2" />
              )}
              {isLastQuestion ? "Complete Assessment" : "Next"}
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground">
              🔒 Your responses are completely confidential and anonymous. This
              assessment is not a substitute for professional mental health
              diagnosis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

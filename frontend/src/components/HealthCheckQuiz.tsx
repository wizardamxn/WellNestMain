import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Heart, AlertTriangle, CheckCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { assessmentApi } from '../lib/api';
import { useUser } from '../hooks/useUserData';
import { useToast } from '../hooks/use-toast';

interface Question {
  id: string;
  text: string;
  options: { value: number; text: string }[];
}

const questions: Question[] = [
  {
    id: 'mood',
    text: 'Over the past two weeks, how often have you been feeling down, depressed, or hopeless?',
    options: [
      { value: 0, text: 'Not at all' },
      { value: 1, text: 'Several days' },
      { value: 2, text: 'More than half the days' },
      { value: 3, text: 'Nearly every day' }
    ]
  },
  {
    id: 'interest',
    text: 'How often have you had little interest or pleasure in doing things?',
    options: [
      { value: 0, text: 'Not at all' },
      { value: 1, text: 'Several days' },
      { value: 2, text: 'More than half the days' },
      { value: 3, text: 'Nearly every day' }
    ]
  },
  {
    id: 'sleep',
    text: 'How often have you had trouble sleeping or sleeping too much?',
    options: [
      { value: 0, text: 'Not at all' },
      { value: 1, text: 'Several days' },
      { value: 2, text: 'More than half the days' },
      { value: 3, text: 'Nearly every day' }
    ]
  },
  {
    id: 'energy',
    text: 'How often have you felt tired or had little energy?',
    options: [
      { value: 0, text: 'Not at all' },
      { value: 1, text: 'Several days' },
      { value: 2, text: 'More than half the days' },
      { value: 3, text: 'Nearly every day' }
    ]
  },
  {
    id: 'concentration',
    text: 'How often have you had trouble concentrating on things like schoolwork or reading?',
    options: [
      { value: 0, text: 'Not at all' },
      { value: 1, text: 'Several days' },
      { value: 2, text: 'More than half the days' },
      { value: 3, text: 'Nearly every day' }
    ]
  },
  {
    id: 'self_worth',
    text: 'How often have you been feeling bad about yourself or that you are a failure?',
    options: [
      { value: 0, text: 'Not at all' },
      { value: 1, text: 'Several days' },
      { value: 2, text: 'More than half the days' },
      { value: 3, text: 'Nearly every day' }
    ]
  },
  {
    id: 'appetite',
    text: 'How often have you had poor appetite or been overeating?',
    options: [
      { value: 0, text: 'Not at all' },
      { value: 1, text: 'Several days' },
      { value: 2, text: 'More than half the days' },
      { value: 3, text: 'Nearly every day' }
    ]
  },
  {
    id: 'stress',
    text: 'How would you rate your current stress levels regarding academic performance?',
    options: [
      { value: 0, text: 'Very low' },
      { value: 1, text: 'Low' },
      { value: 2, text: 'Moderate' },
      { value: 3, text: 'High' },
      { value: 4, text: 'Very high' }
    ]
  }
];

interface AssessmentResult {
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  insights: string;
  recommendations: string[];
}

export default function HealthCheckQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const { user } = useUser();
  const { toast } = useToast();

  const assessmentMutation = useMutation({
    mutationFn: (data: { userId: string; responses: Record<string, number> }) =>
      assessmentApi.createAssessment(data),
    onSuccess: (data) => {
      setResults({
        score: data.assessment.score,
        riskLevel: data.assessment.riskLevel,
        insights: data.insights,
        recommendations: data.recommendations
      });
      setShowResults(true);
      
      if (data.assessment.riskLevel === 'high') {
        toast({
          title: "Support Available",
          description: "We've detected you might benefit from additional support. Professional help is available.",
          variant: "default"
        });
      }
    },
    onError: () => {
      toast({
        title: "Assessment Error",
        description: "There was an issue processing your assessment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = responses[currentQ.id] !== undefined;

  const handleAnswerChange = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentQ.id]: parseInt(value)
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = () => {
    if (!user?.id) return;
    
    assessmentMutation.mutate({
      userId: user.id,
      responses
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
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return <CheckCircle className="w-5 h-5" />;
      case 'medium': return <Heart className="w-5 h-5" />;
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      default: return <Heart className="w-5 h-5" />;
    }
  };

  if (showResults && results) {
    return (
      <div data-testid="assessment-results" className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${getRiskLevelColor(results.riskLevel)}`}>
              {getRiskLevelIcon(results.riskLevel)}
            </div>
            <CardTitle className="text-xl">Assessment Complete</CardTitle>
            <p className="text-muted-foreground">Thank you for taking the time to check in with yourself.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Risk Level */}
            <div className="text-center">
              <Badge 
                data-testid={`risk-level-${results.riskLevel}`}
                className={`text-lg px-4 py-2 ${getRiskLevelColor(results.riskLevel)}`}
              >
                {results.riskLevel.charAt(0).toUpperCase() + results.riskLevel.slice(1)} Risk Level
              </Badge>
              <p data-testid="assessment-score" className="text-sm text-muted-foreground mt-2">
                Assessment Score: {results.score}/24
              </p>
            </div>

            {/* Insights */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Insights</h4>
              <p data-testid="assessment-insights" className="text-sm text-muted-foreground">
                {results.insights}
              </p>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium text-foreground mb-3">Recommended Next Steps</h4>
              <div data-testid="assessment-recommendations" className="space-y-2">
                {results.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-card border border-border rounded-lg">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary text-xs font-medium">{index + 1}</span>
                    </div>
                    <p className="text-sm text-foreground">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Resources */}
            {results.riskLevel === 'high' && (
              <Card className="bg-destructive/5 border-destructive/20">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                    <div>
                      <h4 className="font-medium text-destructive mb-2">Immediate Support Available</h4>
                      <div className="space-y-2 text-sm">
                        <div>National Crisis Helpline: <strong className="text-destructive">988</strong></div>
                        <div>Campus Counseling: <strong className="text-destructive">(555) 123-HELP</strong></div>
                        <div>Crisis Text Line: Text <strong className="text-destructive">HOME</strong> to <strong className="text-destructive">741741</strong></div>
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
                onClick={() => toast({
                  title: "Booking System",
                  description: "Opening counselor booking system...",
                })}
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
            This brief assessment helps us understand how you're feeling and provide appropriate support.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
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
            <h3 data-testid="current-question" className="text-lg font-medium leading-relaxed">
              {currentQ.text}
            </h3>

            <RadioGroup 
              value={responses[currentQ.id]?.toString() || ''} 
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {currentQ.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
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
              {isLastQuestion ? 'Complete Assessment' : 'Next'}
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <p className="text-xs text-muted-foreground">
              🔒 Your responses are completely confidential and anonymous. 
              This assessment is not a substitute for professional mental health diagnosis.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Shield, 
  CheckCircle, 
  User, 
  Phone, 
  Clock,
  Heart,
  Star,
  AlertCircle
} from 'lucide-react';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const urgencyLevels = [
  { value: 'low', label: 'Low - Within a week', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium - Within 2-3 days', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High - Within 24 hours', color: 'bg-red-100 text-red-800' },
  { value: 'crisis', label: 'Crisis - Immediate help needed', color: 'bg-red-200 text-red-900' }
];

export default function BookingSystem() {
  const [formData, setFormData] = useState({
    sessionType: '',
    counselorPreference: '',
    femaleOnlyRequest: false,
    preferredDate: '',
    preferredTime: '',
    urgencyLevel: '',
    concerns: '',
    previousCounseling: '',
    emergencyContact: '',
    privacyConsent: false,
    reminderConsent: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [showEmergencyInfo, setShowEmergencyInfo] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Show emergency info if crisis level selected
    if (field === 'urgencyLevel' && value === 'crisis') {
      setShowEmergencyInfo(true);
    }
  };

  const handleFemaleOnlyToggle = () => {
    setFormData(prev => ({
      ...prev,
      femaleOnlyRequest: !prev.femaleOnlyRequest,
      counselorPreference: !prev.femaleOnlyRequest ? 'female' : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.privacyConsent) {
      alert('Please agree to the privacy policy to continue.');
      return;
    }

    if (formData.urgencyLevel === 'crisis') {
      if (!confirm('For crisis situations, we recommend calling our 24/7 crisis line at 988. Would you like to continue with booking?')) {
        return;
      }
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setBookingId(`BK-${Date.now()}`);
      setIsBooked(true);
    } catch (error) {
      alert('Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      sessionType: '',
      counselorPreference: '',
      femaleOnlyRequest: false,
      preferredDate: '',
      preferredTime: '',
      urgencyLevel: '',
      concerns: '',
      previousCounseling: '',
      emergencyContact: '',
      privacyConsent: false,
      reminderConsent: true
    });
    setIsBooked(false);
    setBookingId('');
    setShowEmergencyInfo(false);
  };

  const isFormValid = formData.sessionType && 
                     formData.preferredDate && 
                     formData.preferredTime && 
                     formData.urgencyLevel &&
                     formData.privacyConsent;

  const selectedUrgency = urgencyLevels.find(level => level.value === formData.urgencyLevel);

  if (isBooked) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-6">
              Your counseling session has been scheduled confidentially.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-left space-y-2">
                <div className="flex justify-between">
                  <span>Booking ID:</span>
                  <span className="font-mono text-xs">{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Session:</span>
                  <span>{formData.sessionType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{formData.preferredDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{formData.preferredTime}</span>
                </div>
                {formData.femaleOnlyRequest && (
                  <div className="flex justify-between">
                    <span>Counselor:</span>
                    <span className="flex items-center">
                      <Heart className="w-3 h-3 text-pink-500 mr-1" />
                      Female Only
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Priority:</span>
                  <Badge className={`text-xs ${selectedUrgency?.color}`}>
                    {selectedUrgency?.label.split(' - ')[0]}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={resetForm} variant="outline" className="w-full">
                Book Another Session
              </Button>
              
              <div className="text-xs text-gray-500 space-y-1">
                <div>Crisis support: <strong>988</strong></div>
                <div>Campus help: <strong>(555) 123-HELP</strong></div>
                {formData.reminderConsent && (
                  <div className="flex items-center justify-center space-x-1 text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    <span>Reminders enabled</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Book a Counseling Session</span>
          </CardTitle>
          <p className="text-gray-600">
            Schedule a confidential session with our mental health professionals.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Session Type & Urgency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionType">Session Type *</Label>
                <Select value={formData.sessionType} onValueChange={(value) => handleChange('sessionType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select session type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual Session</SelectItem>
                    <SelectItem value="group">Group Session</SelectItem>
                    <SelectItem value="couples">Couples Counseling</SelectItem>
                    <SelectItem value="family">Family Therapy</SelectItem>
                    <SelectItem value="follow-up">Follow-up Session</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="urgencyLevel">Urgency Level *</Label>
                <Select value={formData.urgencyLevel} onValueChange={(value) => handleChange('urgencyLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How urgent is this?" />
                  </SelectTrigger>
                  <SelectContent>
                    {urgencyLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Crisis Alert */}
            {showEmergencyInfo && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Crisis Support Available</h4>
                    <p className="text-sm text-red-700 mt-1">
                      For immediate help, please call <strong>988</strong> (Crisis Hotline) or 
                      <strong> 911</strong> in case of emergency.
                    </p>
                    <p className="text-xs text-red-600 mt-2">
                      You can still book this session for additional support.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Counselor Preferences */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Counselor Preferences</h4>
              
              {/* Female Only Button */}
              <div className="flex items-center space-x-3 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                <Button
                  type="button"
                  variant={formData.femaleOnlyRequest ? "default" : "outline"}
                  size="sm"
                  onClick={handleFemaleOnlyToggle}
                  className={formData.femaleOnlyRequest ? 
                    "bg-pink-600 hover:bg-pink-700" : 
                    "border-pink-300 text-pink-700 hover:bg-pink-100"
                  }
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Female Counselor Only
                </Button>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    {formData.femaleOnlyRequest ? 
                      "You'll be matched with a female counselor" :
                      "Request a female counselor for your comfort"
                    }
                  </p>
                </div>
              </div>

              {/* Additional Counselor Preferences */}
              {!formData.femaleOnlyRequest && (
                <div>
                  <Label htmlFor="counselorPreference">Counselor Specialization (Optional)</Label>
                  <Select value={formData.counselorPreference} onValueChange={(value) => handleChange('counselorPreference', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any specialization preference?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-preference">No preference</SelectItem>
                      <SelectItem value="anxiety">Anxiety & Depression</SelectItem>
                      <SelectItem value="academic">Academic Stress</SelectItem>
                      <SelectItem value="relationships">Relationships</SelectItem>
                      <SelectItem value="trauma">Trauma & PTSD</SelectItem>
                      <SelectItem value="substance">Substance Abuse</SelectItem>
                      <SelectItem value="eating">Eating Disorders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredDate">Preferred Date *</Label>
                <Input
                  id="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleChange('preferredDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <Label htmlFor="preferredTime">Preferred Time *</Label>
                <Select value={formData.preferredTime} onValueChange={(value) => handleChange('preferredTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{time}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="concerns">What would you like to discuss? (Optional)</Label>
                <Textarea
                  id="concerns"
                  value={formData.concerns}
                  onChange={(e) => handleChange('concerns', e.target.value)}
                  placeholder="Share what's on your mind... This helps your counselor prepare better."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="previousCounseling">Previous Counseling Experience</Label>
                  <Select value={formData.previousCounseling} onValueChange={(value) => handleChange('previousCounseling', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Have you had counseling before?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never had counseling</SelectItem>
                      <SelectItem value="past">Yes, in the past</SelectItem>
                      <SelectItem value="current">Currently seeing someone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact (Optional)</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleChange('emergencyContact', e.target.value)}
                    placeholder="Phone number or name"
                  />
                </div>
              </div>
            </div>

            {/* Consent Checkboxes */}
            <div className="space-y-4">
              {/* Privacy Consent */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacyConsent"
                    checked={formData.privacyConsent}
                    onCheckedChange={(checked) => handleChange('privacyConsent', Boolean(checked))}
                  />
                  <div>
                    <Label htmlFor="privacyConsent" className="cursor-pointer">
                      I understand and agree to the privacy policy *
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Your session will be completely confidential and kept private according 
                      to professional counseling standards and HIPAA regulations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reminder Consent */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="reminderConsent"
                  checked={formData.reminderConsent}
                  onCheckedChange={(checked) => handleChange('reminderConsent', Boolean(checked))}
                />
                <div>
                  <Label htmlFor="reminderConsent" className="cursor-pointer">
                    Send me appointment reminders
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Receive email and SMS reminders 24 hours before your session.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Booking Session...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Session Confidentially
                </>
              )}
            </Button>

            {/* Form Summary */}
            {formData.sessionType && (
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <h4 className="font-medium mb-2">Booking Summary:</h4>
                <div className="space-y-1 text-gray-600">
                  <div>Session: {formData.sessionType}</div>
                  {formData.femaleOnlyRequest && (
                    <div className="flex items-center">
                      <Heart className="w-3 h-3 text-pink-500 mr-1" />
                      Female counselor requested
                    </div>
                  )}
                  {formData.urgencyLevel && (
                    <div className="flex items-center">
                      Priority: 
                      <Badge className={`ml-2 text-xs ${selectedUrgency?.color}`}>
                        {selectedUrgency?.label.split(' - ')[0]}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Enhanced Privacy & Support Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Privacy Notice */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">100% Confidential</h3>
            </div>
            <p className="text-sm text-gray-600">
              Your privacy is our priority. All sessions are confidential and your 
              information is securely protected according to HIPAA standards.
            </p>
            <div className="mt-3 flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-xs text-gray-500">4.9/5 trust rating</span>
            </div>
          </CardContent>
        </Card>

        {/* Support Options */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold">24/7 Support</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Crisis Line:</span>
                <strong>988</strong>
              </div>
              <div className="flex justify-between">
                <span>Campus Emergency:</span>
                <strong>(555) 123-4567</strong>
              </div>
              <div className="flex justify-between">
                <span>Text Support:</span>
                <strong>Text HOME to 741741</strong>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

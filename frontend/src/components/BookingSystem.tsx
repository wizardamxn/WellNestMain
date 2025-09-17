import { useState } from "react";
import {
  Video,
  Phone,
  MapPin,
  Star,
  Shield,
  Award,
  User,
  Users,
  MessageSquare,
  CheckCircle,
  Languages,
} from "lucide-react";

// Types
interface Counsellor {
  id: string;
  name: string;
  designation: string;
  experience: number;
  specialization: string[];
  languages: string[];
  availability: string;
  rating: number;
  image: string;
  about: string;
  nextAvailable: string;
  totalSessions: number;
}

interface Booking {
  id: string;
  studentId: string;
  counsellorId: string;
  counsellorName: string;
  date: string;
  timeSlot: string;
  specificTime?: string;
  mode: string;
  status: string;
  concern: string;
}

interface BookingForm {
  counsellorId: string;
  date: string;
  timeSlot: string;
  specificTime: string;
  mode: string;
  concern: string;
  anonymousId: string;
}

// Mock Data
const counsellorsData: Counsellor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    designation: "Clinical Psychologist",
    experience: 8,
    specialization: ["Anxiety", "Depression", "Stress Management"],
    languages: ["English", "Hindi"],
    availability: "Online",
    rating: 4.9,
    image: "/api/placeholder/100/100",
    about:
      "Specialized in cognitive behavioral therapy with focus on anxiety and mood disorders.",
    nextAvailable: "2025-09-18",
    totalSessions: 1200,
  },
  {
    id: "2",
    name: "Dr. Rajesh Sharma",
    designation: "Student Counsellor",
    experience: 12,
    specialization: ["Academic Stress", "Career Guidance", "Sleep Issues"],
    languages: ["Hindi", "English", "Punjabi"],
    availability: "Slots Available",
    rating: 4.8,
    image: "/api/placeholder/100/100",
    about:
      "Dedicated to helping students overcome academic challenges and career confusion.",
    nextAvailable: "2025-09-17",
    totalSessions: 980,
  },
  {
    id: "3",
    name: "Dr. Priya Patel",
    designation: "Addiction Specialist",
    experience: 6,
    specialization: ["Addiction", "Trauma Recovery", "PTSD"],
    languages: ["English", "Gujarati", "Hindi"],
    availability: "Online",
    rating: 4.7,
    image: "/api/placeholder/100/100",
    about: "Expert in addiction recovery and trauma-informed care approaches.",
    nextAvailable: "2025-09-19",
    totalSessions: 750,
  },
  {
    id: "4",
    name: "Dr. Michael Chen",
    designation: "Family Therapist",
    experience: 10,
    specialization: ["Family Therapy", "Relationship Issues", "Communication"],
    languages: ["English", "Mandarin"],
    availability: "Offline",
    rating: 4.6,
    image: "/api/placeholder/100/100",
    about:
      "Specializes in family dynamics and interpersonal relationship counseling.",
    nextAvailable: "2025-09-20",
    totalSessions: 850,
  },
];

const bookingsData: Booking[] = [
  {
    id: "1",
    studentId: "Student#1042",
    counsellorId: "1",
    counsellorName: "Dr. Sarah Johnson",
    date: "2025-09-20",
    timeSlot: "afternoon",
    mode: "video",
    status: "confirmed",
    concern: "Anxiety",
  },
  {
    id: "2",
    studentId: "Student#2183",
    counsellorId: "2",
    counsellorName: "Dr. Rajesh Sharma",
    date: "2025-09-18",
    timeSlot: "morning",
    mode: "in-person",
    status: "pending",
    concern: "Academic Stress",
  },
];

const timeSlots: Record<string, string[]> = {
  morning: [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
  ],
  afternoon: [
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
  ],
  evening: ["3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"],
};

const specializations = [
  "Anxiety",
  "Depression",
  "Stress Management",
  "Academic Stress",
  "Career Guidance",
  "Sleep Issues",
  "Addiction",
  "Trauma Recovery",
  "PTSD",
  "Family Therapy",
  "Relationship Issues",
  "Communication",
];

const MentalHealthBookingSystem = () => {
  const [counsellors] = useState<Counsellor[]>(counsellorsData);
  const [selectedCounsellor, setSelectedCounsellor] =
    useState<Counsellor | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    counsellorId: "",
    date: "",
    timeSlot: "",
    specificTime: "",
    mode: "",
    concern: "",
    anonymousId: "",
  });
  const [bookings, setBookings] = useState<Booking[]>(bookingsData);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [recommendations, setRecommendations] = useState<Counsellor[]>([]);
  const [selectedConcern, setSelectedConcern] = useState("");

  // Generate anonymous ID
  const generateAnonymousId = (): string => {
    return `Student#${Math.floor(1000 + Math.random() * 9000)}`;
  };

  // AI Recommendation System
  const getRecommendations = (concern: string): Counsellor[] => {
    const concernMapping: Record<string, string[]> = {
      Anxiety: ["Anxiety", "Stress Management", "Depression"],
      "Academic Stress": [
        "Academic Stress",
        "Stress Management",
        "Career Guidance",
      ],
      "Sleep Issues": ["Sleep Issues", "Stress Management", "Anxiety"],
      Depression: ["Depression", "Anxiety", "Trauma Recovery"],
      "Relationship Issues": [
        "Relationship Issues",
        "Family Therapy",
        "Communication",
      ],
    };

    const relevantSpecs = concernMapping[concern] || [concern];

    const scored = counsellors.map((counsellor) => {
      let score = 0;
      relevantSpecs.forEach((spec) => {
        if (counsellor.specialization.includes(spec)) score += 3;
      });
      if (
        counsellor.availability === "Online" ||
        counsellor.availability === "Slots Available"
      )
        score += 2;
      score += counsellor.rating;
      return { ...counsellor, score };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 3);
  };

  const handleBookAppointment = (counsellor: Counsellor) => {
    setSelectedCounsellor(counsellor);
    setBookingForm((prev) => ({
      ...prev,
      counsellorId: counsellor.id,
      anonymousId: generateAnonymousId(),
    }));
    setShowBookingModal(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCounsellor) return;

    const newBooking: Booking = {
      id: Date.now().toString(),
      studentId: bookingForm.anonymousId,
      counsellorId: bookingForm.counsellorId,
      counsellorName: selectedCounsellor.name,
      date: bookingForm.date,
      timeSlot: bookingForm.timeSlot,
      specificTime: bookingForm.specificTime,
      mode: bookingForm.mode,
      status: "pending",
      concern: bookingForm.concern,
    };

    setBookings((prev) => [...prev, newBooking]);
    setShowBookingModal(false);
    setShowConfirmation(true);

    // Reset form
    setBookingForm({
      counsellorId: "",
      date: "",
      timeSlot: "",
      specificTime: "",
      mode: "",
      concern: "",
      anonymousId: "",
    });
  };

  const CounsellorCard = ({ counsellor }: { counsellor: Counsellor }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {counsellor.name}
              </h3>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  counsellor.availability === "Online"
                    ? "bg-green-100 text-green-800"
                    : counsellor.availability === "Slots Available"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {counsellor.availability}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {counsellor.designation}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
              <span className="flex items-center">
                <Award className="w-4 h-4 mr-1" />
                {counsellor.experience}+ years
              </span>
              <span className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                {counsellor.rating}
              </span>
              <span className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {counsellor.totalSessions}+ sessions
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Specializations
          </h4>
          <div className="flex flex-wrap gap-2">
            {counsellor.specialization.map((spec) => (
              <span
                key={spec}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Languages</h4>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Languages className="w-4 h-4" />
            <span>{counsellor.languages.join(", ")}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">{counsellor.about}</p>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            Next available:{" "}
            {new Date(counsellor.nextAvailable).toLocaleDateString()}
          </div>
          <button
            onClick={() => handleBookAppointment(counsellor)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );

  const BookingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Book Appointment
            </h2>
            <button
              onClick={() => setShowBookingModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ×
            </button>
          </div>
          {selectedCounsellor && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedCounsellor.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedCounsellor.designation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleBookingSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Anonymous ID
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="font-mono text-sm">
                    {bookingForm.anonymousId}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This ID protects your privacy
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What would you like to discuss?
              </label>
              <select
                value={bookingForm.concern}
                onChange={(e) => {
                  setBookingForm((prev) => ({
                    ...prev,
                    concern: e.target.value,
                  }));
                  setSelectedConcern(e.target.value);
                  if (e.target.value) {
                    setRecommendations(getRecommendations(e.target.value));
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select your concern</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                value={bookingForm.date}
                onChange={(e) =>
                  setBookingForm((prev) => ({ ...prev, date: e.target.value }))
                }
                min={new Date().toISOString().split("T")[0]}
                max={
                  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Preference
              </label>
              <select
                value={bookingForm.timeSlot}
                onChange={(e) =>
                  setBookingForm((prev) => ({
                    ...prev,
                    timeSlot: e.target.value,
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select time slot</option>
                <option value="morning">Morning (9:00 AM - 12:00 PM)</option>
                <option value="afternoon">
                  Afternoon (12:00 PM - 3:00 PM)
                </option>
                <option value="evening">Evening (3:00 PM - 6:00 PM)</option>
              </select>
            </div>

            {bookingForm.timeSlot && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Time
                </label>
                <select
                  value={bookingForm.specificTime}
                  onChange={(e) =>
                    setBookingForm((prev) => ({
                      ...prev,
                      specificTime: e.target.value,
                    }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select specific time</option>
                  {timeSlots[bookingForm.timeSlot]?.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "video", icon: Video, label: "Video Call" },
                  { value: "phone", icon: Phone, label: "Phone Call" },
                  { value: "in-person", icon: MapPin, label: "In-Person" },
                  { value: "chat", icon: MessageSquare, label: "Text Chat" },
                ].map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() =>
                      setBookingForm((prev) => ({ ...prev, mode: mode.value }))
                    }
                    className={`p-3 border rounded-lg flex items-center justify-center space-x-2 transition-all ${
                      bookingForm.mode === mode.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <mode.icon className="w-4 h-4" />
                    <span className="text-sm">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {recommendations.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">
                AI Recommendations for "{selectedConcern}"
              </h4>
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <div key={rec.id} className="text-sm text-yellow-700">
                    {index + 1}. <strong>{rec.name}</strong> -{" "}
                    {rec.specialization.join(", ")} (Rating: {rec.rating})
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-green-500 mt-0.5" />
              <div className="text-sm text-green-700">
                <strong>Privacy Notice:</strong> Your identity remains
                completely anonymous. The counsellor will only see your
                anonymous ID. All conversations are confidential and encrypted.
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setShowBookingModal(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 mb-4">
            Your appointment has been successfully submitted and is pending
            approval.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 text-left">
            <div className="text-sm space-y-1">
              <div>
                <strong>Counsellor:</strong> {selectedCounsellor?.name}
              </div>
              <div>
                <strong>Your ID:</strong> {bookingForm.anonymousId}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {new Date(bookingForm.date).toLocaleDateString()}
              </div>
              <div>
                <strong>Time:</strong> {bookingForm.specificTime}
              </div>
              <div>
                <strong>Mode:</strong> {bookingForm.mode}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowConfirmation(false)}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4">
            Mental Health Booking System
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Professional, confidential counseling designed for students. Take
            the first step toward better mental health.
          </p>
        </div>

        {/* Counsellors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {counsellors.map((counsellor) => (
            <CounsellorCard key={counsellor.id} counsellor={counsellor} />
          ))}
        </div>

        {/* Modals */}
        {showBookingModal && <BookingModal />}
        {showConfirmation && <ConfirmationModal />}
      </div>
    </div>
  );
};

export default MentalHealthBookingSystem;

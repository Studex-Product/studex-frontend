import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import roommates from "@/sample data/mates";
import Verified from "@/assets/icons/check-verified.svg";
import {
  User,
  MapPin,
  Phone,
  MessageSquareTextIcon,
  Flag,
  CheckCircle,
} from "lucide-react";

// This simulates the currently logged-in user for compatibility calculation
const currentUser = {
  preferences: {
    smoking: "Non-smoker",
    social: "Introvert",
    pets: "No Pets",
    lifestyle: "Clean",
    guests: "Okay",
    music: "Likes quiet",
    food: "Loves cooking",
    sleep: "Night Owl",
  },
};

// This function now calculates compatibility dynamically
const calculateCompatibility = (user, profile) => {
  // If there's no logged-in user or they lack preferences, we can't calculate a score.
  if (!currentUser || !currentUser.preferences) {
    return {
      score: 0,
      // eslint-disable-next-line no-unused-vars
      traits: Object.entries(profile.preferences).map(([_, value]) => ({
        name: value,
        match: false,
      })),
    };
  }

  const userPrefs = user.preferences;
  const profilePrefs = profile.preferences;
  const commonKeys = Object.keys(userPrefs).filter(
    (key) => key in profilePrefs
  );

  let matches = 0;
  const traits = [];

  commonKeys.forEach((key) => {
    const isMatch = userPrefs[key] === profilePrefs[key];
    if (isMatch) {
      matches++;
    }
    traits.push({ name: profilePrefs[key], match: isMatch });
  });

  const score = Math.round((matches / commonKeys.length) * 100);
  return { score, traits };
};

const fetchRoommateDetails = async (roommateId) => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const profile = roommates.find((r) => r.id.toString() === roommateId);
  if (!profile) throw new Error("Roommate not found");

  const compatibility = calculateCompatibility(currentUser, profile);

  return {
    ...profile,
    joinedDate: "Joined studex 3yrs ago",
    phoneNumber: "09123456789",
    compatibility,
    roommatePreferences: Object.entries(profile.preferences).map(
      ([key, value]) => ({
        key: key.charAt(0).toUpperCase() + key.slice(1),
        value,
      })
    ),
  };
};

const RoommateDetail = () => {
  const { roommateId } = useParams();
  const { user } = useAuth();

  // temporary user object for compatibility check.
  // This uses the real logged-in user but attaches mock preferences for now.
  const currentUserForCompat = user
    ? {
        ...user,
        preferences: {
          // Mock preferences to be replaced by real data later
          smoking: "Non-smoker",
          social: "Introvert",
          pets: "No Pets",
          lifestyle: "Clean",
          guests: "Okay with guests",
          music: "Likes quiet",
          food: "Loves cooking",
          sleep: "Night Owl",
        },
      }
    : null;

  const {
    data: roommate,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roommateDetail", roommateId, currentUserForCompat?.id],
    queryFn: () => fetchRoommateDetails(roommateId, currentUserForCompat),
  });

  const handleChatNow = () => {
    console.log("Open chat with seller");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
         <div className="p-6 bg-purple-50 min-h-screen">
          <div className="animate-pulse space-y-8">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-3 bg-gray-200 rounded-lg p-6 h-48"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-gray-200 rounded-lg p-6 h-48"></div>
              <div className="bg-gray-200 rounded-lg p-6 h-48"></div>
            </div>
              <div className="bg-gray-200 rounded-lg p-6 h-48"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-red-500">
          Error: {error.message}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 bg-purple-50">
        <nav className="text-sm mb-6">
          <Link to="/roommates" className="text-gray-600 hover:text-purple-600">
            Roommates
          </Link>
          <span className="mx-2 text-gray-400">&gt;</span>
          <span className="font-medium text-gray-800">{roommate.name}</span>
        </nav>

        {/* Profile Summary Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <img
                  src={roommate.image}
                  alt={roommate.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                {/* online badge */}
                {roommate.isOnline && (
                  <span title={roommate.isOnline ? "Online" : "Offline"} className="absolute top-1 right-1 block h-4 w-4 rounded-full bg-green-500 border-2 border-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {roommate.name}
                  </h1>
                  <div className="flex items-center w-fit bg-green-100 text-green-800 text-xs font-medium  p-0.5 rounded-md mt-1">
                    <img src={Verified} alt="Verified" className="w-4 h-4" />
                    {/* <span>Verified</span> */}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
                  <span className="flex items-center gap-1.5">
                    <User size={14} /> {roommate.joinedDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} /> {roommate.university} -{" "}
                    {roommate.location}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
              <a
                href={`tel:${roommate.phoneNumber}`}
                className="flex-1 text-center whitespace-nowrap px-4 py-2 border border-purple-600 text-purple-600 rounded-lg text-sm font-semibold hover:bg-purple-50 flex items-center justify-center gap-2"
              >
                <Phone size={16} /> {roommate.phoneNumber}
              </a>
                <button
                  onClick={handleChatNow}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-purple-100 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors cursor-pointer"
                >
                  <MessageSquareTextIcon className="w-4 h-4" />
                  <span>Chat Now</span>
                </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-3">About Me</h2>
              <p className="text-gray-600 mb-4">{roommate.aboutMe}</p>
              <h3 className="font-semibold mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {roommate.interests.map((interest) => (
                  <span
                    key={interest}
                    className="border text-gray-700 text-sm px-3 py-1 rounded-md"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">Apartment Preference</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <span className="font-semibold text-gray-500 block">
                    Apartment type
                  </span>{" "}
                  {roommate.apartmentPreference.type}
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block">
                    Preferred Location
                  </span>{" "}
                  {roommate.apartmentPreference.location}
                </div>
                <div>
                  <span className="font-semibold text-gray-500 block">
                    Budget
                  </span>{" "}
                  {roommate.apartmentPreference.budget}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {roommate.apartmentPreference.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border text-gray-700 text-sm px-3 py-1 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">Roommate Preferences</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-purple-800 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  <span>{roommate.gender}</span>
                </li>
                {roommate.roommatePreferences.map((pref) => (
                  <li key={pref.key} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-purple-800 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <span>{pref.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            {/* Only show compatibility if a user is logged in */}
            {currentUserForCompat && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-center">
                  Compatibility
                </h2>
                <div className="w-40 h-40 mx-auto mb-4">
                  <CircularProgressbar
                    value={roommate.compatibility.score}
                    text={`${roommate.compatibility.score}%`}
                    strokeWidth={15}
                    styles={buildStyles({
                      textColor: "#333",
                      pathColor: "#2ECC37",
                      trailColor: "#B9EEBC",
                      strokeLinecap: "round",
                    })}
                  />
                </div>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  {roommate.compatibility.traits.map((trait, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-2 ${
                        trait.match ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      <CheckCircle
                        size={14}
                        className={
                          trait.match ? "text-green-500" : "text-gray-300"
                        }
                      />
                      {trait.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">Safety Tips</h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-purple-800 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  Always verify the apartment together before making payments.
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-purple-800 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  Always meet your potential roommate in a public place first.
                </li>
              </ul>
            </div>
            <button className="w-full md:w-fit mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer">
              <Flag size={16} /> Report User
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RoommateDetail;

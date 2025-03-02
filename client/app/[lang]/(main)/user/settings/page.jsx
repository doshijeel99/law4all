"use client";

import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
  LogOut,
  Settings,
  Shield,
  User,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [activeSection, setActiveSection] = useState("personal");
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phoneNumber, setPhoneNumber] = useState(
    user?.publicMetadata?.phoneNumber || ""
  );
  const [location, setLocation] = useState(
    user?.publicMetadata?.location || ""
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.publicMetadata?.dateOfBirth || ""
  );
  const [age, setAge] = useState(user?.publicMetadata?.age || "");
  const [mentalAbilityLevel, setMentalAbilityLevel] = useState(
    user?.publicMetadata?.mentalAbilityLevel || "Moderate"
  );

  const sidebarItems = [
    { icon: User, label: "Personal Info", section: "personal" },
    { icon: Shield, label: "Security", section: "security" },
    { icon: Settings, label: "Notifications", section: "notifications" },
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = user?.publicMetadata?.userId;
      const existingUser = await getUserDetails(userId);

      setFirstName(user?.firstName);
      setLastName(user?.lastName);
      setAge(existingUser?.age);
      setLocation(existingUser?.location);
      setPhoneNumber(existingUser?.phoneNumber);
      setMentalAbilityLevel(existingUser?.mentalAbilityLevel);

      const date = new Date(existingUser?.dateOfBirth);
      const formattedDate = date.toISOString().split("T")[0];
      setDateOfBirth(formattedDate);
    };

    fetchUserDetails();
  }, [user]);

  const handleProfileUpdate = async () => {
    setIsUpdating(true);
    try {
      await user?.update({
        firstName,
        lastName,
      });

      const userId = user?.publicMetadata?.userId;

      if (userId) {
        await updateUser(userId, {
          phoneNumber,
          location,
          dateOfBirth,
          age,
          mentalAbilityLevel,
        });
      }

      toast({
        title: "Profile Updated Successfully!",
        description: `${firstName} ${lastName}, your details have been updated`,
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Profile Update Error!",
        description:
          "An error occurred while updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const renderPersonalInfoSection = () => {
    return (
      <div className="space-y-6">
        <div className="relative flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-900 mx-auto flex items-center justify-center shadow-xl overflow-hidden">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={`${firstName} ${lastName}'s profile photo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-16 w-16 text-indigo-600 dark:text-indigo-300" />
            )}
          </div>
          <button
            onClick={() =>
              toast({
                title: "Image upload feature coming soon!",
              })
            }
            className="absolute bottom-10 right-1/2 translate-x-12 translate-y-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hover:scale-110 duration-300"
            title="Upload profile photo"
          >
            <Camera className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Click the camera icon to update your profile picture
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="flex items-center px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">
                  {user?.primaryEmailAddress?.emailAddress ||
                    "No email address"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed. Contact support for assisbluece.
              </p>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 absolute ml-3" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 absolute ml-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="0"
                max="150"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date of Birth
              </label>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 absolute ml-3" />
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
            </div>
            <div className="pt-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mental Ability Level
              </label>
              <select
                value={mentalAbilityLevel}
                onChange={(e) => setMentalAbilityLevel(e.target.value)}
                className="h-10 w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
                <option value="Profound">Profound</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Award className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Your Achievements
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Points Earned
                </h4>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {user?.publicMetadata?.points || 0}
                </span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      (user?.publicMetadata?.points || 0) / 10,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {user?.publicMetadata?.points
                  ? `You're making great progress!`
                  : `Complete tasks to earn points`}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Badges Earned
              </h4>
              {user?.publicMetadata?.badges &&
              user.publicMetadata.badges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.publicMetadata.badges.map((badge, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 text-xs rounded-full"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  No badges earned yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buttons - With loading state */}
        <div className="flex justify-end space-x-4 pt-6 border-t dark:border-gray-700">
          <button
            onClick={() => {
              setFirstName(user?.firstName || "");
              setLastName(user?.lastName || "");
              setPhoneNumber(user?.publicMetadata?.phoneNumber || "");
              setLocation(user?.publicMetadata?.location || "");
              setDateOfBirth(user?.publicMetadata?.dateOfBirth || "");
              setAge(user?.publicMetadata?.age || "");
              setMentalAbilityLevel(
                user?.publicMetadata?.mentalAbilityLevel || "Moderate"
              );
            }}
            className="px-6 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={isUpdating}
          >
            Reset Changes
          </button>
          <button
            onClick={handleProfileUpdate}
            className={`px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center ${
              isUpdating ? "opacity-75 cursor-not-allowed" : ""
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderSecuritySection = () => {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              Two-factor authentication is enabled
            </span>
          </div>
        </div>

        {/* Enhanced security settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Account Security
          </h3>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Last changed: Never
                </p>
              </div>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                Change Password
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Login History
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Monitor recent account activity
                </p>
              </div>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                View History
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Connected Devices
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Manage devices with access to your account
                </p>
              </div>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                Manage Devices
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNotificationsSection = () => {
    return (
      <div className="space-y-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Choose how you'd like to receive notifications and updates.
        </p>

        <div className="space-y-4">
          {[
            { type: "Email", desc: "Get updates in your inbox" },
            { type: "Push", desc: "Receive alerts on your device" },
            { type: "SMS", desc: "Get text messages to your phone" },
          ].map(({ type, desc }) => (
            <div
              key={type}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <div>
                <span className="text-gray-900 dark:text-white font-medium">
                  {type} Notifications
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {desc}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>

        {/* Notification preferences */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Notification Preferences
          </h3>

          <div className="space-y-3">
            {[
              "Account updates",
              "New features",
              "Achievement milestones",
              "Security alerts",
              "Newsletter",
            ].map((pref) => (
              <div key={pref} className="flex items-center">
                <input
                  id={`pref-${pref.replace(/\s+/g, "-").toLowerCase()}`}
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`pref-${pref.replace(/\s+/g, "-").toLowerCase()}`}
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  {pref}
                </label>
              </div>
            ))}
          </div>

          <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
            Save Preferences
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "personal":
        return renderPersonalInfoSection();
      case "security":
        return renderSecuritySection();
      case "notifications":
        return renderNotificationsSection();
      default:
        return renderPersonalInfoSection();
    }
  };

  return (
    <div className="dark:from-gray-900 dark:to-gray-800 overflow-y-scroll">
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.section}
                    onClick={() => setActiveSection(item.section)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg flex items-center transition-all duration-300
                      ${
                        activeSection === item.section
                          ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 shadow-sm"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </button>
                ))}

                <button
                  onClick={() => signOut()}
                  className="w-full mt-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-9"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {
                    sidebarItems.find((item) => item.section === activeSection)
                      ?.label
                  }
                </h2>
              </div>
              <div className="p-6">{renderContent()}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

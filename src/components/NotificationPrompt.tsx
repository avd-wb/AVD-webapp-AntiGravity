import React, { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { requestNotificationPermission } from "../lib/firebase";

export function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only show if notifications are supported and not already granted/denied
    if ("Notification" in window && Notification.permission === "default") {
      const dismissed = localStorage.getItem("notificationPromptDismissed");
      if (!dismissed || Date.now() - parseInt(dismissed) > 86400000) {
        // Show after a slight delay
        setTimeout(() => setShowPrompt(true), 5000);
      }
    }
  }, []);

  const handleAllowClick = async () => {
    setShowPrompt(false);
    await requestNotificationPermission();
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("notificationPromptDismissed", Date.now().toString());
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:bottom-auto md:top-24 md:left-auto md:right-8 md:w-96 bg-white rounded-2xl shadow-xl p-5 z-[90] border border-gray-100"
        >
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex-shrink-0 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Bell className="w-5 h-5" />
              </div>
              <div className="pr-4">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Enable Notifications
                </h3>
                <p className="text-sm text-gray-600">
                  Stay updated with the latest union notices and news.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2 px-4 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Later
              </button>
              <button
                onClick={handleAllowClick}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Allow
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

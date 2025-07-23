"use client";

import React, { useState } from "react";
import { MessageSquare, Music } from "lucide-react";
import ReviewForm from "./forms/ReviewForm";
import AnnotationForm from "./forms/AnnotationForm";

interface LogFormTabsProps {
  onClose: () => void;
}

const LogFormTabs: React.FC<LogFormTabsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<"review" | "annotation">("review");

  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-[#D9D9D9] mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-3 font-medium ${
            activeTab === "review"
              ? "text-[#0C3B2E] border-b-2 border-[#0C3B2E]"
              : "text-[#A0A0A0] hover:text-[#1F2C24]"
          }`}
          onClick={() => setActiveTab("review")}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Review</span>
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-3 font-medium ${
            activeTab === "annotation"
              ? "text-[#0C3B2E] border-b-2 border-[#0C3B2E]"
              : "text-[#A0A0A0] hover:text-[#1F2C24]"
          }`}
          onClick={() => setActiveTab("annotation")}
        >
          <Music className="w-5 h-5" />
          <span>Annotation</span>
        </button>
      </div>

      {/* Form Content */}
      <div className="min-h-[400px]">
        {activeTab === "review" ? (
          <ReviewForm onClose={onClose} />
        ) : (
          <AnnotationForm onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default LogFormTabs;
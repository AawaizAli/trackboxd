import React from "react";
import { Annotation } from "@/app/songs/types";
import { Heart } from "lucide-react";

interface AnnotationCardProps {
    annotation: Annotation;
}

const AnnotationCard: React.FC<AnnotationCardProps> = ({ annotation }) => {
    return (
        <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <div className="font-medium text-[#1F2C24] mb-2">
                        {annotation.user}
                    </div>
                    <p className="text-[#1F2C24] line-clamp-2 mb-2">
                        {annotation.content}
                    </p>
                </div>
                <div className="flex items-center space-x-1 text-[#A0A0A0]">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{annotation.likes}</span>
                </div>
            </div>
            <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-[#A0A0A0]">
                    {annotation.timestamp}
                </span>
                <button className="text-xs text-[#6D9773] hover:text-[#5C8769]">
                    View annotation
                </button>
            </div>
        </div>
    );
};

export default AnnotationCard;

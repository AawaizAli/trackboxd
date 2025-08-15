import React, { useState } from "react";
import { Edit, Trash, Clock } from "lucide-react";
import { Annotation } from "@/app/songs/types";
import AnnotationForm from "@/components/log/forms/AnnotationForm";

interface EditableAnnotationCardProps {
  annotation: Annotation;
  onEdit: (annotation: Annotation) => void;
  onDelete: (annotationId: string) => void;
}

const EditableAnnotationCard: React.FC<EditableAnnotationCardProps> = ({ 
  annotation, 
  onEdit, 
  onDelete 
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSave = (updatedAnnotation: any) => {
    onEdit({
      ...annotation,
      ...updatedAnnotation
    });
    setIsEditMode(false);
  };

  return (
    <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg p-4 mb-4 relative">
      {isEditMode ? (
        <AnnotationForm 
          onClose={() => setIsEditMode(false)}
          onSave={handleSave}
          initialAnnotation={{
            id: annotation.id,
            text: annotation.text,
            timestamp: annotation.timestamp,
            isPublic: annotation.is_public,
            track: {
              id: annotation.item.id,
              name: annotation.item.name,
              artist: annotation.item.artist,
              album: annotation.item.album,
              coverArt: annotation.item.cover_url
            }
          }}
        />
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 relative overflow-hidden rounded-lg bg-gray-200 flex-shrink-0">
                <img
                  src={annotation.item.cover_url || "/default-album.png"}
                  alt={`${annotation.item.name} cover`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-semibold text-[#1F2C24]">
                  {annotation.item.name}
                </div>
                <div className="text-[#A0A0A0] text-xs">
                  {annotation.item.artist} • {formatDuration(annotation.timestamp)}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditMode(true)}
                className="p-1 text-[#6D9773] hover:text-[#5C8769]"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => onDelete(annotation.id)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>

          <div className="mb-2 flex items-center gap-1 text-[#A0A0A0] text-sm">
            <Clock size={14} />
            <span>{formatDuration(annotation.timestamp)}</span>
          </div>
          
          {annotation.text && (
            <p className="text-[#1F2C24] text-sm mb-3 bg-[#F9F9F9] rounded-md p-3">
              {annotation.text}
            </p>
          )}
          
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1 text-[#A0A0A0]">
              <span className={`px-2 py-1 rounded-full ${
                annotation.is_public 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {annotation.is_public ? "Public" : "Private"}
              </span>
            </div>
            <div className="text-[#A0A0A0]">
              {new Date(annotation.created_at).toLocaleDateString()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditableAnnotationCard;
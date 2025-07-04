import React, { useState } from 'react';
import {
  Layers,
  Check,
  X,
  Edit3,
  Trash2,
  FileText,
} from 'lucide-react';

import FieldEditor from '../components/FieldEditor'
import { fieldTypes } from '../constants/fieldTypes'

const SectionEditor = ({
  section,
  sectionIndex,
  onUpdate,
  onDelete,
  onAddField,
  onUpdateField,
  onDeleteField,
  onDragStart,
  onDragOver,
  onDrop,
  showNotification,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(section.title);

  const handleSave = () => {
    if (!localTitle.trim()) {
      showNotification('Section title is required', 'error');
      return;
    }
    onUpdate(section.id, { title: localTitle });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalTitle(section.title);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Layers className="w-5 h-5 text-white" />
          </div>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                className="text-xl font-bold border-2 border-blue-500 bg-blue-50 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Section Title"
              />
              <button
                onClick={handleSave}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
              <p className="text-gray-600">{section.fields.length} field{section.fields.length !== 1 ? 's' : ''}</p>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(section.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {section.fields.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No fields in this section yet</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {fieldTypes.map((fieldType) => (
              <button
                key={fieldType.type}
                onClick={() => onAddField(section.id, fieldType.type)}
                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${fieldType.color}`}
              >
                <fieldType.icon className="w-4 h-4 inline mr-2" />
                {fieldType.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {section.fields.map((field, index) => (
            <div
              key={field.id}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, index, sectionIndex)}
            >
              <FieldEditor
                field={field}
                sectionId={section.id}
                onUpdate={onUpdateField}
                onDelete={onDeleteField}
                onDragStart={onDragStart}
                index={index}
                sectionIndex={sectionIndex}
              />
            </div>
          ))}

          <div className="text-center py-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {fieldTypes.map((fieldType) => (
                <button
                  key={fieldType.type}
                  onClick={() => onAddField(section.id, fieldType.type)}
                  className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 hover:shadow-md text-sm ${fieldType.color}`}
                >
                  <fieldType.icon className="w-4 h-4 inline mr-1" />
                  {fieldType.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionEditor;

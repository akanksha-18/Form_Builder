import React, { useState} from 'react';
import { Plus, Eye, ArrowLeft, Settings, Save, Sparkles, AlertCircle,Edit3 ,Trash2, X} from 'lucide-react';
const FieldEditor = ({ field, sectionId, onUpdate, onDelete, onDragStart, index, sectionIndex }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localField, setLocalField] = useState(field);

    const handleSave = () => {
      const errors = [];
      if (!localField.label.trim()) errors.push('Label is required');
      if (localField.type === 'enum' && localField.options.length === 0) errors.push('At least one option is required');
      
      if (errors.length > 0) {
        showNotification(errors.join(', '), 'error');
        return;
      }
      
      onUpdate(sectionId, field.id, localField);
      setIsEditing(false);
    };

    const handleCancel = () => {
      setLocalField(field);
      setIsEditing(false);
    };

    return (
      <div
        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
        draggable
        onDragStart={(e) => onDragStart(e, index, sectionIndex)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full cursor-move" />
            <div>
              <div className="font-semibold text-gray-900">{field.label}</div>
              <div className="text-sm text-gray-600 capitalize">{field.type}</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(sectionId, field.id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4 bg-white p-4 rounded-lg border">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
              <input
                type="text"
                value={localField.label}
                onChange={(e) => setLocalField({ ...localField, label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Field label"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Placeholder</label>
              <input
                type="text"
                value={localField.placeholder}
                onChange={(e) => setLocalField({ ...localField, placeholder: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Placeholder text"
              />
            </div>

            {localField.type === 'enum' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                <div className="space-y-2">
                  {localField.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...localField.options];
                          newOptions[index] = e.target.value;
                          setLocalField({ ...localField, options: newOptions });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Option ${index + 1}`}
                      />
                      <button
                        onClick={() => {
                          const newOptions = localField.options.filter((_, i) => i !== index);
                          setLocalField({ ...localField, options: newOptions });
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setLocalField({ ...localField, options: [...localField.options, ''] })}
                    className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`required-${field.id}`}
                checked={localField.required}
                onChange={(e) => setLocalField({ ...localField, required: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor={`required-${field.id}`} className="text-sm font-medium text-gray-700">
                Required field
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            {field.placeholder && <div>Placeholder: {field.placeholder}</div>}
            {field.required && <div className="text-red-600 font-medium">Required</div>}
            {field.type === 'enum' && field.options.length > 0 && (
              <div>Options: {field.options.join(', ')}</div>
            )}
          </div>
        )}
      </div>
    );
  };
  export default FieldEditor;
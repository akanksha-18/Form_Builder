import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Hash,
  List,
  ToggleLeft,
  FileText,
  Type,
  Eye,
  Edit3,
} from 'lucide-react';

const SectionEditor = ({
  section,
  sectionIndex,
  fieldTypes,
  addField,
  updateSection,
  deleteSection,
  updateField,
  deleteField,
  handleDragStart,
  handleDragOver,
  handleDrop,
}) => {
  const [previewMode, setPreviewMode] = useState(false);

  const handleFieldTypeDragStart = (e, fieldType) => {
    e.dataTransfer.setData('fieldType', JSON.stringify(fieldType));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const onDropHandler = (e) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('fieldType');
    if (data) {
      const fieldType = JSON.parse(data);
      addField(section.id, fieldType.type);
    }
  };

  const getFieldIcon = (fieldType) => {
    const fieldConfig = fieldTypes.find((f) => f.type === fieldType);
    return fieldConfig ? fieldConfig.icon : Type;
  };

  const renderInteractiveField = (field, disabled = false) => {
    const IconComponent = getFieldIcon(field.type);

    switch (field.type) {
      case 'text':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                placeholder={field.placeholder || 'Enter text here...'}
                disabled={disabled}
              />
              <Type className="absolute left-3 top-3 w-4 h-4 text-blue-500" />
            </div>
          </div>
        );
      case 'number':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <input
                type="number"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                placeholder={field.placeholder || '123'}
                disabled={disabled}
              />
              <Hash className="absolute left-3 top-3 w-4 h-4 text-green-500" />
            </div>
          </div>
        );
      case 'boolean':
        return (
          <div className="mb-4">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <input
                type="checkbox"
                className="w-5 h-5 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
                disabled={disabled}
              />
              <span className="text-sm font-medium text-purple-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </span>
              <ToggleLeft className="w-5 h-5 text-purple-500 ml-auto" />
            </div>
          </div>
        );
      case 'enum':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {(field.options || []).map((option, i) => (
                <label key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`field-${field.id}`}
                    className="w-4 h-4 text-orange-600 border-orange-300 focus:ring-orange-500"
                    disabled={disabled}
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 'label':
        const labelStyle = {
          h1: 'text-3xl font-bold text-gray-800',
          h2: 'text-2xl font-semibold text-gray-700',
          h3: 'text-xl font-medium text-gray-600',
        };
        return (
          <div className="mb-4">
            <div
              className={
                labelStyle[field.labelStyle] ||
                'text-2xl font-semibold text-gray-700'
              }
            >
              {field.label || 'Label Text'}
            </div>
          </div>
        );
      default:
        return (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-2">
            <IconComponent className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{field.type}</span>
          </div>
        );
    }
  };

  if (previewMode) {
    return (
      <div className="border-2 border-gray-300 rounded-xl p-6 bg-white shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
          <button
            onClick={() => setPreviewMode(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2 transition-all duration-200"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </div>

        <div className="space-y-4">
          {section.fields.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No fields in this section</p>
            </div>
          ) : (
            section.fields.map((field) => (
              <div key={field.id}>{renderInteractiveField(field, true)}</div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 hover:border-gray-400 transition-all duration-200"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDropHandler}
    >
      <div className="mb-6 flex items-center justify-between">
        <input
          type="text"
          value={section.title}
          onChange={(e) =>
            updateSection(section.id, { title: e.target.value })
          }
          className="text-xl font-bold border-2 border-transparent bg-transparent focus:border-blue-500 focus:bg-white focus:outline-none rounded-lg px-3 py-2 transition-all duration-200"
          placeholder="Section Title"
        />
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPreviewMode(true)}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => deleteSection(section.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {section.fields.map((field, fieldIndex) => {
          const IconComponent = getFieldIcon(field.type);
          return (
            <div
              key={field.id}
              className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md cursor-move transition-all duration-200 hover:border-gray-300"
              draggable
              onDragStart={(e) => handleDragStart(e, fieldIndex, sectionIndex)}
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, fieldIndex, sectionIndex)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 text-gray-400 cursor-grab">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 5h2v2H9V5zm0 6h2v2H9v-2zm0 6h2v2H9v-2zm6-12h2v2h-2V5zm0 6h2v2h-2v-2zm0 6h2v2h-2v-2z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-blue-500" />
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) =>
                        updateField(section.id, field.id, {
                          label: e.target.value,
                        })
                      }
                      className="border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm py-1 px-2 bg-transparent font-medium"
                      placeholder="Field Label"
                    />
                  </div>
                </div>
                <button
                  onClick={() => deleteField(section.id, field.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {renderInteractiveField(field)}
            </div>
          );
        })}
      </div>

      {section.fields.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <p>Drag field types here or use the buttons below to add fields</p>
        </div>
      )}

      <div className="mt-6 border-t pt-4">
        <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Quick Add Fields
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {fieldTypes.map((fieldType) => (
            <button
              key={fieldType.type}
              onClick={() => addField(section.id, fieldType.type)}
              draggable={true}
              onDragStart={(e) => handleFieldTypeDragStart(e, fieldType)}
              className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium cursor-pointer hover:shadow-md hover:scale-105 ${fieldType.color}`}
            >
              <div className="flex flex-col items-center space-y-2">
                <fieldType.icon className="w-5 h-5" />
                <span className="text-xs font-semibold">
                  {fieldType.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionEditor;

import React, { useState } from 'react';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

const PreviewMode = ({ template, onBack, showNotification }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    template.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.required && !formData[field.id]) {
          newErrors[field.id] = 'This field is required';
        }
      });
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      showNotification('Form submitted successfully!', 'success');
      console.log('Form Data:', formData);
    }
  };

  const handleFieldChange = (fieldId, value) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: null }));
    }
  };

  const renderField = (field) => {
    const hasError = errors[field.id];

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <input
            type={field.type}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              hasError ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        );
      case 'boolean':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={field.id}
              checked={formData[field.id] || false}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor={field.id} className="text-gray-700">
              {field.label}
            </label>
          </div>
        );
      case 'enum':
        return (
          <select
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              hasError ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select an option</option>
            {Array.isArray(field.options) &&
              field.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
          </select>
        );
      case 'label':
        const Tag = field.labelStyle || 'h2';
        return (
          <Tag className="text-2xl font-bold text-gray-900 mb-4">
            {field.label}
          </Tag>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Preview: {template.name}</h1>
            <p className="text-gray-600">This is how your form will look to users</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 flex items-center space-x-2 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Editor</span>
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8"
        >
          <div className="space-y-8">
            {template.sections.map((section) => (
              <div key={section.id} className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>

                {section.fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    {field.type !== 'label' && field.type !== 'boolean' && (
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                    )}
                    {renderField(field)}
                    {errors[field.id] && (
                      <p className="text-red-500 text-sm flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors[field.id]}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Save className="w-5 h-5" />
              <span className="font-semibold">Submit Form</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreviewMode;

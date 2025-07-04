import React, { useState, useEffect } from 'react';
import { Plus, Eye, ArrowLeft, Settings, Save, Sparkles, AlertCircle, FileText } from 'lucide-react';
import { fieldTypes } from '../constants/fieldTypes';
import { validateTemplate } from '../utils/validation';
import { useNotification } from '../hooks/useNotifications';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Notification from '../components/Notifications';
import FieldTypeCard from '../components/FieldTypeCard';
import TemplateCard from '../components/TemplateCard';
import SectionEditor from '../components/SectionEditor';
import PreviewMode from '../components/PreviewMode';

const FormBuilder = () => {
  const [templates, setTemplates] = useLocalStorage('formTemplates', []);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [draggedField, setDraggedField] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedSectionIndex, setDraggedSectionIndex] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { notification, showNotification, hideNotification } = useNotification();

  const createNewTemplate = () => {
    if (templates.length >= 5) {
      showNotification('Maximum 5 templates allowed', 'error');
      return;
    }

    const newTemplate = {
      id: Date.now(),
      name: `Template ${templates.length + 1}`,
      createdAt: new Date().toISOString(),
      sections: [
        {
          id: Date.now(),
          title: 'Section 1',
          fields: []
        }
      ]
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    setCurrentTemplate(newTemplate);
    setHasUnsavedChanges(true);
    showNotification('New template created', 'success');
  };

  const duplicateTemplate = (templateId) => {
    if (templates.length >= 5) {
      showNotification('Maximum 5 templates allowed', 'error');
      return;
    }

    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const newTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      sections: template.sections.map(section => ({
        ...section,
        id: Date.now() + Math.random(),
        fields: section.fields.map(field => ({
          ...field,
          id: Date.now() + Math.random()
        }))
      }))
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    setHasUnsavedChanges(true);
    showNotification('Template duplicated', 'success');
  };

  const updateTemplate = (updatedTemplate) => {
    const updatedTemplates = templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t);
    setTemplates(updatedTemplates);
    setCurrentTemplate(updatedTemplate);
    setHasUnsavedChanges(true);
  };

  const deleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      const updatedTemplates = templates.filter(t => t.id !== templateId);
      setTemplates(updatedTemplates);
      
      if (currentTemplate?.id === templateId) {
        setCurrentTemplate(null);
      }
      
      setHasUnsavedChanges(true);
      showNotification('Template deleted', 'success');
    }
  };

  const addSection = () => {
    if (!currentTemplate) return;

    const newSection = {
      id: Date.now(),
      title: `Section ${currentTemplate.sections.length + 1}`,
      fields: []
    };

    const updatedTemplate = {
      ...currentTemplate,
      sections: [...currentTemplate.sections, newSection]
    };

    updateTemplate(updatedTemplate);
    showNotification('Section added', 'success');
  };

  const updateSection = (sectionId, updates) => {
    const updatedTemplate = {
      ...currentTemplate,
      sections: currentTemplate.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    };
    updateTemplate(updatedTemplate);
  };

  const deleteSection = (sectionId) => {
    if (currentTemplate.sections.length === 1) {
      showNotification('Cannot delete the last section', 'error');
      return;
    }

    if (window.confirm('Are you sure you want to delete this section and all its fields?')) {
      const updatedTemplate = {
        ...currentTemplate,
        sections: currentTemplate.sections.filter(section => section.id !== sectionId)
      };
      updateTemplate(updatedTemplate);
      showNotification('Section deleted', 'success');
    }
  };

  const addField = (sectionId, fieldType) => {
    const newField = {
      id: Date.now(),
      type: fieldType,
      label: `New ${fieldType}`,
      required: false,
      placeholder: '',
      options: fieldType === 'enum' ? ['Option 1', 'Option 2'] : [],
      labelStyle: fieldType === 'label' ? 'h2' : undefined
    };

    const updatedTemplate = {
      ...currentTemplate,
      sections: currentTemplate.sections.map(section =>
        section.id === sectionId ? { ...section, fields: [...section.fields, newField] } : section
      )
    };

    updateTemplate(updatedTemplate);
    showNotification('Field added', 'success');
  };

  const updateField = (sectionId, fieldId, updates) => {
    const updatedTemplate = {
      ...currentTemplate,
      sections: currentTemplate.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map(field =>
                field.id === fieldId ? { ...field, ...updates } : field
              )
            }
          : section
      )
    };
    updateTemplate(updatedTemplate);
  };

  const deleteField = (sectionId, fieldId) => {
    if (window.confirm('Are you sure you want to delete this field?')) {
      const updatedTemplate = {
        ...currentTemplate,
        sections: currentTemplate.sections.map(section =>
          section.id === sectionId ? { ...section, fields: section.fields.filter(field => field.id !== fieldId) } : section
        )
      };
      updateTemplate(updatedTemplate);
      showNotification('Field deleted', 'success');
    }
  };

  const handleDragStart = (e, fieldIndex, sectionIndex) => {
    setDraggedField(currentTemplate.sections[sectionIndex].fields[fieldIndex]);
    setDraggedIndex(fieldIndex);
    setDraggedSectionIndex(sectionIndex);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex, targetSectionIndex) => {
    e.preventDefault();
    if (draggedSectionIndex !== targetSectionIndex) return;
    
    const section = currentTemplate.sections[targetSectionIndex];
    const newFields = [...section.fields];
    newFields.splice(draggedIndex, 1);
    const adjustedTargetIndex = targetIndex > draggedIndex ? targetIndex - 1 : targetIndex;
    newFields.splice(adjustedTargetIndex, 0, draggedField);
    
    const updatedTemplate = {
      ...currentTemplate,
      sections: currentTemplate.sections.map((s, index) =>
        index === targetSectionIndex ? { ...s, fields: newFields } : s
      )
    };
    
    updateTemplate(updatedTemplate);
    setDraggedField(null);
    setDraggedIndex(null);
    setDraggedSectionIndex(null);
  };

  const handleSave = async () => {
    if (!hasUnsavedChanges) {
      showNotification('No changes to save', 'info');
      return;
    }

    setIsLoading(true);
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));
    showNotification('Templates saved successfully!', 'success');
    setHasUnsavedChanges(false);
    setIsLoading(false);
  };

  if (previewMode && currentTemplate) {
    return (
      <>
        <Notification notification={notification} onClose={hideNotification} />
        <PreviewMode 
          template={currentTemplate} 
          onBack={() => setPreviewMode(false)}
          showNotification={showNotification}
        />
      </>
    );
  }

  return (
    <>
      <Notification notification={notification} onClose={hideNotification} />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Form Builder
                  </h1>
                  <p className="text-gray-600 text-lg">Create stunning forms with our drag-and-drop builder</p>
                </div>
              </div>
              
              {hasUnsavedChanges && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-orange-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Unsaved changes</span>
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span className="font-semibold">Save All</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {!currentTemplate ? (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Templates</h2>
                  <p className="text-gray-600">Manage and organize your form templates ({templates.length}/5)</p>
                </div>
                <button
                  onClick={createNewTemplate}
                  disabled={templates.length >= 5}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-semibold">Create New Template</span>
                </button>
              </div>

              {templates.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No templates yet</h3>
                  <p className="text-gray-500 mb-6">Create your first form template to get started</p>
                  <button
                    onClick={createNewTemplate}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 flex items-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-semibold">Create Your First Template</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onEdit={setCurrentTemplate}
                      onDelete={deleteTemplate}
                      onDuplicate={duplicateTemplate}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Field Types</span>
                  </h3>
                  <div className="space-y-3">
                    {fieldTypes.map((fieldType) => (
                      <FieldTypeCard
                        key={fieldType.type}
                        fieldType={fieldType}
                        onClick={() => {
                          if (currentTemplate.sections.length > 0) {
                            addField(currentTemplate.sections[0].id, fieldType.type);
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        value={currentTemplate.name}
                        onChange={(e) => updateTemplate({ ...currentTemplate, name: e.target.value })}
                        className="text-3xl font-bold border-2 border-transparent bg-transparent focus:border-blue-500 focus:bg-gray-50 focus:outline-none rounded-lg px-3 py-2 transition-all duration-200"
                        placeholder="Template Name"
                      />
                      {currentTemplate.name.trim() === '' && (
                        <div className="flex items-center space-x-2 text-red-500">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">Name required</span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setPreviewMode(true)}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <Eye className="w-5 h-5" />
                        <span className="font-semibold">Preview</span>
                      </button>
                      <button
                        onClick={() => setCurrentTemplate(null)}
                        className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold">Back</span>
                      </button>
                    </div>
                  </div>

                  {currentTemplate && (
                    <>
                      {(() => {
                        const validationErrors = validateTemplate(currentTemplate);
                        return validationErrors.length > 0 && (
                          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <AlertCircle className="w-5 h-5 text-red-600" />
                              <h4 className="font-semibold text-red-800">Template Issues:</h4>
                            </div>
                            <ul className="text-sm text-red-700 space-y-1">
                              {validationErrors.map((error, index) => (
                                <li key={index}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      })()}
                    </>
                  )}

                  <div className="space-y-8">
                    {currentTemplate.sections.map((section, sectionIndex) => (
                      <SectionEditor
                        key={section.id}
                        section={section}
                        sectionIndex={sectionIndex}
                        onUpdate={updateSection}
                        onDelete={deleteSection}
                        onAddField={addField}
                        onUpdateField={updateField}
                        onDeleteField={deleteField}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        showNotification={showNotification}
                      />
                    ))}
                  </div>

                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={addSection}
                      className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 flex items-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-5 h-5" />
                      <span className="font-semibold">Add New Section</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FormBuilder;
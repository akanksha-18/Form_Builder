import React, { useState, useEffect } from 'react';
import { Plus, Eye, ArrowLeft, Settings, Trash2, Edit3, Copy, Save, FileText, Layers, Type, Hash, ToggleLeft, List, Sparkles } from 'lucide-react';
import FieldTypeCard from '../components/FieldTypeCard/FieldTypeCard';
import SectionEditor from '../components/SectionEditor/SectionEditor';
import TemplateCard from '../components/TemplateCard/TemplateCard';


const FormBuilder = () => {
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [draggedField, setDraggedField] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedSectionIndex, setDraggedSectionIndex] = useState(null);


  const fieldTypes = [
    { 
      type: 'text', 
      icon: Type, 
      name: 'Text Input', 
      color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      description: 'Single line text'
    },
    { 
      type: 'number', 
      icon: Hash, 
      name: 'Number', 
      color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
      description: 'Numeric input'
    },
    { 
      type: 'boolean', 
      icon: ToggleLeft, 
      name: 'Toggle', 
      color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
      description: 'True/False switch'
    },
    { 
      type: 'enum', 
      icon: List, 
      name: 'Options', 
      color: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
      description: 'Multiple choices'
    },
    { 
      type: 'label', 
      icon: FileText, 
      name: 'Label', 
      color: 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100',
      description: 'Display text'
    },
  ];

  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem('formTemplates') || '[]');
    setTemplates(savedTemplates);
  }, []);

  useEffect(() => {
    localStorage.setItem('formTemplates', JSON.stringify(templates));
  }, [templates]);

  const createNewTemplate = () => {
    if (templates.length >= 5) {
      alert('Maximum 5 templates allowed');
      return;
    }
    const newTemplate = {
      id: Date.now(),
      name: `Template ${templates.length + 1}`,
      sections: [
        {
          id: Date.now(),
          title: 'Section 1',
          fields: []
        }
      ]
    };
    setTemplates([...templates, newTemplate]);
    setCurrentTemplate(newTemplate);
  };


  const duplicateTemplate = (templateId) => {
  if (templates.length >= 5) {
    alert('You have reached the maximum limit of 5 templates. Cannot duplicate.');
    return;
  }

  const template = templates.find(t => t.id === templateId);
  if (!template) return;

  const newTemplate = {
    ...template,
    id: Date.now(),
    name: `${template.name} (Copy)`,
    sections: template.sections.map(section => ({
      ...section,
      id: Date.now() + Math.random(),
      fields: section.fields.map(field => ({
        ...field,
        id: Date.now() + Math.random()
      }))
    }))
  };

  setTemplates([...templates, newTemplate]);
};

  const updateTemplate = (updatedTemplate) => {
    setTemplates(templates.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
    setCurrentTemplate(updatedTemplate);
  };

  const deleteTemplate = (templateId) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    if (currentTemplate?.id === templateId) {
      setCurrentTemplate(null);
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
    const updatedTemplate = {
      ...currentTemplate,
      sections: currentTemplate.sections.filter(section => section.id !== sectionId)
    };
    updateTemplate(updatedTemplate);
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
    const updatedTemplate = {
      ...currentTemplate,
      sections: currentTemplate.sections.map(section =>
        section.id === sectionId ? { ...section, fields: section.fields.filter(field => field.id !== fieldId) } : section
      )
    };
    updateTemplate(updatedTemplate);
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
if (previewMode && currentTemplate) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
      
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
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
                    onEdit={() => setCurrentTemplate(template)}
                    onDelete={() => deleteTemplate(template.id)}
                    onDuplicate={() => duplicateTemplate(template.id)}
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
                      onClick={() => addField(currentTemplate.sections[0].id, fieldType.type)}
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
                  
                  </div>
                  <div className="flex space-x-3">
                   
                    <button
                      onClick={() => setCurrentTemplate(null)}
                      className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span className="font-semibold">Back</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-8">
                  {currentTemplate.sections.map((section, sectionIndex) => (
                    <SectionEditor
                      key={section.id}
                      section={section}
                      sectionIndex={sectionIndex}
                      fieldTypes={fieldTypes}
                      addField={addField}
                      updateSection={updateSection}
                      deleteSection={deleteSection}
                      updateField={updateField}
                      deleteField={deleteField}
                      handleDragStart={handleDragStart}
                      handleDragOver={handleDragOver}
                      handleDrop={handleDrop}
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
  );
};

export default FormBuilder;
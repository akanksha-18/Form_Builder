 import React from 'react';
import { FileText,Layers,Type , Edit3,Copy,Trash2} from 'lucide-react';


 const TemplateCard = ({ template, onEdit, onDelete, onDuplicate }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{template.name}</h3>
          <p className="text-gray-600 text-sm">
            {template.sections.length} section{template.sections.length !== 1 ? 's' : ''} • {' '}
            {template.sections.reduce((acc, section) => acc + section.fields.length, 0)} field{template.sections.reduce((acc, section) => acc + section.fields.length, 0) !== 1 ? 's' : ''}
          </p>
          {template.createdAt && (
            <p className="text-gray-500 text-xs mt-1">
              Created: {new Date(template.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onDuplicate(template.id)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(template.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">Sections:</div>
        <div className="space-y-1">
          {template.sections.map((section, index) => (
            <div key={section.id} className="text-sm bg-gray-50 px-2 py-1 rounded">
              {section.title} ({section.fields.length} field{section.fields.length !== 1 ? 's' : ''})
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={() => onEdit(template)}
        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 flex items-center justify-center space-x-2 transition-all duration-200"
      >
        <Edit3 className="w-4 h-4" />
        <span>Edit Template</span>
      </button>
    </div>
  );
  export default TemplateCard;
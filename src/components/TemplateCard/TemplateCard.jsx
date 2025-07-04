
import React from 'react';
import { FileText,Layers,Type , Edit3,Copy,Trash2} from 'lucide-react';


const TemplateCard = ({ template, onEdit, onDelete, onDuplicate }) => {
  const fieldCount = template.sections.reduce((acc, section) => acc + section.fields.length, 0);
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
          <p className="text-gray-600 text-sm">
            {template.sections.length} section{template.sections.length !== 1 ? 's' : ''} • {fieldCount} field{fieldCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onDuplicate}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <Edit3 className="w-4 h-4" />
        <span>Edit Template</span>
      </button>
    </div>
  );
};
export default TemplateCard;
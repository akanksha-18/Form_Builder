import { Type, Hash, ToggleLeft, List, FileText } from 'lucide-react';

export const fieldTypes = [
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
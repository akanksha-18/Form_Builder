import React from 'react';

const FieldTypeCard = ({ fieldType, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${fieldType.color}`}
  >
    <div className="flex items-center space-x-3">
      <fieldType.icon className="w-5 h-5" />
      <div>
        <div className="font-semibold">{fieldType.name}</div>
        <div className="text-sm opacity-75">{fieldType.description}</div>
      </div>
    </div>
  </div>
);

export default FieldTypeCard;
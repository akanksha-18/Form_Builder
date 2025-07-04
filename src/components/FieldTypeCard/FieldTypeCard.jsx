

const FieldTypeCard = ({ fieldType, onClick }) => {
  const IconComponent = fieldType.icon;
  
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${fieldType.color}`}
    >
      <div className="flex items-center space-x-3">
        <IconComponent className="w-5 h-5" />
        <div>
          <div className="font-semibold">{fieldType.name}</div>
          <div className="text-sm opacity-75">{fieldType.description}</div>
        </div>
      </div>
    </div>
  );
};
export default FieldTypeCard;
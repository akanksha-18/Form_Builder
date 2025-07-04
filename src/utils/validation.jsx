export const validateTemplate = (template) => {
  const errors = [];
  
  if (!template.name.trim()) {
    errors.push('Template name is required');
  }
  
  if (template.sections.length === 0) {
    errors.push('At least one section is required');
  }
  
  template.sections.forEach((section, sectionIndex) => {
    if (!section.title.trim()) {
      errors.push(`Section ${sectionIndex + 1} needs a title`);
    }
    
    section.fields.forEach((field, fieldIndex) => {
      if (!field.label.trim()) {
        errors.push(`Field ${fieldIndex + 1} in section ${sectionIndex + 1} needs a label`);
      }
      
      if (field.type === 'enum' && field.options.length === 0) {
        errors.push(`Options field in section ${sectionIndex + 1} needs at least one option`);
      }
    });
  });
  
  return errors;
};
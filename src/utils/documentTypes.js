// Document type mapping for verification
export const DOCUMENT_TYPES = [
  { value: "student_id_card", label: "Student ID Card" },
  { value: "admission_letter", label: "Admission Letter" },
  { value: "school_id_card", label: "School ID Card" },
  { value: "matriculation_certificate", label: "Matriculation Certificate" },
  { value: "student_handbook_with_id", label: "Student Handbook with ID" }
];

// Helper function to get document type label from value
export const getDocumentTypeLabel = (value) => {
  const documentType = DOCUMENT_TYPES.find(type => type.value === value);
  return documentType ? documentType.label : value;
};

// Helper function to get document type value from label (for backward compatibility)
export const getDocumentTypeValue = (label) => {
  const documentType = DOCUMENT_TYPES.find(type => type.label === label);
  return documentType ? documentType.value : label;
};
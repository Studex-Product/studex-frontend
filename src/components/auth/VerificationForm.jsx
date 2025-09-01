import { useState } from "react";
import DragDropFileUpload from "./DragDropFileUpload";
import { ArrowLeft } from "lucide-react";

const VerificationForm = ({ onSubmit, onPrevious }) => {
  const [documentType, setDocumentType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      documentType,
      selectedFile: selectedFile?.name,
    });
  };

  const isFormValid = documentType && selectedFile;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <h3 className="text-[var(--primary)] font-semibold text-lg">
          Student Verification
        </h3>
        <p className="font-medium text-ring text-base mb-0">
          Upload a valid document that confirms you're a student. We accept:
        </p>
        <ul className="text-muted-foreground">
          <li>- Your current student ID card</li>
          <li>- Your admission letter</li>
        </ul>

        {/* Document Type Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-secondary-foreground text-sm font-medium">
            Document Type
          </label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-muted-foreground mb-5"
          >
            <option value="" disabled>
              Select document type
            </option>
            <option value="student-id">Student ID</option>
            <option value="admission-letter">Admission Letter</option>
          </select>
        </div>

        {/* File Upload */}
        <DragDropFileUpload
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
        />

        {/* Action Buttons */}
        <div className="flex gap-4 flex-col md:flex-row justify-between mt-12">
          <button
            type="button"
            onClick={onPrevious}
            className="md:w-[30%] flex gap-2 items-center justify-center lg:justify-around px-5 py-3 rounded-lg w-full font-semibold text-base text-chart-4 bg-purple-200 cursor-pointer hover:opacity-60"
          >
            <ArrowLeft /> Previous
          </button>
          <button
            type="submit"
            className={`w-full bg-[#9046CF]  text-white py-3 px-4 rounded-lg font-medium focus:outline-none transition-colors ${
              !isFormValid
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-purple-700 cursor-pointer'
            }`}
            disabled={!isFormValid}
          >
            Continue
          </button>
        </div>
      </div>
    </form>
  );
};

export default VerificationForm;

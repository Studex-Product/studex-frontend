import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/api/adminService";
import DragDropFileUpload from "./DragDropFileUpload";

const VerificationForm = ({ onSubmit, onSkip, email, isSubmitting, error }) => {
  // Fetch active campuses for assignment
  const {
    data: campuses = [],
    isLoading: campusesLoading,
    error: campusesError,
  } = useQuery({
    queryKey: ["activeCampuses"],
    queryFn: () => adminService.getCampuses(),
    select: (data) => {
      // Handle different response structures
      if (Array.isArray(data)) {
        return data;
      }
      return data.items || data.campuses || data.data || [];
    },
  });

  const [selectedCampus, setSelectedCampus] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, selectedCampus, documentType, selectedFile });
    onSubmit({
      email,
      campus: selectedCampus,
      documentType,
      selectedFile: selectedFile?.name,
    });
  };

  const isFormValid = selectedCampus && documentType && selectedFile;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <h3 className="text-[var(--primary)] font-semibold text-lg">
          Student Verification
        </h3>
        <p className="font-medium text-ring text-base mb-0">
          Select your campus and upload a valid document that confirms you're a
          student. We accept:
        </p>
        <ul className="text-muted-foreground">
          <li>- Your current student ID card</li>
          <li>- Your admission letter</li>
          <li>- School ID card</li>
          <li>- Matriculation certificate</li>
        </ul>

        {/* Campus Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-secondary-foreground text-sm font-medium">
            Campus/Institution
          </label>
          {campusesLoading ? (
            <div className="w-full px-3 py-3 border rounded-lg bg-gray-50 text-muted-foreground">
              Loading campuses...
            </div>
          ) : campusesError ? (
            <div className="w-full px-3 py-3 border border-red-300 rounded-lg bg-red-50 text-red-600">
              Error loading campuses. Please refresh the page.
            </div>
          ) : (
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-muted-foreground mb-3"
            >
              <option value="" disabled>
                Select your campus
              </option>
              {campuses.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
          )}
        </div>

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
            <option value="student-id">Student ID Card</option>
            <option value="admission-letter">Admission Letter</option>
            <option value="school-id">School ID Card</option>
            <option value="matriculation-cert">
              Matriculation Certificate
            </option>
            <option value="student-handbook">Student Handbook with ID</option>
          </select>
        </div>

        {/* File Upload */}
        <DragDropFileUpload
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
        />

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 flex-col md:flex-row justify-between mt-12">
          <button
            type="button"
            onClick={onSkip}
            className="md:w-[30%] flex gap-2 items-center justify-center lg:justify-around px-5 py-3 rounded-lg w-full font-semibold text-base text-chart-4 bg-purple-200 cursor-pointer hover:opacity-60"
          >
            Skip
          </button>
          <button
            type="submit"
            className={`w-full bg-[#9046CF]  text-white py-3 px-4 rounded-lg font-medium focus:outline-none transition-colors ${
              !isFormValid || isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-purple-700 cursor-pointer"
            }`}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Continue"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default VerificationForm;

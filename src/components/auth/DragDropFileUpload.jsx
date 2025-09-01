import { useFileUpload } from "../../hooks/useFileUpload";
import { Trash2, File } from "lucide-react";

const DragDropFileUpload = ({ onFileSelect, selectedFile: externalFile }) => {
  const {
    selectedFile,
    isDragOver,
    fileError,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeFile,
  } = useFileUpload();

  const currentFile = externalFile || selectedFile;

  const handleInternalFileSelect = (file) => {
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-secondary-foreground text-sm font-medium">
        Upload File
      </label>
      <div
        className={`relative border-2 rounded-lg p-6 text-center transition-colors cursor-pointer ${
          fileError
            ? "border-red-500 bg-red-50"
            : isDragOver
            ? "border-purple-500 bg-purple-50"
            : currentFile
            ? "bg-white border-green-500"
            : "border-gray-100 hover:border-purple-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => {
          handleDrop(e);
          const file = e.dataTransfer.files[0];
          handleInternalFileSelect(file);
        }}
        onClick={() => document.getElementById("file-input").click()}
      >
        <input
          id="file-input"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => {
            handleFileChange(e);
            handleInternalFileSelect(e.target.files[0]);
          }}
          className="hidden"
        />

        {currentFile ? (
          <div className="flex w-full gap-2">
            <div className="md:w-12 md:h-12 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
              <File className="md:w-4 md:h-4 font-bold text-purple-600" />
            </div>
            <div className="w-full ">
              <div className="w-full">
                <p className="font-semibold  text-left flex items-center justify-between">
                  {currentFile.name}{" "}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                      handleInternalFileSelect(null);
                    }}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm transition-colors duration-200 px-2 py-1 rounded-full"
                    title="Remove file"
                  >
                    <Trash2 size={16} />
                  </button>
                </p>
                <p className="text-gray-500 text-left">
                  {(currentFile.size / 1024 / 1024).toFixed(2)} MB (2MB max)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-700">
                {isDragOver
                  ? "Click to upload or drag and drop"
                  : "Drag & drop your file here"}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                JPG, PNG, or PDF (max. 2MB)
              </p>
            </div>
          </div>
        )}
      </div>
      
      {fileError && (
        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {fileError}
        </p>
      )}
    </div>
  );
};

export default DragDropFileUpload;

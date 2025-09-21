const ProgressBar = ({ currentStep, totalSteps }) => {
  const progress = (currentStep / totalSteps) * 50;

  return (
    <div className="">
      <div className="flex justify-between text-gray-600">
        <span>Step {currentStep} of {totalSteps}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full">
        <div
          className="bg-chart-4 h-1 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
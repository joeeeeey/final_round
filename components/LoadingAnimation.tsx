export default function LoadingAnimation() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border shadow-sm p-8">
      <div className="text-center space-y-6">
        {/* Main loading animation */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-purple-500 animate-spin animation-delay-150"></div>
        </div>

        {/* Status text */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            🤖 AI Analysis in Progress
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Our AI is analyzing the interview transcript and generating insights...
          </p>
        </div>

        {/* Progress steps */}
        <div className="space-y-3 max-w-md mx-auto">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 dark:text-gray-300">Processing transcript</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-300"></div>
            <span className="text-gray-700 dark:text-gray-300">Extracting key insights</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-500"></div>
            <span className="text-gray-700 dark:text-gray-300">Generating timeline analysis</span>
          </div>
        </div>

        {/* Fun fact */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            💡 <strong>Did you know?</strong> Our AI can identify communication patterns, 
            technical depth, and candidate confidence levels from interview responses.
          </p>
        </div>
      </div>
    </div>
  );
}

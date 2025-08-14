import { MockTranscriptOption } from "@/types/interview";

interface MockDataSelectorProps {
  options: MockTranscriptOption[];
  onSelect: (key: MockTranscriptOption['key']) => void;
  selectedKey?: MockTranscriptOption['key'] | null;
}

export default function MockDataSelector({ 
  options, 
  onSelect, 
  selectedKey 
}: MockDataSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Choose Sample Interview
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => onSelect(option.key)}
            className={`
              p-4 rounded-lg border-2 text-left transition-all hover:shadow-md
              ${selectedKey === option.key 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }
            `}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  {option.title}
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {option.duration}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {option.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>👤 {option.role}</span>
                <span>💬 {option.questionCount} questions</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

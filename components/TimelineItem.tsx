import { AnalysisItem, TimelineItem as TimelineItemType } from "@/types/interview";

interface TimelineItemProps {
  item: AnalysisItem | TimelineItemType;
  isLast?: boolean;
}

export default function TimelineItem({ item, isLast = false }: TimelineItemProps) {
  // Determine the color theme based on the presence of highlights/lowlights
  const getThemeColor = () => {
    if (item.highlight && !item.lowlight) return "green"; // Positive
    if (item.lowlight && !item.highlight) return "red";   // Negative
    if (item.highlight && item.lowlight) return "yellow"; // Mixed
    return "blue"; // Neutral
  };

  const themeColor = getThemeColor();

  const colorClasses = {
    green: {
      node: "bg-gradient-to-br from-green-400 to-green-600 ring-green-100 dark:ring-green-900",
      card: "border-l-green-500 bg-green-50 dark:bg-green-900/20",
      icon: "🟢"
    },
    red: {
      node: "bg-gradient-to-br from-red-400 to-red-600 ring-red-100 dark:ring-red-900",
      card: "border-l-red-500 bg-red-50 dark:bg-red-900/20",
      icon: "🔴"
    },
    yellow: {
      node: "bg-gradient-to-br from-yellow-400 to-orange-500 ring-yellow-100 dark:ring-yellow-900",
      card: "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
      icon: "🟡"
    },
    blue: {
      node: "bg-gradient-to-br from-blue-400 to-blue-600 ring-blue-100 dark:ring-blue-900",
      card: "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20",
      icon: "🔵"
    }
  };

  const colors = colorClasses[themeColor];

  return (
    <li className={`relative pl-8 ${isLast ? 'pb-0' : 'pb-8'}`}>
      {/* Timeline node */}
      <div className={`absolute -left-2 top-3 h-4 w-4 rounded-full ${colors.node} ring-4 flex items-center justify-center`}>
        <div className="text-[8px]">{colors.icon}</div>
      </div>
      
      {/* Card content */}
      <div className={`bg-white dark:bg-slate-700 rounded-lg border-l-4 ${colors.card} p-4 shadow-sm hover:shadow-md transition-shadow`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-mono rounded">
              {item.timestamp}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
          {item.key_name_entity}
        </h3>

        {/* Content sections */}
        <div className="space-y-3">
          {/* Highlights */}
          {item.highlight && (
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 font-semibold text-sm">✨ Highlight:</span>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200 mt-1 leading-relaxed">
                {item.highlight}
              </p>
            </div>
          )}

          {/* Lowlights */}
          {item.lowlight && (
            <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-400 font-semibold text-sm">⚠️ Area for Improvement:</span>
              </div>
              <p className="text-sm text-red-800 dark:text-red-200 mt-1 leading-relaxed">
                {item.lowlight}
              </p>
            </div>
          )}

          {/* Summary */}
          <div className="bg-gray-50 dark:bg-slate-600 rounded-lg p-3">
            <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm">📝 Summary:</span>
            <p className="text-sm text-gray-800 dark:text-gray-200 mt-1 leading-relaxed">
              {item.summary}
            </p>
          </div>

          {/* References */}
          {"timestamp_ref" in item && item.timestamp_ref?.length > 0 && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                🔗 References:
              </span>
              <div className="flex flex-wrap gap-1">
                {item.timestamp_ref.map((ref, index) => (
                  <span 
                    key={index}
                    className="px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 text-xs rounded"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}



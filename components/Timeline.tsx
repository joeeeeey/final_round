import { AnalysisItem, TimelineItem as TimelineItemType, QAItem } from "@/types/interview";
import TimelineItem from "@/components/TimelineItem";

interface TimelineProps {
  items: AnalysisItem[] | TimelineItemType[];
  qaLookup?: Record<string, QAItem>;
}

export default function Timeline({ items, qaLookup }: TimelineProps) {
  if (!items?.length) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">⏱️</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">No timeline analysis yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-slate-800 rounded-xl border shadow-lg p-6 hover-lift">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl">
          📈
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Interview Timeline
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Chronological analysis of key moments
          </p>
        </div>
      </div>

      <ol className="relative border-l-2 border-gradient-to-b from-purple-300 to-pink-300 dark:from-purple-700 dark:to-pink-700 border-dashed ml-6">
        {items.map((item, index) => (
          <TimelineItem 
            key={`${item.timestamp}-${item.key_name_entity}`} 
            item={item} 
            isLast={index === items.length - 1}
            qaLookup={qaLookup}
          />
        ))}
      </ol>
    </div>
  );
}



import { AnalysisItem, TimelineItem as TimelineItemType } from "@/types/interview";
import TimelineItem from "@/components/TimelineItem";

interface TimelineProps {
  items: AnalysisItem[] | TimelineItemType[];
}

export default function Timeline({ items }: TimelineProps) {
  if (!items?.length) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">No analysis yet.</div>
    );
  }

  return (
    <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-2">
      {items.map((item) => (
        <TimelineItem key={`${item.timestamp}-${item.key_name_entity}`} item={item} />
      ))}
    </ol>
  );
}



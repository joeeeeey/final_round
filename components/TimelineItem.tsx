import { AnalysisItem, TimelineItem as TimelineItemType } from "@/types/interview";

interface TimelineItemProps {
  item: AnalysisItem | TimelineItemType;
}

export default function TimelineItem({ item }: TimelineItemProps) {
  return (
    <li className="relative pl-6 pb-8 last:pb-0">
      <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-900" />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {item.timestamp}
          </span>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {item.key_name_entity}
          </h3>
        </div>
        <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
          {item.highlight && (
            <p className="">
              <span className="font-semibold text-green-700 dark:text-green-400">Highlight:</span>{" "}
              {item.highlight}
            </p>
          )}
          {item.lowlight && (
            <p className="">
              <span className="font-semibold text-red-700 dark:text-red-400">Lowlight:</span>{" "}
              {item.lowlight}
            </p>
          )}
          <p className="">
            <span className="font-semibold">Summary:</span> {item.summary}
          </p>
          {"timestamp_ref" in item && item.timestamp_ref?.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-semibold">References:</span> {item.timestamp_ref.join(", ")}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}



interface OverallSummaryProps {
  summary: string;
}

export default function OverallSummary({ summary }: OverallSummaryProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
        Overall Summary
      </h3>
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {summary || "No summary available"}
      </div>
    </div>
  );
}

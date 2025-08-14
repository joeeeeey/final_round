import { BasicInformation as BasicInfoType } from "@/types/interview";

interface BasicInformationProps {
  basicInfo: BasicInfoType;
}

export default function BasicInformation({ basicInfo }: BasicInformationProps) {
  const infoItems = [
    { label: "Name", value: basicInfo.name },
    { label: "Graduated School", value: basicInfo.graduated_school },
    { label: "Working Years", value: basicInfo.working_years },
    { label: "Tech Stack", value: basicInfo.tech_stack },
    { label: "Other Information", value: basicInfo.other_information },
  ];

  // Filter out empty or "Not mentioned" values for cleaner display
  const validItems = infoItems.filter(
    item => item.value && item.value !== "Not mentioned" && item.value.trim() !== ""
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
        Basic Information
      </h3>
      <div className="space-y-2">
        {validItems.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[120px]">
              {item.label}:
            </span>
            <span className="text-sm text-gray-900 dark:text-gray-100">
              {item.value}
            </span>
          </div>
        ))}
        {validItems.length === 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No basic information available
          </div>
        )}
      </div>
    </div>
  );
}

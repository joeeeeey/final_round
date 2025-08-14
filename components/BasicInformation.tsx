import { BasicInformation as BasicInfoType } from "@/types/interview";

interface BasicInformationProps {
  basicInfo: BasicInfoType;
}

export default function BasicInformation({ basicInfo }: BasicInformationProps) {
  // Parse tech stack into individual tags
  const techTags = basicInfo.tech_stack 
    ? basicInfo.tech_stack.split(',').map(tech => tech.trim()).filter(Boolean)
    : [];

  const infoItems = [
    { 
      label: "Name", 
      value: basicInfo.name,
      icon: "👤",
      display: "highlight"
    },
    { 
      label: "Education", 
      value: basicInfo.graduated_school,
      icon: "🎓",
      display: "normal"
    },
    { 
      label: "Experience", 
      value: basicInfo.working_years,
      icon: "💼",
      display: "badge"
    },
    { 
      label: "Other Info", 
      value: basicInfo.other_information,
      icon: "ℹ️",
      display: "normal"
    },
  ];

  // Filter out empty or "Not mentioned" values
  const validItems = infoItems.filter(
    item => item.value && item.value !== "Not mentioned" && item.value.trim() !== ""
  );

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-800 rounded-xl border shadow-lg p-6 hover-lift">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {basicInfo.name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Candidate Profile
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Basic information and background
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Main candidate name */}
        {basicInfo.name && basicInfo.name !== "Not mentioned" && (
          <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-2">
              <span className="text-xl">👤</span>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {basicInfo.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
              </div>
            </div>
          </div>
        )}

        {/* Tech Stack Tags */}
        {techTags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛠️</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tech Stack
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {techTags.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full border"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Other Information Items */}
        {validItems.filter(item => item.label !== "Name").map((item, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-slate-700/50 rounded-lg">
            <span className="text-lg mt-0.5">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {item.label}
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {item.value}
              </p>
            </div>
          </div>
        ))}

        {validItems.length === 0 && (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No candidate information available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface OverallSummaryProps {
  summary: string;
}

interface ScoreMetric {
  name: string;
  score: number;
  icon: string;
  color: string;
}

export default function OverallSummary({ summary }: OverallSummaryProps) {
  // Extract key metrics from summary text (simple keyword analysis)
  const extractScores = (text: string): ScoreMetric[] => {
    const metrics = [
      { 
        name: "Technical Skills", 
        icon: "⚙️", 
        color: "from-blue-500 to-cyan-500",
        keywords: ["technical", "technology", "solution", "implementation", "problem-solving"]
      },
      { 
        name: "Communication", 
        icon: "💬", 
        color: "from-green-500 to-emerald-500",
        keywords: ["articulated", "explained", "communication", "clear", "described"]
      },
      { 
        name: "Experience", 
        icon: "📈", 
        color: "from-purple-500 to-violet-500",
        keywords: ["experience", "years", "background", "worked", "previous"]
      },
      { 
        name: "Problem Solving", 
        icon: "🧩", 
        color: "from-orange-500 to-amber-500",
        keywords: ["problem", "challenge", "solved", "solution", "approach"]
      }
    ];

    return metrics.map(metric => {
      const lowerText = text.toLowerCase();
      const matchCount = metric.keywords.reduce((count, keyword) => {
        return count + (lowerText.includes(keyword) ? 1 : 0);
      }, 0);
      
      // Convert match count to score (0-100), with some randomization for demo
      const baseScore = Math.min(matchCount * 20, 80);
      const finalScore = Math.min(baseScore + Math.floor(Math.random() * 20), 95);
      
      return {
        name: metric.name,
        score: finalScore,
        icon: metric.icon,
        color: metric.color
      };
    });
  };

  const scores = extractScores(summary);
  const averageScore = scores.reduce((sum, metric) => sum + metric.score, 0) / scores.length;

  // Extract key sentiment words
  const extractKeywords = (text: string): string[] => {
    const positiveWords = [
      "strong", "excellent", "solid", "clear", "good", "effective", 
      "skilled", "experienced", "successful", "demonstrated", "detailed"
    ];
    
    const words = text.toLowerCase().split(/\s+/);
    return positiveWords.filter(word => 
      words.some(w => w.includes(word))
    ).slice(0, 4);
  };

  const keywords = extractKeywords(summary);

  return (
    <div className="bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-slate-800 rounded-xl border shadow-lg p-6 hover-lift">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl">
          📊
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Overall Assessment
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI-powered candidate evaluation
          </p>
        </div>
      </div>



      {/* Key Strengths */}
      {keywords.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            🌟 Key Strengths
          </h4>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full border"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Summary Text */}
      <div className="bg-white dark:bg-slate-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          📝 Detailed Assessment
        </h4>
        <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {summary || "No summary available"}
        </div>
      </div>
    </div>
  );
}

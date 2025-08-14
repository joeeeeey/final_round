"use client";

import { useMemo, useState } from "react";
import { mockTranscript } from "@/data/mock-transcript";
import { mockAnalysis } from "@/data/mock-analysis";
import { AnalysisItem, AnalysisResult, QAItem } from "@/types/interview";
import Timeline from "@/components/Timeline";
import BasicInformation from "@/components/BasicInformation";
import OverallSummary from "@/components/OverallSummary";

export default function Home() {
  const [qaInput, setQaInput] = useState<QAItem[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qaPreview = useMemo(() => JSON.stringify(qaInput, null, 2), [qaInput]);

  function handleUseMock() {
    setQaInput(mockTranscript);
    setError(null);
  }

  async function handleAnalyzeLLM() {
    try {
      setIsLoading(true);
      setError(null);
      setAnalysis([]);
      setAnalysisResult(null);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(qaInput),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Request failed: ${res.status}`);
      }
      const data = (await res.json()) as AnalysisResult;
      setAnalysisResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-6 sm:p-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold mb-4">Interview Summary Prototype</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Load a mock QA transcript and analyze it to view a timeline of highlights, lowlights, and summaries.
        </p>

        <div className="flex flex-col gap-6">
          <div className="flex gap-3">
            <button
              onClick={handleUseMock}
              className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
            >
              Use Mock Data
            </button>
            <button
              onClick={handleAnalyzeLLM}
              disabled={!qaInput.length || isLoading}
              className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50"
            >
              Analyze (LLM)
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">QA Input</h2>
              <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded-md overflow-auto max-h-96">
                {qaPreview}
              </pre>
            </div>

            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
              
              {isLoading && (
                <div className="text-sm text-gray-500">Analyzing...</div>
              )}
              
              {error && (
                <div className="text-sm text-red-600 mb-4">{error}</div>
              )}

              {/* New Analysis Result Display */}
              {analysisResult && (
                <div className="space-y-6">
                  <BasicInformation basicInfo={analysisResult.basic_information} />
                  <OverallSummary summary={analysisResult.overall_summary} />
                  <div>
                    <h3 className="text-md font-semibold mb-3">Interview Timeline</h3>
                    <Timeline items={analysisResult.timeline} />
                  </div>
                </div>
              )}

              {/* Legacy Analysis Display (for mock) */}
              {!analysisResult && analysis.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold mb-3">Analysis Timeline (Mock)</h3>
                  <Timeline items={analysis} />
                </div>
              )}

              {!analysisResult && !analysis.length && !isLoading && !error && (
                <div className="text-sm text-gray-500">No analysis yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

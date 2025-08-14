"use client";

import { useMemo, useState } from "react";
import { mockTranscriptData, mockTranscriptOptions } from "@/data/mock-transcript";
import { mockAnalysis } from "@/data/mock-analysis";
import { AnalysisItem, AnalysisResult, QAItem, MockTranscriptOption } from "@/types/interview";
import Timeline from "@/components/Timeline";
import BasicInformation from "@/components/BasicInformation";
import OverallSummary from "@/components/OverallSummary";
import MockDataSelector from "@/components/MockDataSelector";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function Home() {
  const [qaInput, setQaInput] = useState<QAItem[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMockKey, setSelectedMockKey] = useState<MockTranscriptOption['key'] | null>(null);

  const qaPreview = useMemo(() => JSON.stringify(qaInput, null, 2), [qaInput]);
  
  // Check if we have any analysis results for dynamic height
  const hasAnalysisResults = Boolean(analysisResult || analysis.length > 0);

  function handleMockSelection(key: MockTranscriptOption['key']) {
    const selectedData = mockTranscriptData[key];
    setQaInput(selectedData);
    setSelectedMockKey(key);
    setAnalysisResult(null);
    setAnalysis([]);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Interview Insights
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Transform interview transcripts into actionable candidate assessments
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              Leverage AI to analyze interview conversations, extract key insights, and make data-driven hiring decisions.
            </p>
          </div>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center space-y-2">
              <div className="text-2xl">🧠</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Smart Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered evaluation of candidate responses</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl">📊</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Structured Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Organized timeline with highlights and lowlights</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl">⚡</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Instant Results</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get comprehensive analysis in seconds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl p-6 sm:p-10">

        <div className="space-y-8">
          {/* Try Sample Analysis Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border shadow-sm p-6">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Try Sample Analysis
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a sample interview to see AI Interview Insights in action
                </p>
              </div>
              
              <MockDataSelector
                options={mockTranscriptOptions}
                onSelect={handleMockSelection}
                selectedKey={selectedMockKey}
              />
              
              {qaInput.length > 0 && (
                <div className="pt-4 border-t">
                  <button
                    onClick={handleAnalyzeLLM}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? "Analyzing..." : "🚀 Analyze Interview"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* QA Input & Results Section */}
          {qaInput.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-xl border shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Interview Transcript
                </h2>
                <div className={`bg-gray-50 dark:bg-slate-900 rounded-lg p-4 overflow-auto dynamic-height ${
                  hasAnalysisResults ? 'max-h-[160vh]' : 'max-h-[60vh]'
                }`}>
                  {/* Debug info - remove in production */}
                  {/* {process.env.NODE_ENV === 'development' && (
                    <div className="text-xs text-blue-500 mb-2">
                      Debug: hasAnalysisResults = {hasAnalysisResults.toString()}, 
                      analysisResult = {Boolean(analysisResult).toString()}, 
                      analysis.length = {analysis.length}
                    </div>
                  )} */}
                  <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {qaPreview}
                  </pre>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                {/* Loading State */}
                {isLoading && <LoadingAnimation />}
                
                {/* Error State */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">❌</div>
                      <div>
                        <h3 className="font-semibold text-red-800 dark:text-red-200">Analysis Failed</h3>
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analysis Results */}
                {analysisResult && (
                  <div className="space-y-6">
                    <BasicInformation basicInfo={analysisResult.basic_information} />
                    <OverallSummary summary={analysisResult.overall_summary} />
                    <Timeline items={analysisResult.timeline} />
                  </div>
                )}

                {/* Legacy Analysis Display (for mock) */}
                {!analysisResult && analysis.length > 0 && (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        📝 <strong>Legacy Format:</strong> This is the old analysis format. Use the LLM analysis for enhanced insights.
                      </p>
                    </div>
                    <Timeline items={analysis} />
                  </div>
                )}

                {/* Empty State */}
                {!analysisResult && !analysis.length && !isLoading && !error && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl border shadow-sm p-12">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🤖</div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Ready to Analyze
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Select a sample interview and click "Analyze Interview" to see AI-powered insights
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

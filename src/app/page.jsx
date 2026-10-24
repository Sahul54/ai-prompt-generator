"use client";

import { useState } from "react";

const creativeTypes = [
  "Hero Banner",
  "Promo Banner",
  "Product Poster",
  "Product Ad",
  "Social Post",
  "Story / Reel",
];

const ratios = ["16:9", "4:3", "1:1", "4:5", "9:16"];

const styles = [
  "Premium",
  "Minimal",
  "Luxury",
  "Modern",
  "Photorealistic",
  "Editorial",
  "Bold & Vibrant",
  "Clean Commercial",
];

export default function Home() {
  const [rawPrompt, setRawPrompt] = useState("");
  const [creativeType, setCreativeType] =
    useState("Hero Banner");
  const [ratio, setRatio] = useState("16:9");
  const [style, setStyle] = useState("Premium");

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generatePrompt() {
    if (!rawPrompt.trim()) return;

    setLoading(true);
    setResult("");
    setCopied(false);

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: rawPrompt,
          creativeType,
          size: ratio,
          ratio,
          style,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong"
        );
      }

      setResult(data.prompt);
    } catch (error) {
      setResult(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function copyPrompt() {
    if (!result) return;

    await navigator.clipboard.writeText(result);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <main className="h-screen overflow-hidden bg-[#f7f8fa] text-gray-900">
      {/* Header */}
      <header className="h-14 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-950 text-sm text-white">
              ✦
            </div>

            <div>
              <h1 className="text-sm font-bold tracking-tight text-gray-950">
                CreativePrompt
              </h1>

              <p className="text-[9px] font-medium text-gray-500">
                E-commerce AI Prompt Generator
              </p>
            </div>
          </div>

          <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[9px] font-semibold text-gray-600">
            Powered by Gemini
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto h-[calc(100vh-56px)] max-w-7xl px-5 py-4">
        {/* Page heading */}
        <div className="mb-3">
          <h2 className="text-lg font-bold tracking-tight text-gray-950">
            Create better image prompts
          </h2>

          <p className="mt-0.5 text-[11px] font-medium text-gray-600">
            Turn a simple idea into a professional e-commerce
            image-generation prompt.
          </p>
        </div>

        {/* Workspace */}
        <div className="grid h-[calc(100%-52px)] min-h-0 gap-4 lg:grid-cols-[1fr_0.9fr]">
          {/* LEFT PANEL */}
          <section className="min-h-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            {/* Raw Prompt */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-bold text-gray-950">
                  Your creative idea
                </label>

                <span className="text-[9px] font-medium text-gray-500">
                  Describe naturally
                </span>
              </div>

              <textarea
                value={rawPrompt}
                onChange={(e) =>
                  setRawPrompt(e.target.value)
                }
                placeholder="Example: Premium black sneakers website banner for a new collection..."
                className="h-[82px] w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-[11px] font-medium leading-5 text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
              />
            </div>

            {/* Creative Type */}
            <div className="mt-3.5">
              <label className="mb-1.5 block text-xs font-bold text-gray-950">
                Creative type
              </label>

              <div className="grid grid-cols-3 gap-1.5">
                {creativeTypes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setCreativeType(item)
                    }
                    className={`rounded-lg border px-2 py-2 text-[9px] font-bold transition-all ${
                      creativeType === item
                        ? "border-gray-950 bg-gray-950 text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-bold text-gray-950">
                Aspect ratio
              </label>

              <div className="grid grid-cols-5 gap-1.5">
                {ratios.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRatio(item)}
                    className={`group flex h-11 items-center justify-center rounded-lg border transition-all ${
                      ratio === item
                        ? "border-gray-950 bg-gray-950 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {/* Visual ratio preview */}
                      <span
                        className={`block rounded-[2px] border ${
                          ratio === item
                            ? "border-white"
                            : "border-gray-500"
                        } ${
                          item === "16:9"
                            ? "h-3.5 w-6"
                            : item === "4:3"
                            ? "h-3.5 w-5"
                            : item === "1:1"
                            ? "h-4 w-4"
                            : item === "4:5"
                            ? "h-4.5 w-3.5"
                            : "h-6 w-3.5"
                        }`}
                      />

                      <span className="text-[9px] font-bold">
                        {item}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Style */}
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-bold text-gray-950">
                Visual style
              </label>

              <div className="flex flex-wrap gap-1.5">
                {styles.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStyle(item)}
                    className={`rounded-lg border px-2.5 py-1.5 text-[9px] font-bold transition-all ${
                      style === item
                        ? "border-gray-950 bg-gray-950 text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate */}
            <button
              type="button"
              onClick={generatePrompt}
              disabled={
                loading || !rawPrompt.trim()
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-950 py-2.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating prompt...
                </>
              ) : (
                <>
                  <span>✦</span>
                  Generate Optimized Prompt
                </>
              )}
            </button>
          </section>

          {/* RIGHT PANEL */}
          <section className="flex min-h-0 flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            {/* Result Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-gray-500">
                  AI Output
                </p>

                <h3 className="mt-0.5 text-sm font-bold text-gray-950">
                  Optimized Prompt
                </h3>
              </div>

              {result && (
                <button
                  type="button"
                  onClick={copyPrompt}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[9px] font-bold text-gray-800 transition hover:bg-gray-50"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              )}
            </div>

            {/* Result */}
            <div className="mt-3 min-h-0 flex-1">
              {!result && !loading && (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50">
                  <div className="max-w-[230px] px-5 text-center">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-base shadow-sm">
                      ✦
                    </div>

                    <p className="mt-3 text-[11px] font-bold text-gray-950">
                      Your prompt will appear here
                    </p>

                    <p className="mt-1 text-[9px] font-medium leading-4 text-gray-500">
                      Enter your idea, choose the format and
                      style, then generate.
                    </p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex h-full items-center justify-center rounded-xl bg-gray-50">
                  <div className="text-center">
                    <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-950" />

                    <p className="mt-3 text-[11px] font-bold text-gray-950">
                      Creating your prompt...
                    </p>

                    <p className="mt-1 text-[9px] font-medium text-gray-500">
                      Optimizing your e-commerce creative
                    </p>
                  </div>
                </div>
              )}

              {result && !loading && (
                <div className="flex h-full flex-col">
                  <div className="min-h-0 flex-1 overflow-auto rounded-xl bg-gray-50 p-4">
                    <p className="whitespace-pre-wrap text-[11px] font-medium leading-5 text-gray-800">
                      {result}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={copyPrompt}
                    className="mt-3 w-full rounded-xl border border-gray-200 bg-white py-2.5 text-[10px] font-bold text-gray-900 transition hover:bg-gray-50"
                  >
                    {copied
                      ? "✓ Prompt Copied"
                      : "Copy Prompt"}
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
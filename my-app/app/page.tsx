"use client";

import { useState, ChangeEvent, FormEvent } from "react";

export default function Home() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdf(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pdf || !pergunta) return;

    setCarregando(true);
    setResposta("");

    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("pergunta", pergunta);

    try {
      const res = await fetch("http://localhost:5000/analisar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResposta(res.ok ? data.resposta : "Erro ao processar PDF.");
    } catch (error) {
      setResposta("Erro: Verifique se o servidor backend está ligado.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center py-12 px-4 font-sans">
      <main className="w-full max-w-2xl bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8 text-center">
          🤖 Assistente de Documentos
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              Faça upload do seu PDF:
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-zinc-800 dark:file:text-zinc-300 transition-all cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              O que você quer saber?
            </label>
            <textarea
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              placeholder="Ex: Qual o resumo deste contrato?"
              className="w-full p-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 min-h-[120px] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={carregando || !pdf}
            className={`relative w-full py-4 px-4 rounded-xl font-bold text-white overflow-hidden transition-all ${
              carregando || !pdf
                ? "bg-zinc-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {carregando && (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {carregando ? "Processando I.A..." : "Analisar Documento"}
            </div>
          </button>
        </form>

        {/* Resposta com animação simples de entrada */}
        {resposta && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
                Resposta da Inteligência Artificial:
              </h2>
              <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed">
                {resposta}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
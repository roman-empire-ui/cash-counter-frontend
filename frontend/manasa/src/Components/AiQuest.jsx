import React, { useEffect, useState } from "react";
import { getNextQuestion, answerQuestion } from "../services/aiLearning";
import { Brain, X } from "lucide-react";

const LossAIModal = ({ sessionId, onClose }) => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadNext = async () => {
    setLoading(true);
    const data = await getNextQuestion(sessionId);

    if (data.done) {
      onClose();
      return;
    }

    setQuestion(data.question);
    setLoading(false);
  };

  useEffect(() => {
    loadNext();
  }, []);

  const handleAnswer = async (answer) => {
    await answerQuestion(sessionId, {
      questionId: question._id,
      answer,
    });
    loadNext();
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-black/80 via-slate-900/80 to-black/80 p-6 shadow-[0_0_40px_rgba(0,255,255,0.25)] animate-fadeIn">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-cyan-300 hover:text-red-400 transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-cyan-500/20 p-2 text-cyan-400 animate-pulse">
            <Brain size={22} />
          </div>
          <h3 className="text-lg font-semibold tracking-wide text-cyan-300">
            AI Loss Analysis
          </h3>
        </div>

        {/* Question */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-lg font-medium text-white">
            {question.text}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswer("YES")}
            className="rounded-xl border border-green-400/30 bg-green-500/20 py-2 text-green-300 hover:bg-green-500/30 hover:shadow-[0_0_15px_rgba(0,255,120,0.6)] transition"
          >
            Yes
          </button>

          <button
            onClick={() => handleAnswer("NO")}
            className="rounded-xl border border-red-400/30 bg-red-500/20 py-2 text-red-300 hover:bg-red-500/30 hover:shadow-[0_0_15px_rgba(255,0,0,0.6)] transition"
          >
            No
          </button>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-cyan-400/60">
          Answer honestly to help AI detect loss causes
        </p>
      </div>
    </div>
  );
};

export default LossAIModal;

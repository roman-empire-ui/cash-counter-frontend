import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  User,
  Mic,
  Loader2,
  CheckCircle2,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { createHand, getHandovers, deleteHand } from "../services/speech";
import Lottie from "lottie-react";
import ham from '../assets/ham.json'
const SpeechAssistant = () => {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("idle");
  const [handovers, setHandovers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  // 🗣️ Initialize speech recognition
  const initRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Try Chrome.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus("listening");
    };

    recognition.onend = () => setIsListening(false);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.trim();
      setMessage(transcript);
      await handleSpeech(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setStatus("error");
      speakOut("Sorry, I couldn't hear you properly.");
    };

    return recognition;
  };

  // 📝 Parse speech into structured handover data
  const parseSpeech = (speechText) => {
    const amountMatch = speechText.match(/(\d+)/);
    const amountGiven = amountMatch ? parseInt(amountMatch[1]) : 0;
    const changeMatch = speechText.match(/change\s+returned\s+(\d+)/i);
    const toMatch = speechText.match(/to\s+([a-zA-Z\s]+)/i);
    const reasonMatch = speechText.match(/for\s+([a-zA-Z\s]+)/i);
    const reason = reasonMatch?.[1]?.trim() || "other";

    const changeReturned = changeMatch ? parseInt(changeMatch[1]) : 0;
    const netAmount = amountGiven - changeReturned;

    return {
      rawSpeech: speechText,
      amountGiven,
      changeReturned,
      netAmount,
      givenTo: toMatch ? toMatch[1] : "",
      reason,
    };
  };

  // 💾 Handle speech input
  const handleSpeech = async (speechText) => {
    if (!speechText) return;
    setStatus("loading");

    try {
      const parsedData = parseSpeech(speechText);
      const res = await createHand(parsedData);

      const msg =
        res?.message || `Saved successfully! Net: ₹${parsedData.netAmount}`;
      setResponse(msg);
      speakOut(msg);
      setStatus("success");

      // Refresh list after saving
      fetchHandovers();
    } catch (err) {
      console.error(err);
      setStatus("error");
      setResponse("Error connecting to server");
      speakOut("There was an error connecting to the server.");
    }
  };

  // 🔄 Fetch saved handovers
  const fetchHandovers = async () => {
    try {
      const res = await getHandovers();
      if (res?.success) setHandovers(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch handovers:", err);
    }
  };

  useEffect(() => {
    fetchHandovers();
  }, []);

  // 🗣️ Text-to-speech
  const speakOut = (text) => {
    if (synth.speaking) synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN";
    utter.pitch = 1;
    utter.rate = 1;
    synth.speak(utter);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) recognitionRef.current = initRecognition();
    if (!isListening) recognitionRef.current?.start();
    else recognitionRef.current?.stop();
  };

  // 🗑️ Open confirmation modal
  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  // ✅ Delete record after confirmation
  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteHand(selectedId);
      setShowModal(false);
      setSelectedId(null);
      speakOut("Handover has been deleted");
      fetchHandovers();
    } catch (err) {
      console.error("Delete failed:", err);
      speakOut("Failed to delete handover.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8 gap-4">
      {/* Left: Speech input */}
      <div className="p-6 rounded-3xl backdrop-blur-md bg-white/10 shadow-2xl border border-white/10 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-yellow-400 mb-6 text-center">
           Voice Cash Counter
        </h1>

        <button
          onClick={toggleListening}
          className={`relative w-28 h-28 flex items-center justify-center rounded-full border-6 transition-all duration-300 ${isListening
              ? "border-yellow-400 bg-yellow-500/20 scale-110 shadow-[0_0_30px_rgba(250,204,21,0.7)]"
              : "border-gray-500 bg-gray-800 hover:border-yellow-400 hover:scale-105"
            }`}
        >
          {status === "loading" ? (
            <Loader2 className="animate-spin w-12 h-12 text-yellow-400" />
          ) : status === "success" ? (
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          ) : isListening ? (
            <Square className="w-12 h-12 text-red-400" />
          ) : (
            <Mic className="w-12 h-12 text-gray-300 hover:text-yellow-400" />
          )}
        </button>

        <div className="mt-6 text-center w-full">
          <p className="text-gray-400 mb-2 flex items-center justify-center gap-2">
            <User className="w-5 h-5 text-yellow-400" />
            You said:
          </p>
          <p className="text-yellow-300 font-semibold break-words text-lg">
            {message || "—"}
          </p>
          <p className="text-gray-400 mb-2 flex items-center justify-center gap-2">
            <Bot className="w-5 h-5 text-green-400" />
            Response:
          </p>
          <p className="text-green-400 font-semibold break-words text-lg">
            {response || "—"}
          </p>
        </div>
      </div>

      {/* Right: Saved handovers */}
      <div className="flex-1 p-6 rounded-3xl backdrop-blur-md bg-white/10 shadow-2xl border border-white/10 overflow-y-auto max-h-[80vh]">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">
          Saved Handovers
        </h2>
        {handovers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Lottie animationData={ham} loop={true} className="w-70 h-70" />
            <p className="text-gray-400 mt-4 text-lg">
              No handovers yet. Try speaking to add one!
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-white">
            <thead>
              <tr className="border-b border-white/20">
                <th className="px-2 py-1">Date</th>
                <th className="px-2 py-1">Given To</th>
                <th className="px-2 py-1">Amount</th>
                <th className="px-2 py-1">Change</th>
                <th className="px-2 py-1">Net</th>
                <th className="px-2 py-1">Reason</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {handovers.map((h) => {
                const today = new Date().toISOString().split("T")[0];
                const isToday = h.date?.startsWith(today);

                return (
                  <tr
                    key={h._id}
                    className={`border-b border-white/10 group transition ${isToday
                        ? "bg-gradient-to-r from-yellow-500/20 to-yellow-300/10 shadow-[0_0_10px_rgba(250,204,21,0.3)]"
                        : "hover:bg-white/5"
                      }`}
                  >
                    <td
                      className={`px-2 py-1 ${isToday ? "text-yellow-400 font-semibold" : "text-white"
                        }`}
                    >
                      {h.date}
                    </td>
                    <td className="px-2 py-1">{h.givenTo || "—"}</td>
                    <td className="px-2 py-1">₹{h.amountGiven}</td>
                    <td className="px-2 py-1">₹{h.changeReturned}</td>
                    <td className="px-2 py-1">₹{h.netAmount}</td>
                    <td className="px-2 py-1">{h.reason}</td>
                    <td className="px-2 py-1 text-right">
                      <button
                        onClick={() => confirmDelete(h._id)}
                        className="hidden group-hover:inline-flex items-center justify-center text-red-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        )}
      </div>

      {/* 🧊 Delete confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
          <div className="bg-gray-900 p-6 rounded-2xl border border-white/20 shadow-xl w-80 text-center">
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">
              Are you sure?
            </h3>
            <p className="text-gray-300 mb-6">
              Do you really want to delete this handover?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechAssistant;

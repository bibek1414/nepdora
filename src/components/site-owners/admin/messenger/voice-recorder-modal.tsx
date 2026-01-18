"use client";

import { useState, useRef, useEffect } from "react";
import { X, Mic, Square, Play, Pause, Trash2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (audioBlob: Blob) => Promise<void>;
}

export function VoiceRecorderModal({
  isOpen,
  onClose,
  onSend,
}: VoiceRecorderModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, [audioUrl]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetRecorder();
    }
  }, [isOpen]);

  const resetRecorder = () => {
    setIsRecording(false);
    setIsPaused(false);
    setAudioBlob(null);
    setRecordingTime(0);
    setIsPlaying(false);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    audioChunksRef.current = [];
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }
  };

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSend = async () => {
    if (!audioBlob) return;

    setIsSending(true);
    try {
      await onSend(audioBlob);
      onClose();
      resetRecorder();
    } catch (error) {
      console.error("Error sending audio:", error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Voice Message</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Recording Visualization */}
        <div className="mb-6 flex flex-col items-center">
          <div
            className={cn(
              "mb-4 flex h-24 w-24 items-center justify-center rounded-full",
              isRecording && !isPaused
                ? "animate-pulse bg-red-100"
                : "bg-gray-100"
            )}
          >
            <Mic
              className={cn(
                "h-12 w-12",
                isRecording && !isPaused ? "text-red-600" : "text-gray-400"
              )}
            />
          </div>

          {/* Timer */}
          <div className="font-mono text-2xl font-semibold text-gray-900">
            {formatTime(recordingTime)}
          </div>

          {/* Status */}
          <div className="mt-2 text-sm text-gray-500">
            {isRecording && !isPaused && "Recording..."}
            {isRecording && isPaused && "Paused"}
            {!isRecording && audioBlob && "Recording complete"}
            {!isRecording && !audioBlob && "Ready to record"}
          </div>
        </div>

        {/* Audio Player (when recording is done) */}
        {audioUrl && !isRecording && (
          <div className="mb-6">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
              <button
                onClick={playAudio}
                className="bg-primary hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full text-white"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5" />
                )}
              </button>
              <div className="flex-1">
                <div className="h-1 w-full rounded-full bg-gray-300">
                  <div className="bg-primary h-1 w-0 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {!isRecording && !audioBlob && (
            <Button
              onClick={startRecording}
              className="bg-primary hover:bg-primary flex-1"
            >
              <Mic className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
          )}

          {isRecording && (
            <>
              <Button
                onClick={pauseRecording}
                variant="outline"
                className="flex-1"
              >
                {isPaused ? (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                )}
              </Button>
              <Button
                onClick={stopRecording}
                variant="destructive"
                className="flex-1"
              >
                <Square className="mr-2 h-4 w-4" />
                Stop
              </Button>
            </>
          )}

          {!isRecording && audioBlob && (
            <>
              <Button
                onClick={resetRecorder}
                variant="outline"
                className="flex-1"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <Button
                onClick={handleSend}
                disabled={isSending}
                className="bg-primary hover:bg-primary flex-1"
              >
                <Send className="mr-2 h-4 w-4" />
                {isSending ? "Sending..." : "Send"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

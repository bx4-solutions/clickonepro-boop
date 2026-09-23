import { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AudioDemo, TranscriptMessage } from "@/data/audioDemo";

interface AudioTranscriptPlayerProps {
  demo: AudioDemo;
}

const AudioTranscriptPlayer = ({ demo }: AudioTranscriptPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<TranscriptMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRealAudio, setHasRealAudio] = useState(false);
  const simulationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if demo has real audio URL
  useEffect(() => {
    setHasRealAudio(!!demo.audioUrl && demo.audioUrl.length > 0);
  }, [demo.audioUrl]);

  // Reset when demo changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setVisibleMessages([]);
    setIsLoading(false);
    if (simulationRef.current) {
      clearInterval(simulationRef.current);
      simulationRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  }, [demo.id]);

  // Update visible messages based on current time
  useEffect(() => {
    const visible = demo.transcript.filter((msg) => msg.timestamp <= currentTime);
    setVisibleMessages(visible);
  }, [currentTime, demo.transcript]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  // Simulated playback for demos without real audio
  useEffect(() => {
    if (isPlaying && !hasRealAudio) {
      const maxTime = Math.max(...demo.transcript.map(m => m.timestamp)) + 5;
      
      simulationRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= maxTime) {
            setIsPlaying(false);
            if (simulationRef.current) {
              clearInterval(simulationRef.current);
              simulationRef.current = null;
            }
            return prev;
          }
          return prev + 0.1;
        });
      }, 100);
    } else if (!isPlaying && simulationRef.current) {
      clearInterval(simulationRef.current);
      simulationRef.current = null;
    }
    
    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
        simulationRef.current = null;
      }
    };
  }, [isPlaying, hasRealAudio, demo.transcript]);

  const togglePlay = async () => {
    if (hasRealAudio && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.warn("Audio playback failed, switching to simulated mode:", error);
          setHasRealAudio(false);
          setIsPlaying(true);
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleReplay = () => {
    if (hasRealAudio && audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setVisibleMessages([]);
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      setCurrentTime(0);
      setVisibleMessages([]);
      setIsPlaying(true);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const displayDuration = duration || (Math.max(...demo.transcript.map(m => m.timestamp)) + 5);
    if (!displayDuration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * displayDuration;
    
    if (hasRealAudio && audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Simulated duration based on transcript
  const simulatedDuration = Math.max(...demo.transcript.map(m => m.timestamp)) + 5;
  const displayDuration = duration || simulatedDuration;
  const displayProgress = (currentTime / displayDuration) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-card rounded-2xl border border-border/50 overflow-hidden shadow-lg">
      {/* Left side - Image and Player */}
      <div className="flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={demo.image}
            alt={demo.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-flex items-center gap-2 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              <Bot className="h-4 w-4" />
              {demo.title}
            </span>
          </div>
        </div>
        
        {/* Audio Player Controls */}
        <div className="p-4 bg-muted/50">
          <audio
            ref={audioRef}
            src={demo.audioUrl}
            preload="auto"
            aria-label={`Audio demonstration: ${demo.title}`}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onError={() => {
              console.warn("Audio element error, falling back to simulated playback");
              setHasRealAudio(false);
            }}
          />
          
          {/* Progress Bar */}
          <div 
            className="group relative h-2 bg-muted rounded-full cursor-pointer mb-3"
            onClick={handleProgressClick}
            role="slider"
            aria-label="Audio progress"
            aria-valuemin={0}
            aria-valuemax={Math.round(displayDuration)}
            aria-valuenow={Math.round(currentTime)}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(displayDuration)}`}
            tabIndex={0}
          >
            <div 
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
              style={{ width: `${displayProgress}%` }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${displayProgress}% - 8px)` }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="default"
                onClick={togglePlay}
                disabled={isLoading}
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
                className={cn(
                  "h-10 w-10 rounded-full",
                  isPlaying && "animate-pulse"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : isPlaying ? (
                  <Pause className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" aria-hidden="true" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleReplay}
                aria-label="Replay audio from beginning"
                className="h-8 w-8"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground font-mono">
              {formatTime(currentTime)} / {formatTime(displayDuration)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Right side - Transcript */}
      <div className="flex flex-col h-[300px] md:h-[400px]">
        <div className="p-4 border-b border-border/50 flex-shrink-0">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Real-Time Transcript
          </h4>
        </div>
        
        <div 
          ref={transcriptRef}
          className="flex-1 p-4 space-y-3 overflow-y-auto scroll-smooth min-h-0"
          aria-live="polite"
          aria-atomic="false"
          role="log"
        >
          {visibleMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Click play to start the demonstration
            </div>
          ) : (
            visibleMessages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-2 animate-fade-in",
                  msg.speaker === "client" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center",
                    msg.speaker === "ai"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {msg.speaker === "ai" ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] px-3 py-2 rounded-2xl text-sm",
                    msg.speaker === "ai"
                      ? "bg-primary/10 text-foreground rounded-tl-sm"
                      : "bg-muted text-foreground rounded-tr-sm"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioTranscriptPlayer;

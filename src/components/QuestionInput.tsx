import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const QuestionInput = ({ onSubmit, isLoading, disabled }: QuestionInputProps) => {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !disabled && !isLoading) {
      onSubmit(question.trim());
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      onSubmit={handleSubmit}
      className="relative"
    >
      <div className="relative flex items-center">
        <div className="absolute left-4 text-muted-foreground">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={disabled ? "Upload documents first..." : "Ask a question about your documents..."}
          disabled={disabled || isLoading}
          className="w-full h-14 pl-12 pr-32 bg-card border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="absolute right-2">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={!question.trim() || disabled || isLoading}
            className="rounded-xl"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Ask AI
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

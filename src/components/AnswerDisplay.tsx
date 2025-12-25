import { motion, AnimatePresence } from "framer-motion";
import { Bot, Copy, CheckCheck, FileSearch } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AnswerDisplayProps {
  question: string | null;
  answer: string | null;
  isLoading: boolean;
}

export const AnswerDisplay = ({ question, answer, isLoading }: AnswerDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (answer) {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!question && !isLoading) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-4"
      >
        {question && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3 p-4 bg-secondary/50 rounded-xl"
          >
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <FileSearch className="w-4 h-4 text-primary" />
            </div>
            <p className="text-foreground font-medium pt-1">{question}</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative p-6 bg-card border border-border rounded-2xl shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-accent rounded-xl shrink-0 shadow-glow">
              <Bot className="w-5 h-5 text-accent-foreground" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-accent">AI Assistant</span>
                {answer && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {copied ? (
                      <CheckCheck className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  <motion.div
                    className="h-4 bg-muted rounded-full overflow-hidden"
                    initial={{ width: "60%" }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-muted via-accent/20 to-muted"
                      style={{ backgroundSize: "200% 100%" }}
                      animate={{ backgroundPosition: ["100% 0", "-100% 0"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                  <motion.div
                    className="h-4 bg-muted rounded-full overflow-hidden"
                    initial={{ width: "80%" }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-muted via-accent/20 to-muted"
                      style={{ backgroundSize: "200% 100%" }}
                      animate={{ backgroundPosition: ["100% 0", "-100% 0"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
                    />
                  </motion.div>
                  <motion.div
                    className="h-4 bg-muted rounded-full overflow-hidden"
                    initial={{ width: "40%" }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-muted via-accent/20 to-muted"
                      style={{ backgroundSize: "200% 100%" }}
                      animate={{ backgroundPosition: ["100% 0", "-100% 0"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.4 }}
                    />
                  </motion.div>
                  <p className="text-sm text-muted-foreground mt-4">Analyzing your documents...</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="prose prose-sm max-w-none"
                >
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">{answer}</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

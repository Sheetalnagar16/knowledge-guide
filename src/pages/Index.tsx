import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Brain, Search } from "lucide-react";
import { DocumentUpload } from "@/components/DocumentUpload";
import { QuestionInput } from "@/components/QuestionInput";
import { AnswerDisplay } from "@/components/AnswerDisplay";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  content: string;
  size: number;
}

const Index = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = useCallback(async (question: string) => {
    if (documents.length === 0) {
      toast.error("Please upload at least one document first");
      return;
    }

    setCurrentQuestion(question);
    setAnswer(null);
    setIsLoading(true);

    // Combine all document content
    const documentText = documents
      .map(doc => `--- ${doc.name} ---\n${doc.content}`)
      .join("\n\n");

    // Simulate AI processing (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simple keyword-based answer generation for demo
    const lowerQuestion = question.toLowerCase();
    const lowerContent = documentText.toLowerCase();
    
    let generatedAnswer = "";
    
    // Find relevant sentences
    const sentences = documentText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const relevantSentences = sentences.filter(sentence => {
      const words = lowerQuestion.split(/\s+/).filter(w => w.length > 3);
      return words.some(word => sentence.toLowerCase().includes(word));
    });

    if (relevantSentences.length > 0) {
      generatedAnswer = `Based on the provided documents, here's what I found:\n\n${relevantSentences.slice(0, 3).map(s => `• ${s.trim()}`).join("\n\n")}`;
    } else {
      generatedAnswer = "The provided documents do not contain sufficient information to answer this question. Please try rephrasing your question or upload additional relevant documents.";
    }

    setAnswer(generatedAnswer);
    setIsLoading(false);
    toast.success("Analysis complete");
  }, [documents]);

  const features = [
    { icon: BookOpen, title: "Document Analysis", desc: "Upload and process multiple documents" },
    { icon: Brain, title: "Intelligent Search", desc: "AI-powered understanding of your content" },
    { icon: Search, title: "Precise Answers", desc: "Get accurate answers from your documents" },
  ];

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-surface/80 backdrop-blur-lg sticky top-0 z-50"
      >
        <div className="container max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-accent rounded-xl shadow-glow">
              <Sparkles className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">KnowledgeBase AI</span>
          </div>
          <span className="text-sm text-muted-foreground hidden sm:block">
            Intelligent Document Search
          </span>
        </div>
      </motion.header>

      <main className="container max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Ask Questions About{" "}
            <span className="text-gradient">Your Documents</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your documents and get instant, AI-powered answers. 
            Our intelligent search understands context and delivers precise results.
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="p-4 bg-card border border-border rounded-xl flex items-center gap-3 hover:border-accent/30 hover:shadow-md transition-all"
            >
              <div className="p-2 bg-secondary rounded-lg">
                <feature.icon className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{feature.title}</p>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent" />
                Upload Documents
              </h2>
              <DocumentUpload 
                documents={documents} 
                onDocumentsChange={setDocuments} 
              />
            </div>
          </div>

          {/* Right Column - Q&A */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-accent" />
                Ask a Question
              </h2>
              <QuestionInput
                onSubmit={handleAskQuestion}
                isLoading={isLoading}
                disabled={documents.length === 0}
              />
            </div>

            <AnswerDisplay
              question={currentQuestion}
              answer={answer}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Empty State */}
        {documents.length === 0 && !currentQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center py-12 px-4 border-2 border-dashed border-border rounded-2xl"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No documents yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start by uploading your text documents (.txt, .md files). 
              Once uploaded, you can ask questions and get AI-powered answers.
            </p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto py-6 bg-surface/50">
        <div className="container max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Powered by AI • Your documents stay private and secure</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

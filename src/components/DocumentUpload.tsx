import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  content: string;
  size: number;
}

interface DocumentUploadProps {
  documents: Document[];
  onDocumentsChange: (docs: Document[]) => void;
}

export const DocumentUpload = ({ documents, onDocumentsChange }: DocumentUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(async (files: FileList) => {
    const newDocs: Document[] = [];
    
    for (const file of Array.from(files)) {
      if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        const content = await file.text();
        newDocs.push({
          id: crypto.randomUUID(),
          name: file.name,
          content,
          size: file.size,
        });
      }
    }
    
    onDocumentsChange([...documents, ...newDocs]);
  }, [documents, onDocumentsChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  const removeDocument = useCallback((id: string) => {
    onDocumentsChange(documents.filter(doc => doc.id !== id));
  }, [documents, onDocumentsChange]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300",
            isDragging
              ? "border-accent bg-accent/5 scale-[1.02]"
              : "border-border hover:border-accent/50 hover:bg-muted/50"
          )}
        >
          <input
            type="file"
            multiple
            accept=".txt,.md"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <motion.div
            animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className={cn(
              "p-4 rounded-full transition-colors duration-300",
              isDragging ? "bg-accent/20" : "bg-secondary"
            )}>
              <Upload className={cn(
                "w-6 h-6 transition-colors duration-300",
                isDragging ? "text-accent" : "text-muted-foreground"
              )} />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">
                {isDragging ? "Drop your files here" : "Drag & drop documents"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse • TXT, MD files supported
              </p>
            </div>
          </motion.div>
        </label>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {documents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              {documents.length} document{documents.length !== 1 ? "s" : ""} uploaded
            </p>
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-card rounded-xl border border-border group hover:border-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-secondary rounded-lg shrink-0">
                      <FileText className="w-4 h-4 text-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{formatSize(doc.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

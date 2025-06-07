import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Bot } from "lucide-react";

const TenderDetail = () => {
  const { id } = useParams();
  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTender = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/tenders/${id}`);
        const data = await res.json();
        setTender(data);
      } catch (err) {
        toast({ title: "Error", description: "Failed to fetch tender.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchTender();
  }, [id, toast]);

  const handleSummarize = async () => {
    setLoadingSummary(true);
    setSummary("");
    const res = await fetch("http://localhost:4000/api/ai/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenderText: tender.fullDescription }),
    });
    const data = await res.json();
    setSummary(data.summary);
    setLoadingSummary(false);
  };

  const handleAsk = async () => {
    if (!question) return;
    setLoadingAnswer(true);
    setAnswer("");
    const res = await fetch("http://localhost:4000/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenderText: tender.fullDescription, question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
    setLoadingAnswer(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {loading ? (
        <p>Loading...</p>
      ) : !tender ? (
        <p>Tender not found.</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{tender.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Deadline:</strong> {new Date(tender.deadline).toLocaleDateString()}</p>
            <p><strong>Description:</strong> {tender.description}</p>
            <a
              href={`http://localhost:4000/${tender.filePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline block my-2"
            >
              Download Tender Document
            </a>
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900">
                  <Bot className="w-5 h-5 mr-2" />
                  AI Tools
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Use AI to analyze this tender and generate responses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={handleSummarize}
                  disabled={loadingSummary}
                >
                  {loadingSummary ? "Summarizing..." : "Summarize Tender"}
                </Button>
                {summary && (
                  <div className="bg-white rounded p-2 text-sm text-gray-800 border mt-2">
                    <strong>Summary:</strong> {summary}
                  </div>
                )}
                <div className="pt-4">
                  <input
                    type="text"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Ask a question about this tender"
                    className="border rounded px-2 py-1 w-full mb-2"
                  />
                  <Button
                    className="w-full"
                    onClick={handleAsk}
                    disabled={loadingAnswer || !question}
                  >
                    {loadingAnswer ? "Asking..." : "Ask AI"}
                  </Button>
                  {answer && (
                    <div className="bg-white rounded p-2 text-sm text-gray-800 border mt-2">
                      <strong>AI Answer:</strong> {answer}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TenderDetail;

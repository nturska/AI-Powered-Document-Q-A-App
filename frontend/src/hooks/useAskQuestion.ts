import { useState } from "react";

export const useAskQuestion = () => {
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
  
    const ask = async (question: string) => {
      setAnswer("");
      setLoading(true);
      const response = await fetch(`/api/ask?q=${encodeURIComponent(question)}`);
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
  
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        // Parse SSE "data: ..." lines
        const token = chunk.replace(/^data: /gm, "");
        setAnswer(prev => prev + token);
      }
      setLoading(false);
    };
  
    return { ask, answer, loading };
  };
  
  export default useAskQuestion;
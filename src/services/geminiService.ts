import { GoogleGenAI } from "@google/genai";
import { VCon, Dialog } from "../types";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper to format transcript from VCon dialogs
function formatTranscript(vcon: VCon, dialogIndices?: number[]): string {
  const dialogsToFormat = dialogIndices 
    ? dialogIndices.map(i => vcon.dialog[i]).filter(Boolean)
    : vcon.dialog;

  return dialogsToFormat.map(d => {
    const speaker = vcon.parties[d.originator!];
    return `[${d.start}] ${speaker.name} (${speaker.role}): "${d.content}"`;
  }).join('\n');
}

export async function generateBaseline(vcon: VCon) {
  const model = "gemini-2.5-flash";
  const type = vcon.metadata?.type || 'General';
  
  // Filter for the first session or specific "baseline" sessions if marked
  // For now, we'll use the first session as the baseline source
  const firstSessionId = vcon.metadata?.sessions?.[0]?.id;
  const baselineDialogIndices = vcon.dialog
    .map((d, i) => d.metadata?.sessionId === firstSessionId ? i : -1)
    .filter(i => i !== -1);

  const transcript = formatTranscript(vcon, baselineDialogIndices);

  let systemInstruction = "";
  let outputSchema = "";

  switch (type) {
    case 'Mediation':
      systemInstruction = `
        You are an AI assistant for a community mediator.
        Analyze the provided witness testimonies regarding a dispute.
        Identify the consensus and any dissenting opinions.
      `;
      outputSchema = `
        {
          "consensus": "string describing the majority view",
          "agreement_rate": "percentage string (e.g. '67%')",
          "dissent": "string describing the dissenting view if any",
          "key_facts": ["list of agreed upon facts"]
        }
      `;
      break;
    case 'Healthcare':
      systemInstruction = `
        You are a medical scribe and assistant.
        Analyze the initial patient consultation.
        Summarize the patient's baseline condition, initial diagnosis, and treatment plan.
      `;
      outputSchema = `
        {
          "consensus": "Summary of initial diagnosis",
          "agreement_rate": "Confidence level of diagnosis (High/Medium/Low)",
          "dissent": "Any patient concerns or contraindications",
          "key_facts": ["List of symptoms", "Initial vitals", "Prescribed medications"]
        }
      `;
      break;
    case 'Education':
      systemInstruction = `
        You are an academic counselor's assistant.
        Analyze the initial student performance review or parent communication.
        Establish the baseline academic performance and goals.
      `;
      outputSchema = `
        {
          "consensus": "Summary of academic standing",
          "agreement_rate": "Alignment between student/teacher/parent (High/Medium/Low)",
          "dissent": "Areas of disagreement regarding performance or behavior",
          "key_facts": ["Current grades", "Identified strengths", "Areas for improvement"]
        }
      `;
      break;
    default:
      systemInstruction = `
        You are a helpful AI assistant analyzing a conversation.
        Establish the baseline facts and context of the discussion.
      `;
      outputSchema = `
        {
          "consensus": "Summary of the main topic",
          "agreement_rate": "N/A",
          "dissent": "Any conflicting points",
          "key_facts": ["List of key points discussed"]
        }
      `;
  }

  const prompt = `
    ${systemInstruction}

    Transcript:
    ${transcript}

    Output a JSON object with the following structure:
    ${outputSchema}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return {
      result: JSON.parse(response.text || "{}"),
      dialogIndices: baselineDialogIndices
    };
  } catch (error) {
    console.error("Error generating baseline:", error);
    return null;
  }
}

export async function checkConsistency(vcon: VCon, baselineAnalysis: any) {
  const model = "gemini-2.5-flash";
  const type = vcon.metadata?.type || 'General';

  // Get the latest active session
  const sessions = vcon.metadata?.sessions || [];
  const latestSession = sessions[sessions.length - 1];
  
  if (!latestSession) return null;

  const currentSessionIndices = vcon.dialog
    .map((d, i) => d.metadata?.sessionId === latestSession.id ? i : -1)
    .filter(i => i !== -1);

  const currentTranscript = formatTranscript(vcon, currentSessionIndices);
  const baselineSummary = JSON.stringify(baselineAnalysis);

  let systemInstruction = "";
  let outputSchema = "";

  switch (type) {
    case 'Mediation':
      systemInstruction = `
        Compare the current testimony against the established witness baseline.
        Flag material contradictions where a party changes their story.
      `;
      outputSchema = `
        {
          "contradiction_found": boolean,
          "current_claim": "Quote or summary of current claim",
          "previous_claim": "Quote or summary of previous claim from baseline",
          "analysis": "Detailed analysis of the inconsistency or confirmation of consistency"
        }
      `;
      break;
    case 'Healthcare':
      systemInstruction = `
        Compare the patient's current status against the initial baseline and treatment plan.
        Identify improvements, deteriorations, or adherence issues.
      `;
      outputSchema = `
        {
          "contradiction_found": boolean (true if condition worsened or non-adherence),
          "current_claim": "Current status summary",
          "previous_claim": "Baseline status summary",
          "analysis": "Medical progress analysis"
        }
      `;
      break;
    case 'Education':
      systemInstruction = `
        Compare the student's current performance against the initial goals and baseline.
        Identify progress, setbacks, or changes in strategy.
      `;
      outputSchema = `
        {
          "contradiction_found": boolean (true if goals missed or performance dropped),
          "current_claim": "Current performance summary",
          "previous_claim": "Initial goals/baseline",
          "analysis": "Academic progress analysis"
        }
      `;
      break;
    default:
      systemInstruction = `
        Compare the current conversation against the established baseline.
        Identify any shifts in topic, sentiment, or facts.
      `;
      outputSchema = `
        {
          "contradiction_found": boolean,
          "current_claim": "Current summary",
          "previous_claim": "Baseline summary",
          "analysis": "Comparison analysis"
        }
      `;
  }

  const prompt = `
    ${systemInstruction}

    Baseline Context:
    ${baselineSummary}

    Current Session Transcript:
    ${currentTranscript}

    Output a JSON object with the following structure:
    ${outputSchema}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return {
      result: JSON.parse(response.text || "{}"),
      dialogIndices: currentSessionIndices
    };
  } catch (error) {
    console.error("Error checking consistency:", error);
    return null;
  }
}

export async function semanticSearch(query: string, vcon: VCon) {
  const model = "gemini-2.5-flash";
  const transcript = formatTranscript(vcon);

  const prompt = `
    You are an AI assistant analyzing a vCon (Virtual Conversation) record.
    Context Type: ${vcon.metadata?.type || 'General'}
    
    Answer the user's question based strictly on the following transcript.
    Cite the specific speaker and time if relevant.

    Transcript:
    ${transcript}

    User Question: "${query}"

    Answer:
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error performing semantic search:", error);
    return "Unable to perform search at this time.";
  }
}

import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize the client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Define the CONSTANT rules (The System Instruction)
// These rules apply to EVERY request, regardless of language.
const systemInstruction = `
You are an expert coding assistant.
Your task is to generate clean, efficient code based on the user's request.

STRICT OUTPUT RULES:
1. Return ONLY the code inside Markdown code blocks (e.g., \`\`\`python ... \`\`\`).
2. Do NOT include any conversational text, introductions, or conclusions.
3. Do NOT say "Here is the code".
4. Do NOT add comments the output of the code unless the user specifies that they need explanation or comments on code.
5. Always give the standard code that is being used and mostly concise and correct.
6. Handle edge cases where applicable.
`;

// 3. Configure the model once with the system instructions
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash", 
    systemInstruction: systemInstruction 
});

export const generateResponseByAi = async (prompt, language) => {
  try {
    // 4. Combine the specific Language and Request here
    // This changes every time the user clicks "Generate"
    const finalUserPrompt = `
      Target Language: ${language}
      User Request: ${prompt}
    `;
    console.log("prompt is: ", prompt, language);
    
    // 5. Generate content
    const result = await model.generateContent(finalUserPrompt);
    const response = await result.response;
    
    // 6. Get text (This works now because we are using @google/generative-ai)
    const text = response.text();
    
    // console.log("AI Response:", text); // Debugging
    return text;

  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate code");
  }
}
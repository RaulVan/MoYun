import { GoogleGenAI } from "@google/genai";
import { IMAGE_STYLE_PROMPT } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an analysis and translation for a poem using gemini-2.5-flash
 */
export const generatePoemAnalysis = async (title: string, author: string, content: string[]): Promise<{ translation: string; appreciation: string }> => {
  try {
    const fullText = content.join('\n');
    const prompt = `
    Analyze the following Chinese poem. 
    Poem: "${title}" by ${author}
    Content:
    ${fullText}

    Please provide:
    1. A modern English translation.
    2. A brief appreciation/analysis of the imagery and mood (max 100 words).
    
    Return the result in JSON format with keys: "translation" and "appreciation".
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Analysis generation failed:", error);
    return {
      translation: "Translation temporarily unavailable.",
      appreciation: "Analysis temporarily unavailable."
    };
  }
};

/**
 * Generates an ink wash painting based on the poem using gemini-2.5-flash-image
 */
export const generateInkPainting = async (title: string, content: string[]): Promise<string | null> => {
  try {
    // 1. First, create a rich visual description prompt based on the poem content
    // We use the text model to convert the poem into a visual prompt optimized for the image model
    const visualPromptReq = `
      Convert the imagery of this Chinese poem into a concise English visual description for an AI image generator.
      Focus on physical elements (mountains, rivers, moon, etc.) and mood.
      Poem: ${content.join(' ')}
      Output only the description string.
    `;
    
    const descriptionRes = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: visualPromptReq
    });
    
    const visualDescription = descriptionRes.text?.trim() || title;

    // 2. Combine with our style prompt
    const finalPrompt = `${IMAGE_STYLE_PROMPT} Subject: ${visualDescription}`;

    // 3. Call the image generation model (Nano Banana / gemini-2.5-flash-image)
    // Note: The guidelines state to use generateContent for nano banana and handle parts.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: finalPrompt,
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64Data}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};

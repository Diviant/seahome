
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDescription = async (details: {
  title: string,
  type: string,
  amenities: string[],
  distanceToSea: number
}) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Напиши привлекательное описание для объявления о сдаче жилья у моря. 
      Название: ${details.title}. Тип: ${details.type}. Удобства: ${details.amenities.join(', ')}. 
      Расстояние до моря: ${details.distanceToSea} метров. 
      Стиль: дружелюбный, продающий, краткий. Без упоминания цены и контактов.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

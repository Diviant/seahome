
import { GoogleGenAI } from "@google/genai";

export const generateDescription = async (details: {
  title: string,
  type: string,
  amenities: string[],
  distanceToSea: number
}) => {
  try {
    // Безопасно получаем ключ, не вызывая краш приложения
    const apiKey = (window as any).process?.env?.API_KEY || "";
    
    if (!apiKey) {
      console.warn("SeaHome: API Key missing, AI generation disabled.");
      return "Описание будет добавлено владельцем в ближайшее время.";
    }

    const ai = new GoogleGenAI({ apiKey });
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
    return "Не удалось сгенерировать описание автоматически.";
  }
};
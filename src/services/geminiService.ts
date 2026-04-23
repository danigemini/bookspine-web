import { GoogleGenerativeAI } from "@google/generative-ai";
import { BookResult } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function analyzeBooks(images: File[]): Promise<BookResult[]> {
  if (!API_KEY) throw new Error("API Key no configurada en el entorno");

  const genAI = new GoogleGenerativeAI(API_KEY);
  
// Usamos la familia Gemini 3 que sabemos que sí está habilitada en tu cuenta
  const model = genAI.getGenerativeModel({ 
    model: "gemini-3-flash" 
  });

  const imageParts = await Promise.all(
    images.map(async (file) => ({
      inlineData: {
        data: await fileToBase64(file),
        mimeType: file.type,
      },
    }))
  );

  const prompt = `Analiza estas imágenes de lomos de libros. 
  Extrae el título y autor de cada libro de forma precisa. 
  Usa la búsqueda de Google para validar los nombres si no son legibles.
  
  Devuelve el resultado estrictamente en este formato por cada libro (una línea por libro):
  TITULO: [título] | AUTOR: [autor]`;

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();

  // Extraer enlaces de fuentes de Google Search
  const sources: string[] = [];
  const groundingChunks = (response as any).candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.url) sources.push(chunk.web.url);
    });
  }

  // Parsear el texto línea a línea para evitar errores de JSON
  return text.split('\n')
    .filter(line => line.includes('|'))
    .map((line, index) => {
      const parts = line.split('|');
      const title = parts[0].replace('TITULO:', '').trim();
      const author = parts[1].replace('AUTOR:', '').trim();
      
      return {
        id: `book-${Date.now()}-${index}`,
        title,
        author,
        sources: [...new Set(sources)]
      };
    });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
}

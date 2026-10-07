import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Map selected ratio to a practical canvas size
const canvasSizes = {
  "16:9": "1920x1080",
  "4:3": "1600x1200",
  "1:1": "1080x1080",
  "4:5": "1080x1350",
  "9:16": "1080x1920",
};

export async function POST(request) {
  try {
    const {
      prompt,
      creativeType,
      size,
      ratio,
      style,
    } = await request.json();

    // Validate prompt
    if (!prompt?.trim()) {
      return Response.json(
        {
          error: "Please enter your creative idea.",
        },
        { status: 400 }
      );
    }

    // Use ratio to determine actual canvas size
    const canvasSize =
      canvasSizes[ratio] || size || "1080x1080";

    const instruction = `
You are an expert e-commerce creative director
and AI image prompt engineer.

Your task is to transform the user's simple creative
idea into ONE professional, production-ready prompt
for an AI image generation model.

USER'S RAW IDEA:
${prompt}

CREATIVE TYPE:
${creativeType || "Product Creative"}

ASPECT RATIO:
${ratio || "1:1"}

CANVAS SIZE:
${canvasSize}

VISUAL STYLE:
${style || "Premium"}

Create a high-quality image-generation prompt that
is specifically optimized for e-commerce.

The final prompt should intelligently describe:

- Main product or subject
- Product appearance
- Important product details
- Background or environment
- Product positioning
- Composition
- Camera perspective when useful
- Lighting appropriate to the scene
- Realistic materials and textures
- Color direction
- Visual hierarchy
- Premium commercial photography
- Clean and professional presentation
- Negative space for marketing copy when useful
- Composition suitable for the selected creative type
- Layout suitable for the selected aspect ratio

CREATIVE TYPE GUIDELINES:

Hero Banner:
Create a wide, premium composition with strong
product focus and useful negative space for headline
or marketing content.

Promo Banner:
Create a commercial promotional composition with
strong product visibility and clear visual hierarchy.

Product Poster:
Create a visually striking poster-style composition
with the product as the main focal point.

Product Ad:
Create a conversion-focused commercial product visual
with strong product presentation and premium styling.

Social Post:
Create an engaging social-media-friendly composition
with a strong visual focal point and balanced spacing.

Story / Reel:
Create a vertical composition optimized for mobile
viewing with strong subject placement and safe space
for UI or marketing content.

IMPORTANT RULES:

1. Preserve the user's original product and idea.
2. Never change the main product.
3. Never replace the product with another product.
4. Do not invent unnecessary objects.
5. Do not add text inside the image unless the user
   explicitly requests text.
6. Keep the product realistic and visually accurate.
7. Avoid clutter and unnecessary decorative elements.
8. Use the selected visual style consistently.
9. Adapt the composition specifically to the selected
   creative type.
10. Adapt the layout specifically to the selected
    aspect ratio.
11. Use professional e-commerce visual language.
12. Prioritize product clarity and visual hierarchy.
13. Keep the final prompt detailed but concise.
14. Make the prompt directly usable in Gemini,
    GPT Image, or another modern image-generation model.
15. Do not explain your decisions.
16. Return ONLY the final image-generation prompt.

Return one polished image-generation prompt.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: instruction,
    });

    const generatedPrompt = response?.text?.trim();

    if (!generatedPrompt) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    return Response.json({
      prompt: generatedPrompt,
    });
  } catch (error) {
    console.error("Gemini Error:", error);

    const status = error?.status;

    if (status === 429) {
      return Response.json(
        {
          error:
            "Gemini rate limit reached. Please try again in a moment.",
        },
        { status: 429 }
      );
    }

    if (status === 503) {
      return Response.json(
        {
          error:
            "Gemini is temporarily busy. Please try again.",
        },
        { status: 503 }
      );
    }

    if (status === 401 || status === 403) {
      return Response.json(
        {
          error:
            "Gemini API key is invalid or does not have permission.",
        },
        { status }
      );
    }

    return Response.json(
      {
        error:
          "Failed to generate optimized prompt.",
      },
      { status: 500 }
    );
  }
}
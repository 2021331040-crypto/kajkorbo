export async function getAIRecommendation(userPrompt, products) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  try {
    if (!products || products.length === 0) {
      return { success: false, message: "No products available", products: [] };
    }

    const geminiPrompt = `
        You are a product recommendation AI. Here is a list of available products:
        ${JSON.stringify(products, null, 2)}

        Based on the following user request, filter and suggest the best matching products:
        "${userPrompt}"

        Important: Return ONLY a valid JSON array of the matching products. 
        Do not include any markdown formatting, code blocks, or extra text.
        Example format: [{"id": "1", "name": "Product Name"...}, ...]
    `;

    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: geminiPrompt }] }],
      }),
    });

    if (!response.ok) {
      console.warn("Gemini API Error:", response.status, "- Using fallback keyword matching");
      return performFallbackSearch(userPrompt, products);
    }

    const data = await response.json();
    
    // Extract AI response text
    const aiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    
    if (!aiResponseText) {
      console.warn("Empty AI response - Using fallback keyword matching");
      return performFallbackSearch(userPrompt, products);
    }

    // Clean the response - remove markdown code blocks
    const cleanedText = aiResponseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    if (!cleanedText) {
      console.warn("Cleaned text is empty - Using fallback keyword matching");
      return performFallbackSearch(userPrompt, products);
    }

    let parsedProducts;
    try {
      parsedProducts = JSON.parse(cleanedText);
      
      // Ensure it's an array
      if (!Array.isArray(parsedProducts)) {
        parsedProducts = [parsedProducts];
      }
      
      return { success: true, products: parsedProducts };
    } catch (parseError) {
      console.warn("JSON Parse Error - Using fallback keyword matching");
      return performFallbackSearch(userPrompt, products);
    }
  } catch (error) {
    console.warn("AI Recommendation Error:", error.message, "- Using fallback keyword matching");
    return performFallbackSearch(userPrompt, products);
  }
}

// Fallback: Simple keyword-based matching
function performFallbackSearch(userPrompt, products) {
  try {
    const keywords = userPrompt
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2);

    const scored = products.map(product => {
      let score = 0;
      const name = (product.name || "").toLowerCase();
      const description = (product.description || "").toLowerCase();
      const category = (product.category || "").toLowerCase();

      keywords.forEach(keyword => {
        if (name.includes(keyword)) score += 3;
        if (category.includes(keyword)) score += 2;
        if (description.includes(keyword)) score += 1;
      });

      return { ...product, score };
    });

    const matched = scored
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ score, ...product }) => product);

    return {
      success: true,
      products: matched,
      message: `Found ${matched.length} products using keyword matching`
    };
  } catch (error) {
    console.error("Fallback search error:", error);
    return { success: false, message: "Search failed", products: [] };
  }
}

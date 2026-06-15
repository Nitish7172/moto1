const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const Product = require('../models/Product');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Helper to safely escape special regex characters from AI generated strings
 */
const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Helper to automatically retry API calls on 503 (Unavailable) or 429 (Rate Limit) errors
 * Implements exponential backoff to maximize processing reliability.
 */
const generateContentWithRetry = async (model, promptData, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await model.generateContent(promptData);
    } catch (error) {
      if (error.status === 503 || error.status === 429) {
        if (i === maxRetries - 1) throw error; 
        
        const delay = Math.pow(2, i) * 1000; 
        console.warn(`[Gemini API] Server busy (${error.status}). Retrying in ${delay / 1000}s...`);
        
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

// @desc    Visual Gear & Bike Search
// @route   POST /api/ai/visual-search
const visualSearch = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = `
      You are a motorcycle expert. Analyze this image.
      Determine if the primary subject is a "Motorcycle" or "Gear".
      Identify the category (Bikes: Sport, Cruiser, Adventure, Classic. Gear: Helmet, Jacket, Boots, Gloves, Luggage).
      Identify the primary color and the style.
    `;

    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        itemType: { type: SchemaType.STRING, description: "Either 'Motorcycle' or 'Gear'" },
        category: { type: SchemaType.STRING },
        color: { type: SchemaType.STRING },
        style: { type: SchemaType.STRING }
      },
      required: ["itemType", "category", "color", "style"]
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        responseSchema: responseSchema
      },
    });

    const result = await generateContentWithRetry(model, [prompt, imagePart]);
    const aiAnalysis = JSON.parse(result.response.text());

    const itemRegex  = new RegExp(escapeRegex(aiAnalysis.category), "i");
    const styleRegex = new RegExp(escapeRegex(aiAnalysis.style), "i");
    const colorRegex = new RegExp(escapeRegex(aiAnalysis.color), "i");

    let matchType = "exact";
    let matchingProducts = await Product.find({
      $and: [
        { $or: [{ name: itemRegex }, { category: itemRegex }, { description: itemRegex }] },
        { $or: [{ name: styleRegex }, { name: colorRegex }, { description: styleRegex }] },
      ],
    }).limit(4).lean();

    if (matchingProducts.length === 0) {
      matchingProducts = await Product.find({
        $or: [{ name: itemRegex }, { category: itemRegex }],
      }).limit(4).lean();
      matchType = "category_only";
    }

    if (matchingProducts.length === 0) {
      matchingProducts = await Product.find(
        aiAnalysis.itemType === "Motorcycle"
          ? { category: { $ne: "Gear" } }
          : { category: "Gear" }
      ).limit(4).lean();
      matchType = "type_fallback";
    }

    if (matchingProducts.length === 0) {
      matchingProducts = await Product.find({}).limit(4).lean();
      matchType = "random_fallback";
    }

    return res.json({
      analysis: aiAnalysis,
      products: matchingProducts,
      matchStatus: matchType,
    });

  } catch (error) {
    console.error("Visual Search Error:", error);
    const status = error.status === 503 || error.status === 429 ? 503 : 500;
    return res.status(status).json({ message: "Failed to analyze image. Please try again.", error: error.message });
  }
};

// @desc    Smart Bundle Generator
// @route   POST /api/ai/generate-bundle
const generateBundle = async (req, res) => {
  try {
    const { mainProductId } = req.body;

    let mainProduct = null;
    if (mainProductId && typeof mainProductId === "string" && mainProductId.length === 24) {
      mainProduct = await Product.findById(mainProductId).lean().catch(() => null);
    }

    if (!mainProduct) mainProduct = await Product.findOne({ category: { $ne: "Gear" } }).lean();
    if (!mainProduct) mainProduct = await Product.findOne({}).lean();
    if (!mainProduct) return res.json({ bundleTitle: "Essential Riding Gear", items: [] });

    // Upgraded selector context to pull bike descriptions for accessory pairing logic
    const gearInventory = await Product.find({ category: "Gear" })
      .select("name price description")
      .limit(40)
      .lean();

    if (gearInventory.length === 0) {
      const basicFallback = await Product.find({ _id: { $ne: mainProduct._id } }).limit(3).lean();
      return res.json({ bundleTitle: `Recommended for your ${mainProduct.name}`, items: basicFallback });
    }

    const menuString = gearInventory.map((p) => `- "${p.name}" (${p.description || 'Premium gear protection'})`).join("\n");

    const prompt = `
      A customer is viewing this motorcycle product: "${mainProduct.name}" (Category: ${mainProduct.category}). 
      Bike Description: "${mainProduct.description || 'Standard performance package'}".
      
      Here is our store's inventory of accessories: 
      ${menuString}
      
      Select exactly 3 complementary items from that inventory list that a rider would logically buy alongside the main product. Match styles natively (e.g. track bikes get racing gear, adventure bikes get dirt protection).
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        responseSchema: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
        }
      },
    });

    const result = await generateContentWithRetry(model, prompt);
    const chosenNames = JSON.parse(result.response.text());

    const queryFilters = chosenNames.map((name) => ({
      name: new RegExp(escapeRegex(name).trim(), "i")
    }));

    let bundledProducts = [];
    if (queryFilters.length > 0) {
      bundledProducts = await Product.find({ $or: queryFilters }).limit(3).lean();
    }

    if (!bundledProducts || bundledProducts.length === 0) {
      bundledProducts = await Product.find({ category: "Gear" }).limit(3).lean();
    }

    return res.json({ bundleTitle: `Perfect matches for your ${mainProduct.name}`, items: bundledProducts });

  } catch (error) {
    console.error("Bundle Error:", error);
    try {
      const recoveryGear = await Product.find({ category: "Gear" }).limit(3).lean();
      return res.json({ bundleTitle: "Essential Riding Gear", items: recoveryGear });
    } catch (dbError) {
      return res.json({ bundleTitle: "Essential Riding Gear", items: [] });
    }
  }
};

// @desc    Suggest bikes based on user-entered terrain text
// @route   POST /api/ai/location-suggestions
const locationSuggestions = async (req, res) => {
  try {
    const { locationText } = req.body;
    if (!locationText || typeof locationText !== 'string' || !locationText.trim()) {
      return res.status(400).json({ message: "Location text description is required" });
    }

    // UPGRADE: Explicitly select 'description' to provide deep context strings to the model
    const inventory = await Product.find({ category: { $ne: "Gear" } })
      .select("name category specs description")
      .limit(50)
      .lean();
      
    // UPGRADE: Embedded the new descriptive metadata strings down inside the mapping engine array loop
    const inventoryList = inventory.map((p) => 
      `- Model Name: "${p.name}" | Bike Category: ${p.category} | Specs: ${p.specs} | Profile: ${p.description || 'Standard riding performance profile'}`
    ).join("\n");

    const prompt = `
      You are an expert motorcycle consultant and master matchmaker. A user wants to find a motorcycle from our live dealership stock for this specific environment/riding style: "${locationText.trim()}".
      
      Our live stock inventory is listed here:
      ${inventoryList}
      
      CRITICAL MATCHING RULE: 
      You must look closely at the "Bike Category", "Specs", and "Profile" of the models in the inventory list. Do NOT suggest a sport bike for mud, do NOT suggest a heavy cruiser for tight urban lane-splitting, and do NOT suggest an off-road bike for pure high-speed track racing. Match user intentions natively to the profiles provided.

      Follow these matching archetypes based on the user's terrain input:
      - Off-road / Dirt / Trails / Sand / Mud / Mountains: Prioritize bikes with an "Adventure" Bike Category, high ground clearance, dual-sport or knobby tire attributes.
      - Tight City / Heavy Traffic / Commuting / Urban Streets: Prioritize lightweight, nimble, low-to-medium displacement (cc) options like "Classic" or accessible "Sport" options.
      - Mountain passes / Twisties / Canyons: Prioritize sharp handling, pure "Sport" categories, and premium cornering power configurations.
      - Open Highways / Cruising / Long Distance: Prioritize heavy "Cruiser" machines, large displacements, and stable road attributes.

      Task 1: Deduce the specific city, region, or environment intended. Summarize its exact road surfaces, terrain hazards, and layout dynamics.
      Task 2: Evaluate the provided inventory strictly against these conditions.
      Task 3: Select exactly 3 motorcycles that structurally and mechanically fit this environment best. 

      CRITICAL RESTRICTION: You MUST choose the names EXACTLY as they appear in the inventory list above. Do not truncate names, do not invent models, and do not make generic style guesses. If no perfect match exists, pick the closest fit from the list.
    `;

    const locationSchema = {
      type: SchemaType.OBJECT,
      properties: {
        locationIdentified: { 
          type: SchemaType.STRING, 
          description: "The cleanly formatted name of the region identified (e.g., 'San Francisco, CA' or 'Alpine Passes')" 
        },
        aiReasoning: { 
          type: SchemaType.STRING, 
          description: "A 2-sentence breakdown to the customer explaining why these items balance beautifully against their terrain." 
        },
        suggestedBikeNames: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "Must contain exactly 3 strings copied EXACTLY as written from the inventory list model name attributes."
        }
      },
      required: ["locationIdentified", "aiReasoning", "suggestedBikeNames"]
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { 
        responseMimeType: "application/json",
        responseSchema: locationSchema 
      },
    });

    const result = await generateContentWithRetry(model, prompt);
    const aiData = JSON.parse(result.response.text());

    const queryFilters = aiData.suggestedBikeNames.map((name) => ({
      name: new RegExp(escapeRegex(name).trim(), "i")
    }));

    let suggestedProducts = [];
    if (queryFilters.length > 0) {
      suggestedProducts = await Product.find({ $or: queryFilters }).limit(3).lean();
    }

    if (!suggestedProducts || suggestedProducts.length === 0) {
      suggestedProducts = await Product.find({ category: { $ne: "Gear" } }).limit(3).lean();
    }

    return res.json({
      location: aiData.locationIdentified,
      aiReasoning: aiData.aiReasoning,
      products: suggestedProducts,
    });

  } catch (error) {
    console.error("Location Suggestion Error:", error);
    const status = error.status === 503 || error.status === 429 ? 503 : 500;
    return res.status(status).json({ 
      message: "Our AI assistant is temporarily offline. Please try again in a brief moment.", 
      error: error.message 
    });
  }
};

module.exports = { visualSearch, generateBundle, locationSuggestions };
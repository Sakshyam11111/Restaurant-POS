// backend/routes/aiIngredientRoutes.js
const express = require('express');
const router = express.Router();

/**
 * POST /api/ai/ingredient-analysis
 * Proxies a request to the Anthropic Claude API.
 * Body: { menuItems: [...] }
 */
router.post('/ingredient-analysis', async (req, res) => {
  const { menuItems } = req.body;

  if (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0) {
    return res.status(400).json({ status: 'error', message: 'menuItems array is required' });
  }

  const summary = menuItems
    .map(
      (i) =>
        `• ${i.name} (Category: ${i.category || 'N/A'}, Group: ${i.menuGroup || 'N/A'}${
          i.addOns ? `, AddOns: ${i.addOns}` : ''
        })`
    )
    .join('\n');

  const systemPrompt = `You are a professional restaurant chef. Given menu items, identify ALL ingredients needed. Return ONLY valid JSON with no markdown, no code fences, no preamble:
{"ingredients":[{"name":"ingredient (lowercase singular)","usedIn":["dish"],"priority":"critical|high|medium|low","estimatedQtyPerService":"e.g. 100g","aiReason":"why needed (max 6 words)","aiNote":"practical tip (max 15 words)"}],"summary":"one sentence"}
Priority: critical=>60% dishes, high=>40% or essential, medium=>2+ dishes, low=>1 dish. Be exhaustive.`;

  const userMessage = `Analyze these ${menuItems.length} menu items:\n\n${summary}`;

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error('Anthropic API error:', errText);
      return res.status(502).json({ status: 'error', message: 'AI service error: ' + errText });
    }

    const data = await anthropicRes.json();
    const text = data.content?.[0]?.text || '';

    // Strip any accidental markdown fences
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json({ status: 'success', data: parsed });
  } catch (err) {
    console.error('AI ingredient analysis error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to analyse ingredients: ' + err.message,
    });
  }
});

module.exports = router;
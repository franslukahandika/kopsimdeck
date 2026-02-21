export default async function handler(req, res) {
  try {
    const { prompt, base64Image } = req.body;

    const parts = [];

    // Jika edit image
    if (base64Image) {
      const match = base64Image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }

    parts.push({
      text: base64Image
        ? `Edit this image based on the following instruction: ${prompt}. Maintain professional investor deck style. Cinematic lighting, realistic, 4k.`
        : `High-quality professional photography for a strategic investor deck. ${prompt}. Cinematic lighting, realistic, 4k.`,
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-image:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts }],
        }),
      }
    );

    const data = await response.json();

    const imagePart =
      data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (imagePart?.inlineData?.data) {
      return res.status(200).json({
        image: `data:image/png;base64,${imagePart.inlineData.data}`,
      });
    }

    res.status(500).json({ error: "No image returned" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
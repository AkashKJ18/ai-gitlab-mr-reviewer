const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateAIReview(changes) {
  const files = changes.map(c => `File: ${c.file}\nDiff:\n${c.diff}`).join('\n\n');

  const prompt = `
You are a senior software engineer reviewing a GitLab Merge Request.

The developer has made the following changes:
${files}

Please review this MR and provide:
- Code quality feedback
- Bug risks
- Suggested improvements
- Security vulnerabilities (if any)

Your feedback should be short, constructive, and in markdown.
  `;

  const model = genAI.getGenerativeModel({ model: `${process.env.MODEL}` });
  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

module.exports = { generateAIReview };

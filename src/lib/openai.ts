import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

// Validate API key format (basic validation)
const isValidApiKey = apiKey && apiKey.startsWith('sk-') && apiKey.length > 20;

// Create OpenAI instance with or without key
const openai = new OpenAI({
  apiKey: isValidApiKey ? apiKey : undefined,
});

// Add validation method for external use
export const isOpenAIConfigured = () => {
  return isValidApiKey;
};

export default openai;
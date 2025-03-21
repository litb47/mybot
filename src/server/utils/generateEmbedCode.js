const fs = require('fs');
const path = require('path');

/**
 * Generate embed code for a project
 * @param {string} apiKey - The project's API key
 * @param {string} apiUrl - The base URL of the API
 * @returns {string} - JavaScript embed code
 */
const generateEmbedCode = (apiKey, apiUrl) => {
  try {
    // Read the chatbot template file
    const templatePath = path.join(__dirname, '../../client/chatbot.js');
    const template = fs.readFileSync(templatePath, 'utf-8');
    
    // Replace placeholders with actual values
    const embedCode = template
      .replace(/{{API_KEY}}/g, apiKey)
      .replace(/{{API_URL}}/g, apiUrl);
    
    // Generate the embed script tag
    return `<script>
${embedCode}
</script>`;
  } catch (error) {
    console.error('Error generating embed code:', error);
    return '';
  }
};

/**
 * Generate minimal embed code for a project (minified version for production)
 * @param {string} apiKey - The project's API key
 * @param {string} apiUrl - The base URL of the API
 * @returns {string} - JavaScript embed code
 */
const generateMinimalEmbedCode = (apiKey, apiUrl) => {
  try {
    return `<script src="${apiUrl}/chatbot.js?key=${apiKey}" async></script>`;
  } catch (error) {
    console.error('Error generating minimal embed code:', error);
    return '';
  }
};

module.exports = {
  generateEmbedCode,
  generateMinimalEmbedCode
}; 
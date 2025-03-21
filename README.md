# Interactive FAQ Chatbot

A complete solution for adding an interactive FAQ chatbot to any website. This system includes both the backend API, admin console, and an embeddable widget script.

## Features

- **FAQ Management**: Add, edit, and delete questions and answers through an admin console
- **Multilingual Support**: Native support for English and Hebrew
- **Statistics & Tracking**: Track the most commonly asked questions and view question history
- **Customizable Appearance**: Control colors, fonts, icon, and positioning of the chat interface
- **Simple Integration**: Add to any website with a single line of JavaScript code

## System Components

1. **Backend API**: Node.js + Express + MongoDB
2. **Admin Console**: React-based web interface for managing FAQ content and viewing statistics
3. **Chatbot Widget**: Lightweight JavaScript widget that can be embedded on any website

## Requirements

- Node.js (v14+)
- MongoDB
- NPM or Yarn

## Getting Started

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/faq-chatbot.git
cd faq-chatbot
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/faqchatbot
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

4. Start the development server
```bash
npm run dev
```

### Adding the Chatbot to a Website

After creating a project in the admin console, you'll receive an embed code that looks like this:

```html
<script src="https://your-api-url.com/chatbot.js?key=YOUR_API_KEY" async></script>
```

Add this script to any HTML page where you want the chatbot to appear.

## License

ISC 
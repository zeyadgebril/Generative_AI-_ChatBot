# Chat_Bot Documentation

## Overview

Chat_Bot is a floating web-based chatbot widget inspired by ChatGPT. It appears as an icon in the bottom-right corner and expands into a chat window with a human-like avatar when clicked. It communicates with the Groq API and supports animated typing, message history, and rate limiting.

## Features

- Floating chat icon, expands to a chat window on click.
- Animated SVG avatar for the bot.
- Scrollable, fixed-size chat window.
- Message history is preserved during the session.
- Rate limiting: max 5 messages per 30 seconds.
- Animated typing indicator.
- Responsive design for desktop and mobile.
- Error handling for network/API issues.

## How It Works

1. **UI Structure**
    - The chat icon (`#chatIcon`) is always visible at the bottom-right.
    - Clicking the icon shows the chat window (`.chat-container`), which contains:
        - Header with bot avatar and close button.
        - Scrollable messages area.
        - Input area for user messages.

2. **Message Flow**
    - User types a message and submits.
    - The message is added to the chat and appended to the `chatHistory` array.
    - A POST request is sent to `https://api.groq.com/openai/v1/chat/completions` with:
        - Headers: `Content-Type: application/json`, `Authorization: Bearer ...`
        - Body: `{ model: "...", messages: chatHistory }`
    - While waiting, a typing animation is shown.
    - On response, the bot's reply is displayed and added to the chat history.

3. **Rate Limiting**
    - Users can send up to 5 messages per 30 seconds.
    - If exceeded, a warning is shown and sending is temporarily disabled.

4. **Styling and Animation**
    - All styles are in `Task2_ChatBot.css`.
    - The chat window and icon use transitions and SVG for a modern look.
    - The bot's messages include a human-like SVG avatar.

5. **Code Structure**
    - `Task2_ChatBot.html`: Main HTML structure, links CSS/JS.
    - `Task2_ChatBot.css`: All styles for the chat widget.
    - `Task2_ChatBot.js`: All logic for chat, API calls, rate limiting, and UI behavior.

## Usage

1. Place all three files in the same directory.
2. Open `Task2_ChatBot.html` in a browser.
3. Click the chat icon to start chatting!

## API

- **Endpoint:** `https://api.groq.com/openai/v1/chat/completions`
- **Headers:**
    - `Content-Type: application/json`
    - `Authorization: Bearer <your-token>`
- **Body Example:**
    ```json
    {
      "model": "meta-llama/llama-4-scout-17b-16e-instruct",
      "messages": [
        { "role": "user", "content": "Hi" }
      ]
    }
    ```

## Customization

- You can change the avatar SVG in the HTML and JS for a different look.
- Adjust rate limiting by changing `RATE_LIMIT` and `RATE_WINDOW` in the JS file.
- Modify styles in the CSS file as needed.

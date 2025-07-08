      // --- Animated Background Particles ---
      function createParticles() {
        const particles = document.getElementById("particles");
        for (let i = 0; i < 30; i++) {
          const particle = document.createElement("div");
          particle.className = "particle";
          particle.style.left = Math.random() * 100 + "%";
          particle.style.top = Math.random() * 100 + "%";
          particle.style.animationDelay = Math.random() * 8 + "s";
          particle.style.animationDuration = Math.random() * 3 + 5 + "s";
          particles.appendChild(particle);
        }
      }

      // --- Chat State ---
      const messagesDiv = document.getElementById("messages");
      const chatForm = document.getElementById("chatForm");
      const userInput = document.getElementById("userInput");
      const sendBtn = document.getElementById("sendBtn");
      const rateLimitMsg = document.getElementById("rateLimitMsg");
      const chatIcon = document.getElementById("chatIcon");
      const chatContainer = document.getElementById("chatContainer");
      const closeChat = document.getElementById("closeChat");

      let chatHistory = [];
      let lastSentTimes = [];
      const RATE_LIMIT = 5;
      const RATE_WINDOW = 30 * 1000;

      // --- Utility Functions ---
      function addMessage(role, content) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "message " + (role === "user" ? "user" : "bot");

        if (role === "bot") {
          msgDiv.innerHTML = `
                    <div class="bubble">
                        <svg viewBox="0 0 24 24" width="24" height="24" class="animated-svg">
                            <circle cx="12" cy="8" r="4" fill="#2563eb"/>
                            <path d="M12 14c-4 0-6 2-6 4v2h12v-2c0-2-2-4-6-4z" fill="#2563eb" opacity="0.7"/>
                            <circle cx="10" cy="7" r="0.5" fill="white"/>
                            <circle cx="14" cy="7" r="0.5" fill="white"/>
                            <path d="M10 9.5c0.5 0.5 1 0.5 2 0.5s1.5 0 2-0.5" stroke="white" stroke-width="0.5" fill="none"/>
                        </svg>
                        <span>${content}</span>
                    </div>
                `;
        } else {
          msgDiv.innerHTML = `
                    <div class="bubble">
                        <span>${content}</span>
                    </div>
                `;
        }

        messagesDiv.appendChild(msgDiv);
        setTimeout(() => {
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 100);
      }

      function showTyping() {
        const typingDiv = document.createElement("div");
        typingDiv.className = "message bot typing";
        typingDiv.id = "typingIndicator";
        typingDiv.innerHTML = `
                <div class="bubble">
                    <svg viewBox="0 0 24 24" width="24" height="24" class="animated-svg">
                        <circle cx="12" cy="8" r="4" fill="#2563eb"/>
                        <path d="M12 14c-4 0-6 2-6 4v2h12v-2c0-2-2-4-6-4z" fill="#2563eb" opacity="0.7"/>
                        <circle cx="10" cy="7" r="0.5" fill="white"/>
                        <circle cx="14" cy="7" r="0.5" fill="white"/>
                        <path d="M10 9.5c0.5 0.5 1 0.5 2 0.5s1.5 0 2-0.5" stroke="white" stroke-width="0.5" fill="none"/>
                    </svg>
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
            `;
        messagesDiv.appendChild(typingDiv);
        setTimeout(() => {
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }, 100);
      }

      function removeTyping() {
        const typingDiv = document.getElementById("typingIndicator");
        if (typingDiv) typingDiv.remove();
      }

      function showRateLimit(msg) {
        rateLimitMsg.textContent = msg;
        rateLimitMsg.style.display = "";
      }

      function hideRateLimit() {
        rateLimitMsg.style.display = "none";
      }

      // --- Rate Limiting ---
      function canSend() {
        const now = Date.now();
        lastSentTimes = lastSentTimes.filter((t) => now - t < RATE_WINDOW);
        return lastSentTimes.length < RATE_LIMIT;
      }

      function recordSend() {
        lastSentTimes.push(Date.now());
      }

      // --- Chat Logic ---
      chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideRateLimit();

        if (!canSend()) {
          showRateLimit(
            "You're sending messages too quickly. Please wait a few seconds..."
          );
          sendBtn.disabled = true;
          setTimeout(() => {
            sendBtn.disabled = false;
            hideRateLimit();
          }, 3000);
          return;
        }

        const userMsg = userInput.value.trim();
        if (!userMsg) return;

        addMessage("user", userMsg);
        chatHistory.push({ role: "user", content: userMsg });
        userInput.value = "";
        sendBtn.disabled = true;
        recordSend();

        showTyping();

        try {
          const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization:
                "Bearer API_KEY_HERE", // Replace with your actual API key
              },
              body: JSON.stringify({
                model: "meta-llama/llama-4-scout-17b-16e-instruct",
                messages: chatHistory,
              }),
            }
          );

          removeTyping();

          if (!response.ok) {
            addMessage("bot", "Sorry, there was an error. Please try again.");
            sendBtn.disabled = false;
            return;
          }

          const data = await response.json();
          const botMsg =
            data.choices?.[0]?.message?.content ||
            "Sorry, I didn't understand that.";
          addMessage("bot", botMsg);
          chatHistory.push({ role: "assistant", content: botMsg });
        } catch (err) {
          removeTyping();
          addMessage("bot", "Network error. Please check your connection.");
        }
        sendBtn.disabled = false;
      });

      // --- Floating Icon and Chat Window Logic ---
      chatIcon.addEventListener("click", () => {
        chatContainer.classList.add("open");
        chatIcon.style.display = "none";
        setTimeout(() => userInput.focus(), 300);
      });

      closeChat.addEventListener("click", () => {
        chatContainer.classList.remove("open");
        chatIcon.style.display = "";
      });

      // --- Initialize ---
      window.onload = () => {
        createParticles();
        if (chatContainer.classList.contains("open")) {
          userInput.focus();
        }
      };
// Flip Card Memory Game - Home Screen JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Get all topic cards
  const topicCards = document.querySelectorAll(".topic-card");

  // Add click/tap event listeners to each card
  topicCards.forEach((card) => {
    // Handle click events
    card.addEventListener("click", handleCardClick);

    // Handle keyboard events for accessibility
    card.addEventListener("keydown", handleKeyPress);

    // Add touch feedback for mobile devices
    card.addEventListener("touchstart", handleTouchStart, { passive: true });
    card.addEventListener("touchend", handleTouchEnd, { passive: true });
  });

  // Handle card click/tap
  function handleCardClick(event) {
    const topic = event.currentTarget.dataset.topic;
    if (topic) {
      // Add visual feedback
      addClickFeedback(event.currentTarget);

      // Navigate to the game (placeholder for now)
      navigateToGame(topic);
    }
  }

  // Handle keyboard navigation
  function handleKeyPress(event) {
    // Handle Enter and Space key presses
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick(event);
    }
  }

  // Handle touch start for mobile feedback
  function handleTouchStart(event) {
    event.currentTarget.classList.add("touch-active");
  }

  // Handle touch end
  function handleTouchEnd(event) {
    event.currentTarget.classList.remove("touch-active");
  }

  // Add visual feedback for clicks
  function addClickFeedback(card) {
    // Add a ripple effect
    const ripple = document.createElement("div");
    ripple.classList.add("ripple-effect");
    card.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  // Navigate to game
  function navigateToGame(topic) {
    // Navigate to the game screen with the selected topic
    window.location.href = `game.html?topic=${topic}`;
  }

  // Show a modal indicating the game selection
  function showGameModal(topic) {
    // Create modal overlay
    const modalOverlay = document.createElement("div");
    modalOverlay.classList.add("modal-overlay");
    modalOverlay.setAttribute("role", "dialog");
    modalOverlay.setAttribute("aria-modal", "true");
    modalOverlay.setAttribute("aria-labelledby", "modal-title");

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const modalTitle = document.createElement("h2");
    modalTitle.id = "modal-title";
    modalTitle.textContent = `${
      topic.charAt(0).toUpperCase() + topic.slice(1)
    } Memory Game`;

    const modalMessage = document.createElement("p");
    modalMessage.textContent = `Great choice! The ${topic} memory game will start soon.`;

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.classList.add("modal-close-btn");
    closeButton.addEventListener("click", closeModal);

    // Assemble modal
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalMessage);
    modalContent.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);

    // Add to page
    document.body.appendChild(modalOverlay);

    // Focus management for accessibility
    closeButton.focus();

    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Close modal function
    function closeModal() {
      document.body.removeChild(modalOverlay);
      document.removeEventListener("keydown", handleEscape);

      // Return focus to the clicked card
      const clickedCard = document.querySelector(`[data-topic="${topic}"]`);
      if (clickedCard) {
        clickedCard.focus();
      }
    }

    // Close on overlay click
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Add CSS for ripple effect and modal (injected dynamically)
  const style = document.createElement("style");
  style.textContent = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .touch-active {
            transform: scale(0.95);
        }
        
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 400px;
            margin: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        }
        
        .modal-content h2 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.8rem;
        }
        
        .modal-content p {
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1rem;
            line-height: 1.5;
        }
        
        .modal-close-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        
        .modal-close-btn:hover {
            transform: translateY(-2px);
        }
        
        .modal-close-btn:focus {
            outline: 3px solid rgba(102, 126, 234, 0.5);
            outline-offset: 2px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;
  document.head.appendChild(style);

  // Add some fun interactive elements
  addFloatingElements();

  function addFloatingElements() {
    // Create floating background elements for extra visual interest
    for (let i = 0; i < 6; i++) {
      const element = document.createElement("div");
      element.classList.add("floating-element");
      element.style.cssText = `
                position: fixed;
                width: ${Math.random() * 20 + 10}px;
                height: ${Math.random() * 20 + 10}px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                pointer-events: none;
                z-index: -1;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s infinite linear;
            `;
      document.body.appendChild(element);
    }

    // Add floating animation
    const floatStyle = document.createElement("style");
    floatStyle.textContent = `
            @keyframes float {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
    document.head.appendChild(floatStyle);
  }
});

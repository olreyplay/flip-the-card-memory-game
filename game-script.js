// Flip Card Memory Game - Game Logic

class MemoryGame {
  constructor() {
    this.topic = this.getTopicFromURL();
    this.emojis = this.getEmojisForTopic(this.topic);
    this.funFacts = this.getFunFactsForTopic(this.topic);
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moveCount = 0;
    this.startTime = Date.now();
    this.gameStarted = false;
    this.currentFactIndex = 0;
    this.shuffledFacts = [];

    this.initializeGame();
    this.setupEventListeners();
  }

  // Get topic from URL parameters
  getTopicFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("topic") || "animals";
  }

  // Get emojis for the selected topic
  getEmojisForTopic(topic) {
    const emojiSets = {
      animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯"],
      fruits: ["🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍑", "🍒", "🥝"],
      space: ["🌙", "⭐", "🌟", "💫", "☄️", "🪐", "🌍", "🌎", "🌏", "🚀"],
    };
    return emojiSets[topic] || emojiSets.animals;
  }

  // Get fun facts for the selected topic
  getFunFactsForTopic(topic) {
    const factSets = {
      animals: [
        "Dolphins have names for each other and can recognize themselves in mirrors!",
        "A group of flamingos is called a 'flamboyance' - how fancy!",
        "Octopuses have three hearts and blue blood - they're like underwater aliens!",
        "A kangaroo can't hop backwards - they can only move forward!",
        "Butterflies taste with their feet - imagine walking on your dinner!",
        "Elephants are the only animals that can't jump - they're too heavy!",
        "A snail can sleep for up to 3 years - talk about a long nap!",
        "Penguins can jump as high as 6 feet in the air - they're amazing athletes!",
        "A group of owls is called a 'parliament' - very wise indeed!",
        "Cats spend 70% of their lives sleeping - they're the ultimate nap champions!",
      ],
      fruits: [
        "Bananas are berries, but strawberries aren't - nature is full of surprises!",
        "Apples float in water because 25% of their volume is air!",
        "Pineapples take 2-3 years to grow - patience is a virtue!",
        "Grapes can explode in the microwave - don't try this at home!",
        "Oranges were originally green - they turn orange in cold weather!",
        "Watermelons are 92% water - they're basically nature's water bottles!",
        "Strawberries are the only fruit with seeds on the outside!",
        "Lemons contain more sugar than strawberries - but they taste sour!",
        "Avocados are actually berries and are related to cinnamon!",
        "Cherries can help you sleep better - they contain natural melatonin!",
      ],
      space: [
        "One day on Venus is longer than one year on Venus - time is weird in space!",
        "There are more stars in the universe than grains of sand on Earth!",
        "The Sun is so big that 1 million Earths could fit inside it!",
        "A day on Mars is almost the same length as a day on Earth - 24 hours and 37 minutes!",
        "Jupiter has a storm that's been raging for over 300 years - the Great Red Spot!",
        "The Moon is moving away from Earth at 3.8 cm per year - it's slowly leaving us!",
        "Saturn's moon Titan has lakes and rivers made of liquid methane!",
        "A year on Mercury is only 88 Earth days - it zooms around the Sun super fast!",
        "Neptune has the fastest winds in the solar system - up to 1,200 mph!",
        "The International Space Station travels at 17,500 mph - that's 5 miles per second!",
      ],
    };
    return factSets[topic] || factSets.animals;
  }

  // Initialize the game
  initializeGame() {
    this.updateTopicDisplay();
    this.shuffleFacts();
    this.createCards();
    this.renderCards();
    this.updateStats();
  }

  // Shuffle fun facts for random order
  shuffleFacts() {
    this.shuffledFacts = [...this.funFacts];
    for (let i = this.shuffledFacts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledFacts[i], this.shuffledFacts[j]] = [
        this.shuffledFacts[j],
        this.shuffledFacts[i],
      ];
    }
    this.currentFactIndex = 0;
  }

  // Update the topic display in the header
  updateTopicDisplay() {
    const topicDisplay = document.getElementById("topicDisplay");
    const topicNames = {
      animals: "Animals Memory Game",
      fruits: "Fruits Memory Game",
      space: "Space Memory Game",
    };
    topicDisplay.textContent = topicNames[this.topic] || "Memory Game";
  }

  // Create card data
  createCards() {
    this.cards = [];

    // Create pairs of cards
    for (let i = 0; i < this.emojis.length; i++) {
      const emoji = this.emojis[i];
      // Add two cards for each emoji (pair)
      this.cards.push({ id: i * 2, emoji, isFlipped: false, isMatched: false });
      this.cards.push({
        id: i * 2 + 1,
        emoji,
        isFlipped: false,
        isMatched: false,
      });
    }

    // Shuffle the cards
    this.shuffleCards();
  }

  // Shuffle cards using Fisher-Yates algorithm
  shuffleCards() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  // Render cards on the page
  renderCards() {
    const cardsGrid = document.getElementById("cardsGrid");
    cardsGrid.innerHTML = "";

    this.cards.forEach((card, index) => {
      const cardElement = this.createCardElement(card, index);
      cardsGrid.appendChild(cardElement);
    });
  }

  // Create individual card element
  createCardElement(card, index) {
    const cardDiv = document.createElement("button");
    cardDiv.className = "memory-card";
    cardDiv.dataset.cardId = card.id;
    cardDiv.dataset.index = index;
    cardDiv.setAttribute("aria-label", `Card ${index + 1}, click to flip`);

    // Card back
    const cardBack = document.createElement("div");
    cardBack.className = "card-face card-back";
    cardDiv.appendChild(cardBack);

    // Card front
    const cardFront = document.createElement("div");
    cardFront.className = "card-face card-front";
    cardFront.textContent = card.emoji;
    cardDiv.appendChild(cardFront);

    // Add click event
    cardDiv.addEventListener("click", () => this.handleCardClick(index));

    // Add keyboard support
    cardDiv.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.handleCardClick(index);
      }
    });

    return cardDiv;
  }

  // Handle card click
  handleCardClick(index) {
    const card = this.cards[index];

    // Don't allow clicking if card is already flipped or matched
    if (card.isFlipped || card.isMatched) {
      return;
    }

    // Don't allow more than 2 cards to be flipped at once
    if (this.flippedCards.length >= 2) {
      return;
    }

    // Start the game timer on first move
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.startTime = Date.now();
    }

    // Flip the card
    this.flipCard(index);
    this.flippedCards.push(index);

    // Check for match if two cards are flipped
    if (this.flippedCards.length === 2) {
      this.moveCount++;
      this.updateStats();

      setTimeout(() => {
        this.checkForMatch();
      }, 1000);
    }
  }

  // Flip a card
  flipCard(index) {
    const card = this.cards[index];
    const cardElement = document.querySelector(`[data-index="${index}"]`);

    card.isFlipped = true;
    cardElement.classList.add("flipped");
    cardElement.setAttribute(
      "aria-label",
      `Card ${index + 1}, showing ${card.emoji}`
    );
  }

  // Check if the two flipped cards match
  checkForMatch() {
    const [index1, index2] = this.flippedCards;
    const card1 = this.cards[index1];
    const card2 = this.cards[index2];

    if (card1.emoji === card2.emoji) {
      // Match found!
      this.handleMatch(index1, index2);
    } else {
      // No match, flip cards back
      this.flipCardsBack(index1, index2);
    }

    // Clear flipped cards array
    this.flippedCards = [];
  }

  // Handle a successful match
  handleMatch(index1, index2) {
    const card1 = this.cards[index1];
    const card2 = this.cards[index2];

    // Mark cards as matched
    card1.isMatched = true;
    card2.isMatched = true;

    // Add visual feedback
    const cardElement1 = document.querySelector(`[data-index="${index1}"]`);
    const cardElement2 = document.querySelector(`[data-index="${index2}"]`);

    cardElement1.classList.add("matched");
    cardElement2.classList.add("matched");

    // Update match count
    this.matchedPairs++;
    this.updateStats();

    // Show fun fact popup
    this.showFunFact();

    // Check if game is complete (this will be handled after the fun fact)
    if (this.matchedPairs === this.emojis.length) {
      // The win modal will be shown after the last fun fact
    }
  }

  // Flip cards back when no match
  flipCardsBack(index1, index2) {
    const card1 = this.cards[index1];
    const card2 = this.cards[index2];

    // Reset card state
    card1.isFlipped = false;
    card2.isFlipped = false;

    // Remove visual classes
    const cardElement1 = document.querySelector(`[data-index="${index1}"]`);
    const cardElement2 = document.querySelector(`[data-index="${index2}"]`);

    cardElement1.classList.remove("flipped");
    cardElement2.classList.remove("flipped");

    // Reset aria labels
    cardElement1.setAttribute(
      "aria-label",
      `Card ${index1 + 1}, click to flip`
    );
    cardElement2.setAttribute(
      "aria-label",
      `Card ${index2 + 1}, click to flip`
    );
  }

  // Update game statistics
  updateStats() {
    document.getElementById("moveCount").textContent = this.moveCount;
    document.getElementById(
      "matchCount"
    ).textContent = `${this.matchedPairs}/${this.emojis.length}`;
  }

  // Show fun fact popup
  showFunFact() {
    const funFactModal = document.getElementById("funFactModal");
    const funFactText = document.getElementById("funFactText");
    const funFactProgress = document.getElementById("funFactProgress");
    const funFactEmoji = document.getElementById("funFactEmoji");

    // Get current fact
    const currentFact = this.shuffledFacts[this.currentFactIndex];
    const factNumber = this.currentFactIndex + 1;

    // Update content
    funFactText.textContent = currentFact;
    funFactProgress.textContent = `${factNumber} of 10`;

    // Set topic-appropriate emoji
    const topicEmojis = {
      animals: ["🐾", "🦄", "🌟", "✨", "🎯", "💫", "🌈", "🎪", "🎨", "🎭"],
      fruits: ["🍓", "🌟", "✨", "🎯", "💫", "🌈", "🎪", "🎨", "🎭", "🎊"],
      space: ["🚀", "🌟", "✨", "🎯", "💫", "🌈", "🎪", "🎨", "🎭", "🎊"],
    };
    const emojiSet = topicEmojis[this.topic] || topicEmojis.animals;
    funFactEmoji.textContent =
      emojiSet[this.currentFactIndex % emojiSet.length];

    // Show modal
    funFactModal.style.display = "flex";

    // Focus management
    const okButton = document.getElementById("funFactOkButton");
    okButton.focus();

    // Pause game interactions
    this.pauseGame();
  }

  // Hide fun fact popup
  hideFunFact() {
    const funFactModal = document.getElementById("funFactModal");
    funFactModal.style.display = "none";

    // Resume game interactions
    this.resumeGame();

    // Move to next fact
    this.currentFactIndex++;

    // Check if this was the last fact and game is complete
    if (this.matchedPairs === this.emojis.length) {
      setTimeout(() => {
        this.showWinModal();
      }, 300);
    }
  }

  // Pause game interactions
  pauseGame() {
    const cards = document.querySelectorAll(".memory-card");
    cards.forEach((card) => {
      card.style.pointerEvents = "none";
    });

    const buttons = document.querySelectorAll(".control-button");
    buttons.forEach((button) => {
      button.style.pointerEvents = "none";
    });
  }

  // Resume game interactions
  resumeGame() {
    const cards = document.querySelectorAll(".memory-card");
    cards.forEach((card) => {
      card.style.pointerEvents = "auto";
    });

    const buttons = document.querySelectorAll(".control-button");
    buttons.forEach((button) => {
      button.style.pointerEvents = "auto";
    });
  }

  // Show win modal
  showWinModal() {
    const winModal = document.getElementById("winModal");
    const finalMoves = document.getElementById("finalMoves");
    const finalTime = document.getElementById("finalTime");

    // Calculate final time
    const endTime = Date.now();
    const totalTime = Math.floor((endTime - this.startTime) / 1000);
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    // Update modal content
    finalMoves.textContent = this.moveCount;
    finalTime.textContent = timeString;

    // Show modal
    winModal.style.display = "flex";

    // Focus management
    const playAgainButton = document.getElementById("playAgainButton");
    playAgainButton.focus();
  }

  // Restart the game
  restartGame() {
    this.matchedPairs = 0;
    this.moveCount = 0;
    this.flippedCards = [];
    this.gameStarted = false;
    this.startTime = Date.now();
    this.currentFactIndex = 0;

    // Reset all cards
    this.cards.forEach((card) => {
      card.isFlipped = false;
      card.isMatched = false;
    });

    // Shuffle facts and cards
    this.shuffleFacts();
    this.shuffleCards();
    this.renderCards();
    this.updateStats();
  }

  // Shuffle cards (keep current game state)
  shuffleCardsOnly() {
    // Only shuffle unmatched cards
    const unmatchedCards = this.cards.filter((card) => !card.isMatched);
    const matchedCards = this.cards.filter((card) => card.isMatched);

    // Shuffle unmatched cards
    for (let i = unmatchedCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unmatchedCards[i], unmatchedCards[j]] = [
        unmatchedCards[j],
        unmatchedCards[i],
      ];
    }

    // Reset flipped state for unmatched cards
    unmatchedCards.forEach((card) => {
      card.isFlipped = false;
    });

    // Recombine cards
    this.cards = [...matchedCards, ...unmatchedCards];
    this.flippedCards = [];

    // Re-render
    this.renderCards();
  }

  // Setup event listeners
  setupEventListeners() {
    // Back button
    const backButton = document.querySelector(".back-button");
    backButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });

    // Restart button
    const restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", () => {
      this.restartGame();
    });

    // Shuffle button
    const shuffleButton = document.getElementById("shuffleButton");
    shuffleButton.addEventListener("click", () => {
      this.shuffleCardsOnly();
    });

    // Fun fact modal button
    const funFactOkButton = document.getElementById("funFactOkButton");
    funFactOkButton.addEventListener("click", () => {
      this.hideFunFact();
    });

    // Win modal buttons
    const playAgainButton = document.getElementById("playAgainButton");
    playAgainButton.addEventListener("click", () => {
      document.getElementById("winModal").style.display = "none";
      this.restartGame();
    });

    const goHomeButton = document.getElementById("goHomeButton");
    goHomeButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });

    // Close modal on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const funFactModal = document.getElementById("funFactModal");
        const winModal = document.getElementById("winModal");

        if (funFactModal.style.display === "flex") {
          this.hideFunFact();
        } else if (winModal.style.display === "flex") {
          winModal.style.display = "none";
        }
      }
    });

    // Close modal on overlay click
    const funFactModal = document.getElementById("funFactModal");
    funFactModal.addEventListener("click", (e) => {
      if (e.target === funFactModal) {
        this.hideFunFact();
      }
    });

    const winModal = document.getElementById("winModal");
    winModal.addEventListener("click", (e) => {
      if (e.target === winModal) {
        winModal.style.display = "none";
      }
    });
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new MemoryGame();
});

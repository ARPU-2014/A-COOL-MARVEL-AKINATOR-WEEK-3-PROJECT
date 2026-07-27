const chatWindow = document.getElementById('chatWindow');
const jokeForm = document.getElementById('jokeForm');
const promptInput = document.getElementById('promptInput');
const emojiLayer = document.getElementById('emojiLayer');
const quickPrompts = document.querySelectorAll('.chip');

const emojis = ['😂', '🤣', '😆', '😄', '🤪', '🤭', '🥳', '🙌', '✨', '🎉'];

function addBubble(text, sender = 'bot') {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${sender}`;
  bubble.innerHTML = `<strong>${sender === 'user' ? 'You' : 'Bot'}:</strong><span>${text}</span>`;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTyping() {
  const typing = document.createElement('div');
  typing.className = 'bubble bot';
  typing.innerHTML = '<strong>Bot:</strong><span class="typing"><span></span><span></span><span></span></span>';
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function createBurst(count = 18) {
  for (let i = 0; i < count; i += 1) {
    const burst = document.createElement('div');
    burst.className = 'emoji-burst';
    burst.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    burst.style.left = `${Math.random() * 100}vw`;
    burst.style.top = `${Math.random() * 100}vh`;
    burst.style.fontSize = `${1.4 + Math.random() * 1.6}rem`;
    burst.style.animationDuration = `${1.8 + Math.random() * 1.4}s`;
    burst.style.opacity = '0';
    emojiLayer.appendChild(burst);

    setTimeout(() => burst.remove(), 3200);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  createBurst(24);
  setInterval(() => createBurst(8), 2200);
});

function extractTopic(prompt) {
  const cleaned = prompt
    .replace(/make me a joke( about| for| please| right now)?/gi, '')
    .replace(/tell me/i, '')
    .replace(/give me/i, '')
    .replace(/for example/i, '')
    .replace(/[?!.]/g, '')
    .trim();

  const whyMatch = cleaned.match(/why did (the\s+[^,.;]+)/i);
  if (whyMatch) {
    const topic = whyMatch[1].replace(/\bthe\b/i, '').trim();
    if (topic) {
      return topic;
    }
  }

  const aboutMatch = cleaned.match(/about\s+(.+)/i);
  if (aboutMatch) {
    return aboutMatch[1].trim();
  }

  const words = cleaned.split(/\s+/).filter(Boolean);
  const stopWords = new Set(['a', 'an', 'the', 'about', 'my', 'me', 'of', 'for', 'to', 'and', 'or', 'with', 'that', 'this', 'is', 'it', 'be', 'on', 'at', 'in', 'from', 'why', 'did', 'do', 'does', 'can', 'could', 'would', 'should', 'please', 'make', 'joke', 'funny', 'silly', 'goofy', 'real']);
  const meaningful = words.filter((word) => !stopWords.has(word.toLowerCase()));

  return meaningful.slice(0, 6).join(' ') || words.slice(0, 4).join(' ') || 'life';
}

function generateJoke(prompt) {
  const topic = extractTopic(prompt);
  const dadJokeTemplates = [
    `Absolutely — here’s a dad joke: Why did the ${topic} bring a ladder to work? Because it heard the job was on another level.`,
    `Sure — why did the ${topic} get promoted? Because it was really good at keeping things on the level.`,
    `Of course: Why did the ${topic} sit in the shade? Because it didn’t want to be a hot topic.`,
    `Haha, here you go: Why did the ${topic} go to school? Because it wanted to be a little smarter than the average ${topic}.`,
    `Absolutely: Why did the ${topic} become a musician? Because it had the perfect ${topic}-tune.`,
    `Sure — what did the ${topic} say to the other ${topic}? “You’re looking sharp today.”`,
    `Of course: Why did the ${topic} bring a pen to the party? Because it wanted to draw some attention.`,
    `Haha, here’s one: Why did the ${topic} cross the road? To prove it wasn’t chicken.`,
    `Absolutely — why did the ${topic} become a gardener? Because it wanted to grow a little more ${topic}-ture.`,
    `Sure: Why did the ${topic} become a baker? Because it kneaded the dough.`,
    `Of course: Why did the ${topic} become a comedian? Because it had a lot of good ${topic}-lines.`,
    `Haha, here’s one: Why did the ${topic} go to the doctor? Because it felt a little ${topic}-sick.`
  ];

  return dadJokeTemplates[Math.floor(Math.random() * dadJokeTemplates.length)];
}

jokeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const prompt = promptInput.value.trim();

  if (!prompt) {
    promptInput.focus();
    return;
  }

  addBubble(prompt, 'user');
  promptInput.value = '';
  showTyping();

  setTimeout(() => {
    const typingBubble = chatWindow.querySelector('.bubble.bot:last-child');
    if (typingBubble) {
      typingBubble.remove();
    }

    const joke = generateJoke(prompt);
    addBubble(joke, 'bot');
    createBurst();
  }, 900);
});

quickPrompts.forEach((chip) => {
  chip.addEventListener('click', () => {
    promptInput.value = chip.dataset.prompt;
    promptInput.focus();
  });
});

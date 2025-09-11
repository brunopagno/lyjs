const adjectives = [
  "Brave",
  "Clever",
  "Witty",
  "Loyal",
  "Kind",
  "Curious",
  "Cheerful",
  "Gentle",
  "Bright",
  "Quick",
];
const nouns = [
  "Lion",
  "Eagle",
  "Shark",
  "Tiger",
  "Wolf",
  "Falcon",
  "Panther",
  "Dragon",
  "Phoenix",
  "Leopard",
];

export function getRandomName() {
  const adjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adjective} ${noun}`;
}

export function getRandomColour() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

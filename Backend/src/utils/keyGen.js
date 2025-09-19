function randomKey(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"; // no confusing chars
  let result = "";
  for (let i = 0; i < len; i++) {
    const rand = Math.floor(Math.random() * chars.length);
    result += chars[rand];
  }
  return result;
}

async function generateUniqueKey({ isTaken, maxRetries = 5, initialLength = 6 }) {
  let length = initialLength;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const key = randomKey(length);
    if (!(await isTaken(key))) return key;
   
    if ((attempt + 1) % 2 === 0) length++;
  }
  return `${randomKey(length)}${Date.now().toString(36).slice(-2)}`;
}

module.exports = { randomKey, generateUniqueKey };

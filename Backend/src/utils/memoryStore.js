const keyToLink = new Map(); 
const idToVisits = new Map(); 

function createLink({ original, key, expiresAt }) {
  const createdAt = new Date();
  const _id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const link = { original, key, expiresAt, visits: 0, createdAt, _id };
  keyToLink.set(key, link);
  if (!idToVisits.has(_id)) idToVisits.set(_id, []);
  return link;
}

function findLinkByKey(key) {
  return keyToLink.get(key) || null;
}

function incrementVisits(link) {
  link.visits += 1;
}

function addVisit(linkId, visit) {
  const arr = idToVisits.get(linkId) || [];
  arr.push({ at: new Date(), ...visit });
  idToVisits.set(linkId, arr);
}

function getVisits(linkId) {
  const arr = idToVisits.get(linkId) || [];

  return [...arr].sort((a, b) => b.at - a.at);
}

module.exports = {
  createLink,
  findLinkByKey,
  incrementVisits,
  addVisit,
  getVisits
};





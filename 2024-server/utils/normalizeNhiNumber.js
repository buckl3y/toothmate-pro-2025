
function normalizeNhiNumber(nhiNumber) {
    let normalized = nhiNumber.toUpperCase();
    if (!normalized.startsWith('NH')) {
      normalized = `NH${normalized}`;
    }
    return normalized;
  }
  
  module.exports = normalizeNhiNumber;
  
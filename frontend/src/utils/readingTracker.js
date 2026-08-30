/**
 * Reading tracker and estimated read-time calculator
 */

// Calculate estimated reading time in minutes (based on standard 200 words/min)
export const getReadingTime = (content) => {
  if (!content) return "1 min read";

  let text = "";
  if (Array.isArray(content)) {
    text = content.join(" ");
  } else if (typeof content === "string") {
    text = content;
  } else if (typeof content === "object") {
    text = JSON.stringify(content);
  }

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

// Retrieve read item IDs from localStorage
export const getReadItems = (type = "stories") => {
  try {
    const saved = localStorage.getItem(`archive_read_${type}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn(`Failed to parse read items for ${type}:`, e);
  }
  return [];
};

// Check if an item is marked as read/visited
export const isItemRead = (type = "stories", id) => {
  if (!id) return false;
  const readList = getReadItems(type);
  return readList.includes(String(id));
};

// Mark an item as read/visited
export const markItemAsRead = (type = "stories", id) => {
  if (!id) return;
  try {
    const readList = getReadItems(type);
    const idStr = String(id);
    if (!readList.includes(idStr)) {
      const updated = [...readList, idStr];
      localStorage.setItem(`archive_read_${type}`, JSON.stringify(updated));
    }
  } catch (e) {
    console.warn(`Failed to save read status for ${type}:`, e);
  }
};

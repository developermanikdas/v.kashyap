/**
 * Formats a date timestamp into a warm, human-readable relative string.
 * Examples: "Just now", "5 minutes ago", "2 hours ago", "1 day ago", "3 days ago", "1 week ago", "2 weeks ago", "1 month ago"
 */
export const formatRelativeTime = (dateInput) => {
  if (!dateInput) return "Recently";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Recently";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // If future timestamp or within 60 seconds
  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
};

/**
 * Formats a chat timestamp into a concise, elegant string suitable for small UI indicators.
 * E.g. "Today • 2:30 PM", "Yesterday • 11:15 AM", "Aug 26 • 4:05 PM"
 */
export const formatChatDateTime = (dateInput) => {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeStr = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) {
    return `Today • ${timeStr}`;
  }
  if (isYesterday) {
    return `Yesterday • ${timeStr}`;
  }

  const isCurrentYear = date.getFullYear() === now.getFullYear();
  const dateStr = date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    ...(isCurrentYear ? {} : { year: "2-digit" }),
  });

  return `${dateStr} • ${timeStr}`;
};

/**
 * Groups chat sessions into ChatGPT-like timeframe buckets (Today, Yesterday, Previous 7 Days, Older)
 */
export const groupSessionsByTimeframe = (sessions = []) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
  const last7DaysStart = todayStart - 7 * 24 * 60 * 60 * 1000;

  const groups = {
    today: { label: "Today", items: [] },
    yesterday: { label: "Yesterday", items: [] },
    previous7Days: { label: "Previous 7 Days", items: [] },
    older: { label: "Older", items: [] },
  };

  sessions.forEach((session) => {
    const sessionTime = new Date(session.lastActivityAt || session.createdAt || session.updatedAt || Date.now()).getTime();

    if (sessionTime >= todayStart) {
      groups.today.items.push(session);
    } else if (sessionTime >= yesterdayStart) {
      groups.yesterday.items.push(session);
    } else if (sessionTime >= last7DaysStart) {
      groups.previous7Days.items.push(session);
    } else {
      groups.older.items.push(session);
    }
  });

  return [groups.today, groups.yesterday, groups.previous7Days, groups.older].filter(
    (g) => g.items.length > 0
  );
};


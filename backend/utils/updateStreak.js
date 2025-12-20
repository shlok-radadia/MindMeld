export function updateStreak(user) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!user.lastTestDate) {
    user.streak = 1;
  } else {
    const last = new Date(user.lastTestDate);
    last.setHours(0, 0, 0, 0);

    const diffDays = (today - last) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      user.streak += 1;
    } else if (diffDays > 1) {
      user.streak = 1;
    }
    
  }

  user.lastTestDate = new Date();
  user.longestStreak = Math.max(user.longestStreak, user.streak);
}
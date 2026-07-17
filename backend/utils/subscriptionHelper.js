// Returns true if a subscription should generate a delivery for the given date
const isDueToday = (subscription, today) => {
  const start = new Date(subscription.startDate);
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (today < start) return false;
  if (subscription.endDate && today > new Date(subscription.endDate)) return false;

  // Already generated today? Don't duplicate.
  if (subscription.lastDeliveryGeneratedDate) {
    const last = new Date(subscription.lastDeliveryGeneratedDate);
    last.setHours(0, 0, 0, 0);
    if (last.getTime() === today.getTime()) return false;
  }

  switch (subscription.frequency) {
    case 'daily':
      return true;

    case 'alternate_days': {
      const diffDays = Math.round((today - start) / (1000 * 60 * 60 * 24));
      return diffDays % 2 === 0;
    }

    case 'weekly': {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const todayName = dayNames[today.getDay()];
      return subscription.weeklyDays.includes(todayName);
    }

    case 'monthly': {
      return today.getDate() === start.getDate();
    }

    default:
      return false;
  }
};

module.exports = { isDueToday };
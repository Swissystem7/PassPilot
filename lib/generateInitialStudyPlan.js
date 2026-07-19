function generateInitialStudyPlan(examDate, topics, availableSlots) {
  const warnings = [];
  const plan = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let examDateObj;
  if (typeof examDate === 'string') {
    examDateObj = new Date(examDate + 'T00:00:00');
  } else {
    examDateObj = new Date(examDate);
    examDateObj.setHours(0, 0, 0, 0);
  }
  if (Number.isNaN(examDateObj.getTime())) {
    warnings.push('Exam date is in the past or today, cannot schedule');
    return { plan: [], warnings };
  }
  if (examDateObj <= now) {
    warnings.push('Exam date is in the past or today, cannot schedule');
    return { plan: [], warnings };
  }
  if (!topics || topics.length === 0) {
    warnings.push('No topics provided');
    return { plan: [], warnings };
  }
  if (!availableSlots || availableSlots.length === 0) {
    warnings.push('No available study slots');
    return { plan: [], warnings };
  }
  const validSlots = [];
  for (const slot of availableSlots) {
    if (!slot || typeof slot.day !== 'string' || !Number.isFinite(slot.startHour) || !Number.isFinite(slot.endHour) || slot.startHour < 0 || slot.endHour > 23 || slot.endHour <= slot.startHour || slot.day >= examDateObj.toISOString().slice(0,10)) {
      warnings.push(`Invalid slot on ${slot.day}: endHour (${slot.endHour}) <= startHour (${slot.startHour}), skipped`);
      continue;
    }
    validSlots.push(slot);
  }
  if (validSlots.length === 0) {
    warnings.push('No available study slots');
    return { plan: [], warnings };
  }
  const mergedSlots = {};
  for (const slot of validSlots) {
    if (!mergedSlots[slot.day]) {
      mergedSlots[slot.day] = [];
    }
    mergedSlots[slot.day].push({ start: slot.startHour, end: slot.endHour });
  }
  const daySlots = {};
  for (const day in mergedSlots) {
    const intervals = mergedSlots[day].sort((a, b) => a.start - b.start);
    const merged = [];
    let cur = intervals[0];
    for (let i = 1; i < intervals.length; i++) {
      if (intervals[i].start <= cur.end) {
        cur.end = Math.max(cur.end, intervals[i].end);
      } else {
        merged.push(cur);
        cur = intervals[i];
      }
    }
    merged.push(cur);
    daySlots[day] = merged;
  }
  const sortedDays = Object.keys(daySlots).sort();
  const totalSlotHours = sortedDays.reduce((sum, day) => {
    return sum + daySlots[day].reduce((s, interval) => s + (interval.end - interval.start), 0);
  }, 0);
  const totalEstimatedHours = topics.reduce((sum, t) => sum + t.estimatedHoursTotal, 0);
  if (totalEstimatedHours > totalSlotHours) {
    warnings.push(`Insufficient total study time; only ${totalSlotHours} of ${totalEstimatedHours} hours scheduled`);
  }
  const sortedTopics = [...topics].sort((a, b) => {
    const diffOrder = { easy: 0, medium: 1, hard: 2 };
    return diffOrder[a.difficulty] - diffOrder[b.difficulty];
  });
  const topicQueue = sortedTopics.map(t => ({
    name: t.name,
    difficulty: t.difficulty,
    totalHours: t.estimatedHoursTotal,
    remainingHours: t.estimatedHoursTotal
  }));
  let dayIndex = 0;
  let slotIndex = 0;
  let currentDay = sortedDays[0];
  let currentIntervals = daySlots[currentDay];
  let intervalIndex = 0;
  let currentStart = currentIntervals[0].start;
  let currentEnd = currentIntervals[0].end;
  let currentHour = currentStart;
  let totalScheduled = 0;
  while (topicQueue.length > 0 && dayIndex < sortedDays.length) {
    const topic = topicQueue[0];
    if (topic.remainingHours <= 0) {
      topicQueue.shift();
      continue;
    }
    if (currentHour >= currentEnd) {
      intervalIndex++;
      if (intervalIndex >= currentIntervals.length) {
        dayIndex++;
        if (dayIndex >= sortedDays.length) break;
        currentDay = sortedDays[dayIndex];
        currentIntervals = daySlots[currentDay];
        intervalIndex = 0;
        currentHour = currentIntervals[0].start;
        currentEnd = currentIntervals[0].end;
      } else {
        currentHour = currentIntervals[intervalIndex].start;
        currentEnd = currentIntervals[intervalIndex].end;
      }
      continue;
    }
    const availableHours = currentEnd - currentHour;
    const hoursToSchedule = Math.min(topic.remainingHours, availableHours);
    const roundedHours = Math.round(hoursToSchedule * 2) / 2;
    if (roundedHours <= 0) {
      currentHour = currentEnd;
      continue;
    }
    const ratio = topic.remainingHours / topic.totalHours;
    let type;
    if (ratio > 0.5) {
      type = 'review';
    } else if (ratio < 0.25) {
      type = 'practice';
    } else {
      type = 'mock';
    }
    plan.push({
      date: currentDay,
      topic: topic.name,
      hours: roundedHours,
      type: type
    });
    topic.remainingHours -= roundedHours;
    totalScheduled += roundedHours;
    currentHour += roundedHours;
    if (topic.remainingHours <= 0) {
      topicQueue.shift();
    }
  }
  plan.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.hours - b.hours;
  });
  return { plan, warnings };
}
module.exports = { generateInitialStudyPlan };

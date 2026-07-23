function generatePlanFromAvailability(availability, examDate, topics) {
  if (!Array.isArray(availability) || availability.length === 0) return [];
  if (!Array.isArray(topics) || topics.length === 0) {
    throw new Error('topics must have at least one topic');
  }

  const exam = parseIsoDate(examDate, 'examDate');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (exam <= today) throw new Error('examDate must be after today');

  const normalizedTopics = topics.map(topic => {
    if (!topic || !Number.isFinite(topic.id) || typeof topic.name !== 'string' ||
        !Number.isFinite(topic.difficulty) || topic.difficulty < 1 || topic.difficulty > 10 ||
        !Number.isFinite(topic.importance) || topic.importance < 1 || topic.importance > 10) {
      throw new TypeError('invalid topic');
    }
    return topic;
  });

  const mergedSlots = mergeSlots(availability);
  const totalMinutes = mergedSlots.reduce((sum, slot) => sum + slot.durationMinutes, 0);
  if (totalMinutes < normalizedTopics.length * 10) {
    throw new Error('Total available time is too small for a meaningful study block');
  }

  const remainingAfterMinimums = totalMinutes - normalizedTopics.length * 10;
  const totalWeight = normalizedTopics.reduce((sum, topic) => sum + topic.difficulty * topic.importance, 0);
  const allocations = normalizedTopics.map(topic => ({
    topicId: topic.id,
    durationMinutes: 10 + Math.floor(
      remainingAfterMinimums * topic.difficulty * topic.importance / totalWeight
    )
  }));
  allocations[0].durationMinutes += totalMinutes -
    allocations.reduce((sum, allocation) => sum + allocation.durationMinutes, 0);

  const queue = allocations.map(allocation => ({ ...allocation }));
  const plansByDate = new Map();
  for (const slot of mergedSlots) {
    let availableMinutes = slot.durationMinutes;
    const date = slot.start.toISOString().slice(0, 10);
    const tasks = plansByDate.get(date) || [];
    while (availableMinutes > 0 && queue.length > 0) {
      const allocation = queue[0];
      const durationMinutes = Math.min(availableMinutes, allocation.durationMinutes);
      tasks.push({ topicId: allocation.topicId, durationMinutes });
      availableMinutes -= durationMinutes;
      allocation.durationMinutes -= durationMinutes;
      if (allocation.durationMinutes === 0) queue.shift();
    }
    plansByDate.set(date, tasks);
  }

  return [...plansByDate.entries()]
    .map(([date, tasks]) => ({ date, tasks }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function mergeSlots(slots) {
  const normalized = slots.map(slot => {
    if (!slot || typeof slot.start !== 'string' || typeof slot.end !== 'string') {
      throw new TypeError('invalid availability slot');
    }
    const start = new Date(slot.start);
    const end = new Date(slot.end);
    const duration = (end - start) / 60000;
    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) ||
        duration < 15 || duration >= 24 * 60) {
      throw new RangeError('availability slot duration must be at least 15 minutes and under 24 hours');
    }
    return { start, end };
  }).sort((a, b) => a.start - b.start);

  const merged = [];
  for (const slot of normalized) {
    const previous = merged[merged.length - 1];
    if (previous && slot.start <= previous.end) {
      if (slot.end > previous.end) previous.end = slot.end;
    } else {
      merged.push({ ...slot });
    }
  }
  return merged.map(slot => ({
    ...slot,
    durationMinutes: Math.floor((slot.end - slot.start) / 60000)
  }));
}

function parseIsoDate(value, name) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new TypeError(`${name} must be an ISO date`);
  }
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime()) || date.getFullYear() !== Number(value.slice(0, 4)) ||
      date.getMonth() + 1 !== Number(value.slice(5, 7)) || date.getDate() !== Number(value.slice(8, 10))) {
    throw new TypeError(`${name} must be an ISO date`);
  }
  return date;
}

module.exports = { generatePlanFromAvailability };

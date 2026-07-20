function resolveCalendarConflicts({ calendarEvents, studyPreference }) {
  const { preferredTimeWindowStart, preferredTimeWindowEnd, sessionLengthMinutes } = studyPreference;
  const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
  if (!timeRegex.test(preferredTimeWindowStart) || !timeRegex.test(preferredTimeWindowEnd)) {
    throw new Error("Invalid time format");
  }
  const toMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };
  const windowStartMin = toMinutes(preferredTimeWindowStart);
  const windowEndMin = toMinutes(preferredTimeWindowEnd);
  if (windowStartMin >= windowEndMin) {
    throw new Error("Invalid time format");
  }
  if (!Number.isFinite(sessionLengthMinutes) || sessionLengthMinutes <= 0) {
    throw new Error("Invalid session length");
  }
  if (sessionLengthMinutes > (windowEndMin - windowStartMin)) {
    return { availableSlots: [], conflictReport: [] };
  }
  const toISODate = (iso) => iso.slice(0, 10);
  const groupByDate = {};
  for (const event of calendarEvents) {
    if (!event || !Number.isFinite(new Date(event.start).getTime()) || !Number.isFinite(new Date(event.end).getTime()) || new Date(event.end) <= new Date(event.start)) {
      throw new Error("Invalid calendar event");
    }
    const date = toISODate(event.start);
    if (!groupByDate[date]) groupByDate[date] = [];
    groupByDate[date].push(event);
  }
  const availableSlots = [];
  const conflictReport = [];
  for (const date in groupByDate) {
    const events = groupByDate[date];
    const merged = [];
    events.sort((a, b) => new Date(a.start) - new Date(b.start));
    for (const ev of events) {
      const evStart = new Date(ev.start).getTime();
      const evEnd = new Date(ev.end).getTime();
      if (merged.length === 0) {
        merged.push({ start: evStart, end: evEnd, title: ev.title });
      } else {
        const last = merged[merged.length - 1];
        if (evStart <= last.end) {
          if (evEnd > last.end) {
            last.end = evEnd;
          }
          conflictReport.push({ originalEvent: ev, resolvedBy: "merged" });
        } else {
          merged.push({ start: evStart, end: evEnd, title: ev.title });
        }
      }
    }
    const dayStart = new Date(date + 'T' + preferredTimeWindowStart);
    const dayEnd = new Date(date + 'T' + preferredTimeWindowEnd);
    let current = dayStart.getTime();
    for (const block of merged) {
      if (block.start > current) {
        const slotEnd = Math.min(block.start, dayEnd.getTime());
        const slotDuration = (slotEnd - current) / 60000;
        if (slotDuration >= sessionLengthMinutes) {
          for (let start = current; start + sessionLengthMinutes * 60000 <= slotEnd; start += sessionLengthMinutes * 60000) {
            availableSlots.push({ start: new Date(start).toISOString(), end: new Date(start + sessionLengthMinutes * 60000).toISOString() });
          }
        }
      }
      current = Math.max(current, block.end);
    }
    if (current < dayEnd.getTime()) {
      const slotDuration = (dayEnd.getTime() - current) / 60000;
      if (slotDuration >= sessionLengthMinutes) {
        for (let start = current; start + sessionLengthMinutes * 60000 <= dayEnd.getTime(); start += sessionLengthMinutes * 60000) {
          availableSlots.push({ start: new Date(start).toISOString(), end: new Date(start + sessionLengthMinutes * 60000).toISOString() });
        }
      }
    }
  }
  if (Object.keys(groupByDate).length === 0) {
    const today = new Date().toISOString().slice(0,10);
    const start = new Date(today + 'T' + preferredTimeWindowStart);
    const end = new Date(today + 'T' + preferredTimeWindowEnd);
    for (let slot = start.getTime(); slot + sessionLengthMinutes * 60000 <= end.getTime(); slot += sessionLengthMinutes * 60000) {
      availableSlots.push({ start: new Date(slot).toISOString(), end: new Date(slot + sessionLengthMinutes * 60000).toISOString() });
    }
  }
  return { availableSlots, conflictReport };
}
module.exports = { resolveCalendarConflicts };

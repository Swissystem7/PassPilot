const streakDB = new Map();

function updateStudyStreak(userId, studyDate) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(studyDate)) {
        return { currentStreak: 0, longestStreak: 0, milestonesUnlocked: [], error: 'invalid date' };
    }
    const parsedDate = new Date(studyDate + 'T00:00:00Z');
    if (isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== studyDate) {
        return { currentStreak: 0, longestStreak: 0, milestonesUnlocked: [], error: 'invalid date' };
    }
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    if (parsedDate > now) {
        return { currentStreak: 0, longestStreak: 0, milestonesUnlocked: [], error: 'future date not allowed' };
    }
    if (!streakDB.has(userId)) {
        streakDB.set(userId, { currentStreak: 0, longestStreak: 0, lastDate: null });
    }
    const user = streakDB.get(userId);
    if (user.lastDate) {
        const last = new Date(user.lastDate + 'T00:00:00Z');
        if (parsedDate < last) {
            return { currentStreak: user.currentStreak, longestStreak: user.longestStreak, milestonesUnlocked: [], error: 'cannot go back in time' };
        }
        if (parsedDate.getTime() === last.getTime()) {
            return { currentStreak: user.currentStreak, longestStreak: user.longestStreak, milestonesUnlocked: [], error: null };
        }
        const diffDays = (parsedDate - last) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
            user.currentStreak += 1;
        } else {
            user.currentStreak = 1;
        }
    } else {
        user.currentStreak = 1;
    }
    user.lastDate = studyDate;
    if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak;
    }
    const milestones = [7, 30, 100, 365];
    const unlocked = [];
    for (const m of milestones) {
        if (user.currentStreak === m) {
            unlocked.push(m.toString());
        }
    }
    return { currentStreak: user.currentStreak, longestStreak: user.longestStreak, milestonesUnlocked: unlocked, error: null };
}
module.exports = { updateStudyStreak };

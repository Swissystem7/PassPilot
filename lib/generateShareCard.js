function generateShareCard(userId, shareType) {
  const users = {
    'user1': { referralCode: 'ABC123', streak: 15, passProbability: 85, mockScore: 92, weakTopics: ['Calculus', 'Physics'] },
    'user2': { referralCode: 'XYZ789', streak: 7, passProbability: null, mockScore: 78, weakTopics: ['Chemistry'] }
  };
  const user = users[userId];
  if (!user) throw new Error('User not found');
  const validTypes = ['streak', 'pass_probability', 'mock_score', 'weak_topics'];
  if (!validTypes.includes(shareType)) throw new Error('Invalid share type');
  const referralCode = user.referralCode;
  const deepLink = `https://passpilot.app/ref?code=${referralCode}`;
  let shareText;
  switch (shareType) {
    case 'streak':
      if (user.streak === undefined || user.streak === null) throw new Error('No data available for this share type');
      shareText = `I’ve studied ${user.streak} days in a row on PassPilot! Join me and get 7 days free: ${deepLink}`;
      break;
    case 'pass_probability':
      if (user.passProbability === undefined || user.passProbability === null) throw new Error('No data available for this share type');
      shareText = `My exam pass probability is ${user.passProbability}% thanks to PassPilot! Try it for free: ${deepLink}`;
      break;
    case 'mock_score':
      if (user.mockScore === undefined || user.mockScore === null) throw new Error('No data available for this share type');
      shareText = `I scored ${user.mockScore}% on my mock exam using PassPilot! Get started: ${deepLink}`;
      break;
    case 'weak_topics':
      if (!user.weakTopics || user.weakTopics.length === 0) throw new Error('No data available for this share type');
      shareText = `PassPilot identified my weak topics in ${user.weakTopics.join(' and ')}. Start improving: ${deepLink}`;
      break;
  }
  if (shareText.length > 280) throw new Error('Share text exceeds 280 characters');
  return { shareText, deepLink };
}
module.exports = { generateShareCard };
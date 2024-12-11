const fetchLeaderboard = async (telegramId) => {
    const apiUrl = `https://api.onetime.dog/leaderboard?user_id=${telegramId}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
const userScore = responseData["me"].score;
        console.log('Leaderboard Data:', userScore);
        return responseData;
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
    }
};

const telegramId = 6137731298; 
fetchLeaderboard(telegramId);

module.exports = fetchLeaderboard;
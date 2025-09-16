/**
 * Data Service - Handles all data fetching and API calls
 * 
 * This service demonstrates clean separation of concerns and proper
 * error handling for data operations.
 * 
 * @author Lumara Team
 * @version 1.0.0
 */

class DataService {
    constructor() {
        this.baseUrl = 'https://api.lumarasports.com/v1'; // Mock API endpoint
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Generic API call method with error handling and caching
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>} API response data
     */
    async apiCall(endpoint, options = {}) {
        const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`API call failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Cache the response
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error(`API call failed for ${endpoint}:`, error);
            // Return mock data as fallback
            return this.getMockData(endpoint);
        }
    }

    /**
     * Get live sports scores
     * @returns {Promise<Array>} Array of live score objects
     */
    async getLiveScores() {
        try {
            return await this.apiCall('/scores/live');
        } catch (error) {
            console.error('Error fetching live scores:', error);
            return this.getMockLiveScores();
        }
    }

    /**
     * Get breaking news
     * @returns {Promise<Array>} Array of news objects
     */
    async getBreakingNews() {
        try {
            return await this.apiCall('/news/breaking');
        } catch (error) {
            console.error('Error fetching breaking news:', error);
            return this.getMockBreakingNews();
        }
    }

    /**
     * Get sport-specific data
     * @param {string} sport - Sport name
     * @param {string} league - League/tournament name
     * @returns {Promise<Object>} Sport data object
     */
    async getSportData(sport, league = null) {
        try {
            const endpoint = league ? `/sports/${sport}/${league}` : `/sports/${sport}`;
            return await this.apiCall(endpoint);
        } catch (error) {
            console.error(`Error fetching ${sport} data:`, error);
            return this.getMockSportData(sport, league);
        }
    }

    /**
     * Get mock data based on endpoint
     * @param {string} endpoint - API endpoint
     * @returns {Object} Mock data
     */
    getMockData(endpoint) {
        if (endpoint.includes('/scores/live')) {
            return this.getMockLiveScores();
        } else if (endpoint.includes('/news/breaking')) {
            return this.getMockBreakingNews();
        } else if (endpoint.includes('/sports/')) {
            const sport = endpoint.split('/')[2];
            const league = endpoint.split('/')[3];
            return this.getMockSportData(sport, league);
        }
        return {};
    }

    /**
     * Get mock live scores data
     * @returns {Array} Mock live scores
     */
    getMockLiveScores() {
        return [
            {
                homeTeam: 'Manchester United',
                awayTeam: 'Liverpool',
                homeScore: 2,
                awayScore: 1,
                status: 'Live 67\'',
                league: 'Premier League'
            },
            {
                homeTeam: 'Arsenal',
                awayTeam: 'Chelsea',
                homeScore: 0,
                awayScore: 0,
                status: 'HT',
                league: 'Premier League'
            },
            {
                homeTeam: 'Barcelona',
                awayTeam: 'Real Madrid',
                homeScore: 1,
                awayScore: 3,
                status: 'FT',
                league: 'La Liga'
            },
            {
                homeTeam: 'England',
                awayTeam: 'Australia',
                homeScore: 285,
                awayScore: 320,
                status: 'Day 2',
                league: 'The Ashes'
            }
        ];
    }

    /**
     * Get mock breaking news data
     * @returns {Array} Mock breaking news
     */
    getMockBreakingNews() {
        return [
            {
                title: 'Major Transfer: Star Player Signs for Premier League Club',
                summary: 'Breaking news as one of the world\'s top players completes a record-breaking transfer.',
                timestamp: new Date(Date.now() - 5 * 60 * 1000),
                category: 'Football'
            },
            {
                title: 'Cricket World Cup: Dramatic Final Over Victory',
                summary: 'Incredible finish to the World Cup final with the winning runs scored off the last ball.',
                timestamp: new Date(Date.now() - 15 * 60 * 1000),
                category: 'Cricket'
            },
            {
                title: 'Tennis: Grand Slam Record Broken',
                summary: 'Historic moment as a new record is set in professional tennis.',
                timestamp: new Date(Date.now() - 30 * 60 * 1000),
                category: 'Tennis'
            },
            {
                title: 'Olympic Games: Gold Medal for Team GB',
                summary: 'Outstanding performance secures another gold medal for Great Britain.',
                timestamp: new Date(Date.now() - 45 * 60 * 1000),
                category: 'Olympics'
            }
        ];
    }

    /**
     * Get mock sport data
     * @param {string} sport - Sport name
     * @param {string} league - League/tournament name
     * @returns {Object} Mock sport data
     */
    getMockSportData(sport, league = null) {
        switch (sport) {
            case 'football':
                return this.getMockFootballData(league);
            case 'cricket':
                return this.getMockCricketData(league);
            case 'tennis':
                return this.getMockTennisData(league);
            default:
                return {};
        }
    }

    /**
     * Get mock football data
     * @param {string} league - League name
     * @returns {Object} Mock football data
     */
    getMockFootballData(league) {
        return {
            fixtures: [
                {
                    homeTeam: 'Manchester City',
                    awayTeam: 'Tottenham',
                    kickoff: new Date(Date.now() + 2 * 60 * 60 * 1000),
                    venue: 'Etihad Stadium'
                },
                {
                    homeTeam: 'Newcastle',
                    awayTeam: 'Brighton',
                    kickoff: new Date(Date.now() + 4 * 60 * 60 * 1000),
                    venue: 'St. James\' Park'
                }
            ],
            standings: [
                { position: 1, name: 'Arsenal', played: 20, won: 15, drawn: 3, lost: 2, points: 48 },
                { position: 2, name: 'Manchester City', played: 20, won: 14, drawn: 4, lost: 2, points: 46 },
                { position: 3, name: 'Liverpool', played: 20, won: 13, drawn: 5, lost: 2, points: 44 },
                { position: 4, name: 'Chelsea', played: 20, won: 12, drawn: 6, lost: 2, points: 42 },
                { position: 5, name: 'Tottenham', played: 20, won: 11, drawn: 7, lost: 2, points: 40 }
            ]
        };
    }

    /**
     * Get mock cricket data
     * @param {string} series - Series name
     * @returns {Object} Mock cricket data
     */
    getMockCricketData(series) {
        return {
            scorecard: {
                match: 'England vs Australia - 3rd Test',
                status: 'Day 2 - Session 2',
                battingTeam: 'England',
                runs: 285,
                wickets: 4,
                overs: 78.3
            },
            stats: [
                { name: 'Joe Root', runs: 89, balls: 156, fours: 12, sixes: 1 },
                { name: 'Ben Stokes', runs: 45, balls: 78, fours: 6, sixes: 0 },
                { name: 'Jonny Bairstow', runs: 32, balls: 45, fours: 4, sixes: 0 }
            ]
        };
    }

    /**
     * Get mock tennis data
     * @param {string} tournament - Tournament name
     * @returns {Object} Mock tennis data
     */
    getMockTennisData(tournament) {
        return {
            matches: [
                {
                    player1: 'Novak Djokovic',
                    player2: 'Rafael Nadal',
                    score: '6-4, 3-6, 6-2',
                    status: 'Live - Set 3',
                    court: 'Centre Court'
                },
                {
                    player1: 'Serena Williams',
                    player2: 'Emma Raducanu',
                    score: '6-2, 6-1',
                    status: 'Completed',
                    court: 'Court 1'
                }
            ],
            rankings: [
                { rank: 1, name: 'Novak Djokovic', points: 12000, country: 'Serbia' },
                { rank: 2, name: 'Daniil Medvedev', points: 11000, country: 'Russia' },
                { rank: 3, name: 'Rafael Nadal', points: 10500, country: 'Spain' },
                { rank: 4, name: 'Stefanos Tsitsipas', points: 9500, country: 'Greece' },
                { rank: 5, name: 'Alexander Zverev', points: 9000, country: 'Germany' }
            ]
        };
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys())
        };
    }
}

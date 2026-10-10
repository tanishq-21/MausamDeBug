/**
 * Glory of Honour & Monthly State Lucky Draw Service
 * Manages authorized citizen weather reporters and random monthly ₹500 cash prize draws per state.
 */

export const INDIAN_STATES_AND_UTS = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

export const INITIAL_GLORY_REPORTERS = [
    {
        id: 'GLORY-101',
        name: 'Arjun Verma',
        city: 'Noida',
        state: 'Uttar Pradesh',
        report_title: 'Severe Waterlogging at Sector 18 Underpass',
        event_type: 'rainfall',
        credibility_score: 96,
        status: 'authorized',
        rank: 'Gold Sentinel',
        verified_date: '09 Oct 2026',
        report_id: 'MSA-2026-10138',
        upi_id: 'arjun.verma@upi',
        is_lucky_winner: true,
        prize_won: '₹500',
        badge: '🥇',
    },
    {
        id: 'GLORY-102',
        name: 'Priya Kulkarni',
        city: 'Pune',
        state: 'Maharashtra',
        report_title: 'Severe Convective Thunderstorm & Tree Fallen on FC Road',
        event_type: 'thunderstorm',
        credibility_score: 94,
        status: 'authorized',
        rank: 'Gold Sentinel',
        verified_date: '08 Oct 2026',
        report_id: 'MSA-2026-10112',
        upi_id: 'priya.k@okaxis',
        is_lucky_winner: true,
        prize_won: '₹500',
        badge: '🥇',
    },
    {
        id: 'GLORY-103',
        name: 'Rajesh Rawat',
        city: 'Dehradun',
        state: 'Uttarakhand',
        report_title: 'Landslide Warning on Mussoorie-Rajpur Road stretch',
        event_type: 'landslide',
        credibility_score: 97,
        status: 'authorized',
        rank: 'Platinum Sentinel',
        verified_date: '07 Oct 2026',
        report_id: 'MSA-2026-10088',
        upi_id: 'rajesh.rawat@paytm',
        is_lucky_winner: true,
        prize_won: '₹500',
        badge: '💎',
    },
    {
        id: 'GLORY-104',
        name: 'Sunita Meena',
        city: 'Jaipur',
        state: 'Rajasthan',
        report_title: 'High Heat Wave Spike with Surface Temperature 42.8°C',
        event_type: 'heatwave',
        credibility_score: 91,
        status: 'authorized',
        rank: 'Silver Sentinel',
        verified_date: '06 Oct 2026',
        report_id: 'MSA-2026-10045',
        upi_id: 'sunitam@sbi',
        is_lucky_winner: true,
        prize_won: '₹500',
        badge: '🥈',
    },
    {
        id: 'GLORY-105',
        name: 'Ananya Sen',
        city: 'Kolkata',
        state: 'West Bengal',
        report_title: 'Squall Line Gusts (62 km/h) along Hooghly Embankment',
        event_type: 'strong_wind',
        credibility_score: 93,
        status: 'authorized',
        rank: 'Gold Sentinel',
        verified_date: '06 Oct 2026',
        report_id: 'MSA-2026-10039',
        upi_id: 'ananya.sen@icici',
        is_lucky_winner: true,
        prize_won: '₹500',
        badge: '🥇',
    },
    {
        id: 'GLORY-106',
        name: 'Karthik Subramanian',
        city: 'Chennai',
        state: 'Tamil Nadu',
        report_title: 'Monsoon Water Inundation in Velachery Low-Lying Area',
        event_type: 'flood',
        credibility_score: 95,
        status: 'authorized',
        rank: 'Gold Sentinel',
        verified_date: '05 Oct 2026',
        report_id: 'MSA-2026-10021',
        upi_id: 'karthik.sub@okaxis',
        is_lucky_winner: true,
        prize_won: '₹500',
        badge: '🥇',
    },
    {
        id: 'GLORY-107',
        name: 'Kavita Nair',
        city: 'Kochi',
        state: 'Kerala',
        report_title: 'Coastal High Wave Advisory & Strong Westerly Winds',
        event_type: 'strong_wind',
        credibility_score: 96,
        status: 'authorized',
        rank: 'Platinum Sentinel',
        verified_date: '04 Oct 2026',
        report_id: 'MSA-2026-09984',
        upi_id: 'kavitanair@fed',
        is_lucky_winner: true,
        prize_won: '₹500',
        badge: '💎',
    },
    {
        id: 'GLORY-108',
        name: 'Tanya Mathur',
        city: 'New Delhi',
        state: 'Delhi',
        report_title: 'Intense Dust Storm & Sudden Visibility Drop near CP',
        event_type: 'dust_storm',
        credibility_score: 95,
        status: 'authorized',
        rank: 'Gold Sentinel',
        verified_date: '04 Oct 2026',
        report_id: 'MSA-2026-09962',
        upi_id: 'tanya.mathur@okhdfc',
        is_lucky_winner: true,
        prize_won: '₹500',
        badge: '🥇',
    },
    {
        id: 'GLORY-109',
        name: 'Dr. Bhaskar Baruah',
        city: 'Guwahati',
        state: 'Assam',
        report_title: 'Brahmaputra Bank Water Level Surge at Fancy Bazar',
        event_type: 'flood',
        credibility_score: 98,
        status: 'authorized',
        rank: 'Platinum Sentinel',
        verified_date: '03 Oct 2026',
        report_id: 'MSA-2026-09920',
        upi_id: 'b.baruah@sbi',
        is_lucky_winner: false,
        prize_won: null,
        badge: '💎',
    },
    {
        id: 'GLORY-110',
        name: 'Gurpreet Singh',
        city: 'Amritsar',
        state: 'Punjab',
        report_title: 'Dense Fog Shroud on GT Road with Visibility Under 15m',
        event_type: 'fog',
        credibility_score: 92,
        status: 'authorized',
        rank: 'Silver Sentinel',
        verified_date: '03 Oct 2026',
        report_id: 'MSA-2026-09911',
        upi_id: 'gurpreet.pb@upi',
        is_lucky_winner: false,
        prize_won: null,
        badge: '🥈',
    },
    {
        id: 'GLORY-111',
        name: 'Rohit Shenoy',
        city: 'Bengaluru',
        state: 'Karnataka',
        report_title: 'Heavy Cloudburst & Water Stagnation in Whitefield Outer Ring Road',
        event_type: 'rainfall',
        credibility_score: 94,
        status: 'authorized',
        rank: 'Gold Sentinel',
        verified_date: '02 Oct 2026',
        report_id: 'MSA-2026-09885',
        upi_id: 'rohit.shenoy@ibl',
        is_lucky_winner: false,
        prize_won: null,
        badge: '🥇',
    },
    {
        id: 'GLORY-112',
        name: 'Vikramaditya Rathore',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        report_title: 'Localized Hailstorm & Sudden Temperature Plunge to 17°C',
        event_type: 'hailstorm',
        credibility_score: 93,
        status: 'authorized',
        rank: 'Gold Sentinel',
        verified_date: '02 Oct 2026',
        report_id: 'MSA-2026-09842',
        upi_id: 'vikram.rathore@upi',
        is_lucky_winner: false,
        prize_won: null,
        badge: '🥇',
    },
    {
        id: 'GLORY-113',
        name: 'Rameshwar Yadav',
        city: 'Patna',
        state: 'Bihar',
        report_title: 'Severe Lightning Strikes Reported near Danapur Cantonment',
        event_type: 'thunderstorm',
        credibility_score: 89,
        status: 'authorized',
        rank: 'Bronze Sentinel',
        verified_date: '01 Oct 2026',
        report_id: 'MSA-2026-09819',
        upi_id: 'rameshwar.patna@sbi',
        is_lucky_winner: false,
        prize_won: null,
        badge: '🥉',
    },
    {
        id: 'GLORY-114',
        name: 'Soumya Patnaik',
        city: 'Bhubaneswar',
        state: 'Odisha',
        report_title: 'Deep Depression Squall Warning and Coastal Gale at Puri Coast',
        event_type: 'cyclone',
        credibility_score: 95,
        status: 'authorized',
        rank: 'Gold Sentinel',
        verified_date: '01 Oct 2026',
        report_id: 'MSA-2026-09795',
        upi_id: 'soumya.patnaik@upi',
        is_lucky_winner: false,
        prize_won: null,
        badge: '🥇',
    },
];

export const INITIAL_MONTHLY_STATE_WINNERS = [
    {
        state: 'Uttar Pradesh',
        month: 'October 2026',
        winner_name: 'Arjun Verma',
        city: 'Noida',
        prize: '₹500',
        report_id: 'MSA-2026-10138',
        payout_status: 'Dispatched via UPI',
        payout_ref: 'UPI/2026/OCT/98412-UP',
        draw_date: '01 Oct 2026',
    },
    {
        state: 'Maharashtra',
        month: 'October 2026',
        winner_name: 'Priya Kulkarni',
        city: 'Pune',
        prize: '₹500',
        report_id: 'MSA-2026-10112',
        payout_status: 'Dispatched via UPI',
        payout_ref: 'UPI/2026/OCT/44120-MH',
        draw_date: '01 Oct 2026',
    },
    {
        state: 'Uttarakhand',
        month: 'October 2026',
        winner_name: 'Rajesh Rawat',
        city: 'Dehradun',
        prize: '₹500',
        report_id: 'MSA-2026-10088',
        payout_status: 'Dispatched via UPI',
        payout_ref: 'UPI/2026/OCT/33918-UK',
        draw_date: '01 Oct 2026',
    },
    {
        state: 'Rajasthan',
        month: 'October 2026',
        winner_name: 'Sunita Meena',
        city: 'Jaipur',
        prize: '₹500',
        report_id: 'MSA-2026-10045',
        payout_status: 'Dispatched via UPI',
        payout_ref: 'UPI/2026/OCT/55219-RJ',
        draw_date: '01 Oct 2026',
    },
    {
        state: 'West Bengal',
        month: 'October 2026',
        winner_name: 'Ananya Sen',
        city: 'Kolkata',
        prize: '₹500',
        report_id: 'MSA-2026-10039',
        payout_status: 'Dispatched via UPI',
        payout_ref: 'UPI/2026/OCT/77215-WB',
        draw_date: '01 Oct 2026',
    },
    {
        state: 'Tamil Nadu',
        month: 'October 2026',
        winner_name: 'Karthik Subramanian',
        city: 'Chennai',
        prize: '₹500',
        report_id: 'MSA-2026-10021',
        payout_status: 'Dispatched via UPI',
        payout_ref: 'UPI/2026/OCT/11842-TN',
        draw_date: '01 Oct 2026',
    },
    {
        state: 'Kerala',
        month: 'October 2026',
        winner_name: 'Kavita Nair',
        city: 'Kochi',
        prize: '₹500',
        report_id: 'MSA-2026-09984',
        payout_status: 'Dispatched via UPI',
        payout_ref: 'UPI/2026/OCT/88341-KL',
        draw_date: '01 Oct 2026',
    },
    {
        state: 'Delhi',
        month: 'October 2026',
        winner_name: 'Tanya Mathur',
        city: 'New Delhi',
        prize: '₹500',
        report_id: 'MSA-2026-09962',
        payout_status: 'Dispatched via UPI',
        payout_ref: 'UPI/2026/OCT/66190-DL',
        draw_date: '01 Oct 2026',
    },
];

const GLORY_STORAGE_KEY = 'mausam_glory_of_honour_v1';
const WINNERS_STORAGE_KEY = 'mausam_monthly_state_winners_v1';

export function getStoredGloryList() {
    try {
        const raw = localStorage.getItem(GLORY_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_GLORY_REPORTERS;
}

export function saveStoredGloryList(list) {
    try {
        localStorage.setItem(GLORY_STORAGE_KEY, JSON.stringify(list));
    } catch {}
}

export function getStoredMonthlyWinners() {
    try {
        const raw = localStorage.getItem(WINNERS_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_MONTHLY_STATE_WINNERS;
}

export function saveStoredMonthlyWinners(winners) {
    try {
        localStorage.setItem(WINNERS_STORAGE_KEY, JSON.stringify(winners));
    } catch {}
}

/**
 * Conduct a provably random lucky draw for a state.
 * Returns the drawn winner object.
 */
export function drawRandomStateWinner(stateName, eligibleReporters) {
    if (!eligibleReporters || eligibleReporters.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * eligibleReporters.length);
    const chosen = eligibleReporters[randomIndex];
    const txnRef = `UPI/2026/OCT/${Math.floor(10000 + Math.random() * 90000)}-${stateName.slice(0, 2).toUpperCase()}`;

    const newWinner = {
        state: stateName,
        month: 'October 2026',
        winner_name: chosen.name,
        city: chosen.city || stateName,
        prize: '₹500',
        report_id: chosen.report_id || `MSA-2026-${Math.floor(10000 + Math.random() * 5000)}`,
        payout_status: 'Dispatched via UPI',
        payout_ref: txnRef,
        draw_date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    return { winner: newWinner, chosenCitizenId: chosen.id };
}

// Comprehensive list of time zones with their cities
const timeZones = [
    { city: 'London', zone: 'Europe/London', emoji: '🇬🇧' },
    { city: 'New York', zone: 'America/New_York', emoji: '🇺🇸' },
    { city: 'Los Angeles', zone: 'America/Los_Angeles', emoji: '🇺🇸' },
    { city: 'Tokyo', zone: 'Asia/Tokyo', emoji: '🇯🇵' },
    { city: 'Sydney', zone: 'Australia/Sydney', emoji: '🇦🇺' },
    { city: 'Dubai', zone: 'Asia/Dubai', emoji: '🇦🇪' },
    { city: 'Singapore', zone: 'Asia/Singapore', emoji: '🇸🇬' },
    { city: 'Hong Kong', zone: 'Asia/Hong_Kong', emoji: '🇭🇰' },
    { city: 'Bangkok', zone: 'Asia/Bangkok', emoji: '🇹🇭' },
    { city: 'Mumbai', zone: 'Asia/Kolkata', emoji: '🇮🇳' },
    { city: 'Moscow', zone: 'Europe/Moscow', emoji: '🇷🇺' },
    { city: 'Paris', zone: 'Europe/Paris', emoji: '🇫🇷' },
    { city: 'Berlin', zone: 'Europe/Berlin', emoji: '🇩🇪' },
    { city: 'Toronto', zone: 'America/Toronto', emoji: '🇨🇦' },
    { city: 'Mexico City', zone: 'America/Mexico_City', emoji: '🇲🇽' },
    { city: 'São Paulo', zone: 'America/Sao_Paulo', emoji: '🇧🇷' },
    { city: 'Buenos Aires', zone: 'America/Argentina/Buenos_Aires', emoji: '🇦🇷' },
    { city: 'Cairo', zone: 'Africa/Cairo', emoji: '🇪🇬' },
    { city: 'Istanbul', zone: 'Europe/Istanbul', emoji: '🇹🇷' },
    { city: 'Bangkok', zone: 'Asia/Bangkok', emoji: '🇹🇭' },
    { city: 'Seoul', zone: 'Asia/Seoul', emoji: '🇰🇷' },
    { city: 'Bangkok', zone: 'Asia/Bangkok', emoji: '🇹🇭' },
    { city: 'Manila', zone: 'Asia/Manila', emoji: '🇵🇭' },
    { city: 'Jakarta', zone: 'Asia/Jakarta', emoji: '🇮🇩' },
    { city: 'Johannesburg', zone: 'Africa/Johannesburg', emoji: '🇿🇦' },
    { city: 'Auckland', zone: 'Pacific/Auckland', emoji: '🇳🇿' },
    { city: 'Anchorage', zone: 'America/Anchorage', emoji: '🇺🇸' },
    { city: 'Honolulu', zone: 'Pacific/Honolulu', emoji: '🇺🇸' },
    { city: 'Santiago', zone: 'America/Santiago', emoji: '🇨🇱' },
    { city: 'Istanbul', zone: 'Europe/Istanbul', emoji: '🇹🇷' },
];

// Get unique time zones
const uniqueTimeZones = Array.from(
    new Map(timeZones.map(item => [item.zone, item])).values()
);

// Default time zones to display
const DEFAULT_ZONES = [
    'Europe/London',
    'America/New_York',
    'Asia/Tokyo',
    'Australia/Sydney'
];

let displayedZones = [...DEFAULT_ZONES];

// DOM Elements
const clocksContainer = document.getElementById('clocksContainer');
const searchInput = document.getElementById('searchInput');
const searchDropdown = document.getElementById('searchDropdown');
const addZoneBtn = document.getElementById('addZoneBtn');
const resetBtn = document.getElementById('resetBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderClocks();
    setInterval(renderClocks, 1000);
    setupEventListeners();
});

function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('blur', () => {
        setTimeout(() => searchDropdown.classList.add('hidden'), 200);
    });
    addZoneBtn.addEventListener('click', () => {
        searchInput.focus();
    });
    resetBtn.addEventListener('click', resetToDefault);
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    
    if (query.length === 0) {
        searchDropdown.classList.add('hidden');
        return;
    }

    const filtered = uniqueTimeZones.filter(tz => 
        tz.city.toLowerCase().includes(query) || 
        tz.zone.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        searchDropdown.innerHTML = '<div class="dropdown-item">No time zones found</div>';
    } else {
        searchDropdown.innerHTML = filtered.map(tz => `
            <div class="dropdown-item" onclick="addTimeZone('${tz.zone}')">${tz.emoji} ${tz.city} (${tz.zone})</div>
        `).join('');
    }

    searchDropdown.classList.remove('hidden');
}

function addTimeZone(zone) {
    if (!displayedZones.includes(zone)) {
        displayedZones.push(zone);
        saveZones();
        renderClocks();
    }
    searchInput.value = '';
    searchDropdown.classList.add('hidden');
}

function removeTimeZone(zone) {
    displayedZones = displayedZones.filter(z => z !== zone);
    saveZones();
    renderClocks();
}

function resetToDefault() {
    displayedZones = [...DEFAULT_ZONES];
    saveZones();
    renderClocks();
}

function saveZones() {
    localStorage.setItem('displayedTimeZones', JSON.stringify(displayedZones));
}

function loadZones() {
    const saved = localStorage.getItem('displayedTimeZones');
    if (saved) {
        displayedZones = JSON.parse(saved);
    }
}

function getCityName(zone) {
    const tzData = timeZones.find(tz => tz.zone === zone);
    return tzData ? tzData.city : zone.split('/')[1].replace(/_/g, ' ');
}

function getEmoji(zone) {
    const tzData = timeZones.find(tz => tz.zone === zone);
    return tzData ? tzData.emoji : '🌍';
}

function getTimeInZone(zone) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const parts = formatter.formatToParts(new Date());
    const timeObj = {};
    
    parts.forEach(part => {
        if (part.type !== 'literal') {
            timeObj[part.type] = part.value;
        }
    });

    return {
        hours: timeObj.hour,
        minutes: timeObj.minute,
        seconds: timeObj.second,
        hour12: parseInt(timeObj.hour),
    };
}

function getDateInZone(zone) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return formatter.format(new Date());
}

function getUTCOffset(zone) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        timeZoneName: 'shortOffset'
    });

    const parts = formatter.formatToParts(new Date());
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : 'UTC';
}

function renderClocks() {
    // Load zones from localStorage if available
    const saved = localStorage.getItem('displayedTimeZones');
    if (saved) {
        displayedZones = JSON.parse(saved);
    }

    if (displayedZones.length === 0) {
        clocksContainer.innerHTML = `
            <div class="empty-state">
                <h2>No time zones selected</h2>
                <p>Use the search bar above to add time zones to display</p>
            </div>
        `;
        return;
    }

    clocksContainer.innerHTML = displayedZones.map(zone => {
        const time = getTimeInZone(zone);
        const date = getDateInZone(zone);
        const offset = getUTCOffset(zone);
        const cityName = getCityName(zone);
        const emoji = getEmoji(zone);

        const hours = parseInt(time.hours);
        const minutes = parseInt(time.minutes);
        const seconds = parseInt(time.seconds);

        const hour12 = hours % 12 || 12;
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // Calculate analog clock hand angles
        const secondAngle = (seconds * 6) % 360;
        const minuteAngle = (minutes * 6 + seconds * 0.1) % 360;
        const hourAngle = (hours * 30 + minutes * 0.5) % 360;

        return `
            <div class="clock-card">
                <div class="clock-header">
                    <div>
                        <div class="city-name">${emoji} ${cityName}</div>
                        <div class="timezone-info">${zone}</div>
                    </div>
                    <button class="remove-btn" onclick="removeTimeZone('${zone}')">×</button>
                </div>

                <div class="date-display">${date}</div>

                <div class="digital-time">
                    ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}
                </div>

                <div class="time-details">
                    <div class="detail-item">
                        <div class="detail-label">12-Hour</div>
                        <div class="detail-value">${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">UTC Offset</div>
                        <div class="detail-value">${offset}</div>
                    </div>
                </div>

                <div class="analog-clock">
                    <div class="clock-number">
                        <span style="top: 10px; left: 50%; transform: translateX(-50%);">12</span>
                        <span style="top: 50%; left: 90px; transform: translateY(-50%);">3</span>
                        <span style="bottom: 10px; left: 50%; transform: translateX(-50%);">6</span>
                        <span style="top: 50%; left: 10px; transform: translateY(-50%);">9</span>
                    </div>
                    <div class="hand hour-hand" style="transform: rotate(${hourAngle}deg) translateY(-30px);"></div>
                    <div class="hand minute-hand" style="transform: rotate(${minuteAngle}deg) translateY(-40px);"></div>
                    <div class="hand second-hand" style="transform: rotate(${secondAngle}deg) translateY(-42.5px);"></div>
                    <div class="clock-center"></div>
                </div>
            </div>
        `;
    }).join('');
}

// Load zones on startup
loadZones();
renderClocks();

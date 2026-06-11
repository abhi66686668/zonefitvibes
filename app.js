const routineData = [
    {
        day: 1,
        title: "Chest + Triceps",
        exercises: [
            { name: "Incline DB Press", sets: 4, reps: "8", image: "incline_db_press.png" },
            { name: "Flat Bench", sets: 3, reps: "6–8", image: "flat_bench.png" },
            { name: "Cable Fly (Low to High)", sets: 3, reps: "12", image: "cable_fly.png" },
            { name: "Close Grip Bench", sets: 3, reps: "8", image: "close_grip_bench.png" },
            { name: "Rope Pushdown", sets: 3, reps: "12", image: "rope_pushdown.png" }
        ]
    },
    {
        day: 2,
        title: "Back Width + Biceps",
        exercises: [
            { name: "Pull-ups", sets: 4, reps: "max", image: "pull_ups.png" },
            { name: "Lat Pulldown", sets: 3, reps: "10", image: "lat_pulldown.png" },
            { name: "Straight Arm Pulldown", sets: 3, reps: "12", image: "straight_arm_pulldown.png" },
            { name: "Barbell Curl", sets: 3, reps: "8", image: "barbell_curl.png" },
            { name: "Hammer Curl", sets: 3, reps: "12", image: "hammer_curl.png" }
        ]
    },
    {
        day: 3,
        title: "Hamstrings + Glutes",
        exercises: [
            { name: "RDL", sets: 4, reps: "8", image: "rdl.png" },
            { name: "Lying Curl", sets: 4, reps: "12", image: "lying_curl.png" },
            { name: "Bulgarian Split Squat", sets: 3, reps: "10", image: "bulgarian_split_squat.png" },
            { name: "Hip Thrust", sets: 3, reps: "10", image: "hip_thrust.png" },
            { name: "Seated Calf", sets: 4, reps: "15", image: "seated_calf.png" }
        ]
    },
    {
        day: 4,
        title: "Rest Day",
        exercises: []
    },
    {
        day: 5,
        title: "Back Thickness + Rear Delts",
        exercises: [
            { name: "Deadlift / Rack Pull", sets: 3, reps: "5", image: "deadlift.png" },
            { name: "Chest-Supported Row", sets: 4, reps: "8", image: "chest_supported_row.png" },
            { name: "Seated Row", sets: 3, reps: "10", image: "seated_row.png" },
            { name: "Face Pull", sets: 4, reps: "15", image: "face_pull.png" }
        ]
    },
    {
        day: 6,
        title: "Shoulders + Rear Delts",
        exercises: [
            { name: "Shoulder Press", sets: 3, reps: "8", image: "shoulder_press.png" },
            { name: "Lateral Raises", sets: 5, reps: "15", image: "lateral_raises.png" },
            { name: "Reverse Pec Deck", sets: 4, reps: "15", image: "reverse_pec_deck.png" },
            { name: "Cable Lateral", sets: 3, reps: "15", image: "cable_lateral.png" }
        ]
    },
    {
        day: 7,
        title: "Quads",
        exercises: [
            { name: "Squat", sets: 4, reps: "8", image: "squat.png" },
            { name: "Leg Press", sets: 4, reps: "12", image: "leg_press.png" },
            { name: "Leg Extension", sets: 3, reps: "15", image: "leg_extension.png" },
            { name: "Walking Lunges", sets: 3, reps: "20", image: "walking_lunges.png" },
            { name: "Step Up", sets: 2, reps: "10 each", image: "step_up.png" },
            { name: "Standing Calf", sets: 4, reps: "15", image: "standing_calf.png" }
        ]
    }
];

let currentDayIndex = 0; // 0 for Day 1

// DOM Elements
const dayTitleEl = document.getElementById('dayTitle');
const daySubtitleEl = document.getElementById('daySubtitle');
const prevDayBtn = document.getElementById('prevDayBtn');
const nextDayBtn = document.getElementById('nextDayBtn');
const routineContainer = document.getElementById('routineContainer');
const resetBtn = document.getElementById('resetBtn');

// New DOM elements for Calendar
const finishWorkoutBtn = document.getElementById('finishWorkoutBtn');
const viewCalendarBtn = document.getElementById('viewCalendarBtn');
const calendarModal = document.getElementById('calendarModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const calendarMonthYear = document.getElementById('calendarMonthYear');
const calendarGrid = document.getElementById('calendarGrid');
const totalWorkoutsCount = document.getElementById('totalWorkoutsCount');

let currentCalendarDate = new Date();

// Remove preloader on load
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1500); // 1500ms delay to ensure the animation is seen
    }
});

// Initialize
function init() {
    setupNavigation();
    setupImageCarousel();
    initTimers();
    // Check if there's a saved day in local storage
    const savedDay = localStorage.getItem('zonefitvibes_currentDay');
    if (savedDay !== null) {
        currentDayIndex = parseInt(savedDay, 10);
    } else {
        // Default to today's day of week (1=Monday... 0=Sunday) - Optional enhancement
        // Just default to Day 1 for now
        currentDayIndex = 0;
    }
    
    renderDay();
    setupEventListeners();
}

function renderDay() {
    updateMotivation();
    const dayData = routineData[currentDayIndex];
    
    // Update headers
    dayTitleEl.textContent = `Day ${dayData.day}`;
    daySubtitleEl.textContent = dayData.title;
    
    // Update local storage for current day
    localStorage.setItem('zonefitvibes_currentDay', currentDayIndex);

    // Render exercises
    routineContainer.innerHTML = '';
    
    if (dayData.exercises.length === 0) {
        routineContainer.innerHTML = `<div class="glass-panel rest-day-message">Enjoy your rest day! Recover well for tomorrow.</div>`;
        return;
    }

    dayData.exercises.forEach((exercise, exIndex) => {
        const card = document.createElement('div');
        card.className = 'exercise-card glass-panel';
        card.id = `exercise-${currentDayIndex}-${exIndex}`;
        
        let setsHTML = '';
        let allSetsCompleted = true;
        
        for (let s = 1; s <= exercise.sets; s++) {
            const setId = `set-${currentDayIndex}-${exIndex}-${s}`;
            const isCompleted = localStorage.getItem(setId) === 'true';
            
            if (!isCompleted) allSetsCompleted = false;

            setsHTML += `
                <label class="set-checkbox" for="${setId}">
                    <input type="checkbox" id="${setId}" ${isCompleted ? 'checked' : ''} onchange="toggleSet(${currentDayIndex}, ${exIndex}, ${s}, '${setId}')">
                    <span class="checkmark"></span>
                    <span class="set-label-text">Set ${s} (${exercise.reps})</span>
                </label>
            `;
        }
        
        if (allSetsCompleted && exercise.sets > 0) {
            card.classList.add('completed');
        }

        let imageHTML = '';
        if (exercise.image) {
            // Added ?v=real3 to bypass image cache when updating images
            imageHTML = `<img src="${exercise.image}?v=real3" alt="${exercise.name}" class="exercise-image" />`;
        }

        card.innerHTML = `
            ${imageHTML}
            <div class="exercise-header">
                <span class="exercise-name">${exercise.name}</span>
                <span class="exercise-target">${exercise.sets} × ${exercise.reps}</span>
            </div>
            <div class="sets-container">
                ${setsHTML}
            </div>
        `;
        
        routineContainer.appendChild(card);
    });
}

// Global function to handle checkbox toggles
window.toggleSet = function(dayIdx, exIdx, setNum, setId) {
    const checkbox = document.getElementById(setId);
    localStorage.setItem(setId, checkbox.checked);
    
    // Check if all sets for this exercise are completed to update card styling
    checkExerciseCompletion(dayIdx, exIdx);
};

function checkExerciseCompletion(dayIdx, exIdx) {
    const exercise = routineData[dayIdx].exercises[exIdx];
    const card = document.getElementById(`exercise-${dayIdx}-${exIdx}`);
    let allCompleted = true;
    
    for (let s = 1; s <= exercise.sets; s++) {
        const setId = `set-${dayIdx}-${exIdx}-${s}`;
        if (localStorage.getItem(setId) !== 'true') {
            allCompleted = false;
            break;
        }
    }
    
    if (allCompleted) {
        card.classList.add('completed');
    } else {
        card.classList.remove('completed');
    }
}

function setupEventListeners() {
    prevDayBtn.addEventListener('click', () => {
        if (currentDayIndex > 0) {
            currentDayIndex--;
            renderDay();
        } else {
            // Loop to end
            currentDayIndex = routineData.length - 1;
            renderDay();
        }
    });

    nextDayBtn.addEventListener('click', () => {
        if (currentDayIndex < routineData.length - 1) {
            currentDayIndex++;
            renderDay();
        } else {
            // Loop to start
            currentDayIndex = 0;
            renderDay();
        }
    });

    if (finishWorkoutBtn) {
        finishWorkoutBtn.addEventListener('click', () => {
            const dayData = routineData[currentDayIndex];
            
            // Generate local YYYY-MM-DD
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            let history = JSON.parse(localStorage.getItem('zonefitvibes_history') || '[]');
            
            // Prevent exact same day duplicate
            if (!history.find(h => h.date === dateStr && h.dayIndex === currentDayIndex)) {
                history.push({
                    date: dateStr,
                    dayIndex: currentDayIndex,
                    title: dayData.title
                });
                localStorage.setItem('zonefitvibes_history', JSON.stringify(history));
            }

            // Clear checkboxes
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('set-')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));

            // Move to next day
            if (currentDayIndex < routineData.length - 1) {
                currentDayIndex++;
            } else {
                currentDayIndex = 0;
            }
            renderDay();
        });
    }

    if (viewCalendarBtn) {
        viewCalendarBtn.addEventListener('click', () => {
            currentCalendarDate = new Date(); // Reset to current month on open
            renderCalendar();
            calendarModal.classList.remove('hidden');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            calendarModal.classList.add('hidden');
        });
    }

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all your progress for this week?')) {
            // Clear all checkboxes from local storage
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('set-')) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            renderDay(); // re-render to update UI
        }
    });
}

// Run app
document.addEventListener('DOMContentLoaded', init);

const motivationQuotes = [
    { text: "The hard part isn't getting your body in shape. The hard part is getting your mind in shape.", author: "Amby Burfoot" },
    { text: "Blood, sweat and respect. First two you give, last one you earn.", author: "The Rock" },
    { text: "We are what we repeatedly do. Excellence then is not an act but a habit.", author: "Aristotle" },
    { text: "If something stands between you and your success, move it. Never be denied.", author: "Dwayne Johnson" },
    { text: "Your body can stand almost anything. It’s your mind that you have to convince.", author: "Unknown" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "David Goggins" },
    { text: "Success starts with self-discipline.", author: "Unknown" },
    { text: "No pain, no gain. Shut up and train.", author: "Unknown" },
    { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
    { text: "What seems impossible today will one day become your warm-up.", author: "Unknown" }
];

function updateMotivation() {
    const quoteEl = document.getElementById('motivationQuote');
    const authorEl = document.getElementById('motivationAuthor');
    if (quoteEl && authorEl) {
        const randomQuote = motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)];
        quoteEl.textContent = randomQuote.text;
        authorEl.textContent = randomQuote.author;
    }
}

function renderCalendar() {
    if (!calendarMonthYear || !calendarGrid) return;
    
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    calendarMonthYear.textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month and total days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let history = JSON.parse(localStorage.getItem('zonefitvibes_history') || '[]');
    if(totalWorkoutsCount) totalWorkoutsCount.textContent = history.length;

    // Clear previous grid
    calendarGrid.innerHTML = '<div class="weekday">Sun</div><div class="weekday">Mon</div><div class="weekday">Tue</div><div class="weekday">Wed</div><div class="weekday">Thu</div><div class="weekday">Fri</div><div class="weekday">Sat</div>';
    
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    // Empty cells before start of month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyCell);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = i;
        
        if (isCurrentMonth && i === today.getDate()) {
            dayCell.classList.add('today');
        }

        // Check if completed
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        // Find if multiple workouts were completed on this day
        const completedWorkouts = history.filter(h => h.date === dateStr);
        
        if (completedWorkouts.length > 0) {
            dayCell.classList.add('completed');
            dayCell.title = completedWorkouts.map(w => w.title).join(' & ');
        }

        calendarGrid.appendChild(dayCell);
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const views = document.querySelectorAll('.page-view');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Show preloader for page transition
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.classList.remove('hidden');
                setTimeout(() => {
                    preloader.classList.add('hidden');
                }, 1500);
            }
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active-nav'));
            
            // Add active class to clicked link
            e.target.classList.add('active-nav');
            
            // Get target view id
            const targetViewId = e.target.getAttribute('data-view');
            
            // Hide all views
            views.forEach(view => {
                view.classList.remove('active-view');
                view.classList.add('hidden-view');
            });
            
            // Show target view
            const targetView = document.getElementById(targetViewId);
            if (targetView) {
                targetView.classList.remove('hidden-view');
                targetView.classList.add('active-view');
            }
        });
    });
}

// Home Page Image Carousel
const heroImages = [
    'deadlift.png',
    'squat.png',
    'pull_ups.png',
    'shoulder_press.png',
    'rdl.png'
];
let currentHeroImageIndex = 0;

function setupImageCarousel() {
    const heroImg = document.getElementById('heroImage');
    if (!heroImg) return;

    setInterval(() => {
        // Fade out
        heroImg.style.opacity = 0;
        
        setTimeout(() => {
            // Change image source after fade out completes
            currentHeroImageIndex = (currentHeroImageIndex + 1) % heroImages.length;
            heroImg.src = heroImages[currentHeroImageIndex];
            
            heroImg.style.opacity = 1;
        }, 500); // 500ms matches the CSS transition duration
    }, 3000); // Change every 3 seconds
}

// --- TIMER LOGIC ---

// Stopwatch Variables
let swStartTime = 0;
let swElapsedTime = 0;
let swInterval = null;
let swIsRunning = false;
let swLaps = [];

// Countdown Variables
let cdEndTime = 0;
let cdInterval = null;
let cdIsRunning = false;
let cdTotalSeconds = 0;

function initTimers() {
    // 1. Load from localStorage
    loadTimerState();

    // 2. Stopwatch Event Listeners
    document.getElementById('swStartBtn').addEventListener('click', toggleStopwatch);
    document.getElementById('swResetBtn').addEventListener('click', resetStopwatch);
    document.getElementById('swLapBtn').addEventListener('click', recordLap);

    // 3. Countdown Event Listeners
    document.getElementById('cdStartBtn').addEventListener('click', toggleCountdown);
    document.getElementById('cdResetBtn').addEventListener('click', resetCountdown);
}

function saveTimerState() {
    localStorage.setItem('zonefitvibes_timers', JSON.stringify({
        swStartTime,
        swElapsedTime,
        swIsRunning,
        swLaps,
        cdEndTime,
        cdIsRunning,
        cdTotalSeconds
    }));
}

function loadTimerState() {
    const saved = localStorage.getItem('zonefitvibes_timers');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            swElapsedTime = data.swElapsedTime || 0;
            swIsRunning = data.swIsRunning || false;
            swLaps = data.swLaps || [];
            cdEndTime = data.cdEndTime || 0;
            cdIsRunning = data.cdIsRunning || false;
            cdTotalSeconds = data.cdTotalSeconds || 0;
            
            // Re-sync stopwatch
            if (swIsRunning) {
                swStartTime = data.swStartTime || (Date.now() - swElapsedTime);
                startStopwatchInterval();
                document.getElementById('swStartBtn').textContent = 'Stop';
                document.getElementById('swLapBtn').disabled = false;
            } else {
                updateStopwatchDisplay(swElapsedTime);
            }
            renderLaps();

            // Re-sync countdown
            if (cdIsRunning) {
                if (Date.now() < cdEndTime) {
                    startCountdownInterval();
                    document.getElementById('cdStartBtn').textContent = 'Stop';
                    document.getElementById('countdownInput').style.display = 'none';
                    document.getElementById('countdownDisplay').style.display = 'block';
                } else {
                    // Time already expired while away
                    cdIsRunning = false;
                    triggerAlarm();
                }
            } else if (cdTotalSeconds > 0) {
                // Was paused
                updateCountdownDisplay(cdTotalSeconds);
                document.getElementById('countdownInput').style.display = 'none';
                document.getElementById('countdownDisplay').style.display = 'block';
            }
        } catch (e) {
            console.error('Error loading timer state', e);
        }
    }
}

// --- STOPWATCH ---
function toggleStopwatch() {
    if (swIsRunning) {
        // Stop
        clearInterval(swInterval);
        swIsRunning = false;
        swElapsedTime = Date.now() - swStartTime;
        document.getElementById('swStartBtn').textContent = 'Start';
        document.getElementById('swLapBtn').disabled = true;
    } else {
        // Start
        swStartTime = Date.now() - swElapsedTime;
        swIsRunning = true;
        startStopwatchInterval();
        document.getElementById('swStartBtn').textContent = 'Stop';
        document.getElementById('swLapBtn').disabled = false;
    }
    saveTimerState();
}

function startStopwatchInterval() {
    clearInterval(swInterval);
    swInterval = setInterval(() => {
        const currentElapsed = Date.now() - swStartTime;
        updateStopwatchDisplay(currentElapsed);
    }, 10);
}

function updateStopwatchDisplay(ms) {
    const totalSec = Math.floor(ms / 1000);
    const msecs = Math.floor((ms % 1000) / 10);
    const secs = totalSec % 60;
    const mins = Math.floor(totalSec / 60) % 60;
    const hrs = Math.floor(totalSec / 3600);

    let display = '';
    if (hrs > 0) display += String(hrs).padStart(2, '0') + ':';
    display += String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0') + '.' + String(msecs).padStart(2, '0');
    
    document.getElementById('stopwatchDisplay').textContent = display;
}

function resetStopwatch() {
    clearInterval(swInterval);
    swIsRunning = false;
    swElapsedTime = 0;
    swLaps = [];
    document.getElementById('swStartBtn').textContent = 'Start';
    document.getElementById('swLapBtn').disabled = true;
    updateStopwatchDisplay(0);
    renderLaps();
    saveTimerState();
}

function recordLap() {
    if (!swIsRunning) return;
    const currentElapsed = Date.now() - swStartTime;
    swLaps.unshift(currentElapsed); // Add to beginning
    renderLaps();
    saveTimerState();
}

function renderLaps() {
    const list = document.getElementById('lapList');
    list.innerHTML = '';
    swLaps.forEach((lapMs, index) => {
        const li = document.createElement('li');
        const lapNumber = swLaps.length - index;
        li.innerHTML = `<span>Lap ${lapNumber}</span><span>${formatTime(lapMs)}</span>`;
        list.appendChild(li);
    });
}

function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const msecs = Math.floor((ms % 1000) / 10);
    const secs = totalSec % 60;
    const mins = Math.floor(totalSec / 60) % 60;
    const hrs = Math.floor(totalSec / 3600);
    let display = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0') + '.' + String(msecs).padStart(2, '0');
    if (hrs > 0) display = String(hrs).padStart(2, '0') + ':' + display;
    return display;
}

// --- COUNTDOWN REMINDER ---
function toggleCountdown() {
    const alarmMsg = document.getElementById('alarmMessage');
    alarmMsg.classList.add('hidden');

    if (cdIsRunning) {
        // Pause
        clearInterval(cdInterval);
        cdIsRunning = false;
        cdTotalSeconds = Math.max(0, Math.ceil((cdEndTime - Date.now()) / 1000));
        document.getElementById('cdStartBtn').textContent = 'Resume';
    } else {
        // Start or Resume
        if (cdTotalSeconds === 0) {
            // Read inputs
            const h = parseInt(document.getElementById('cdHours').value) || 0;
            const m = parseInt(document.getElementById('cdMinutes').value) || 0;
            const s = parseInt(document.getElementById('cdSeconds').value) || 0;
            cdTotalSeconds = h * 3600 + m * 60 + s;
        }

        if (cdTotalSeconds > 0) {
            cdEndTime = Date.now() + (cdTotalSeconds * 1000);
            cdIsRunning = true;
            document.getElementById('countdownInput').style.display = 'none';
            document.getElementById('countdownDisplay').style.display = 'block';
            document.getElementById('cdStartBtn').textContent = 'Stop';
            startCountdownInterval();
        }
    }
    saveTimerState();
}

function startCountdownInterval() {
    clearInterval(cdInterval);
    updateCountdownDisplay(Math.max(0, Math.ceil((cdEndTime - Date.now()) / 1000)));
    cdInterval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((cdEndTime - Date.now()) / 1000));
        updateCountdownDisplay(remaining);
        
        if (remaining <= 0) {
            clearInterval(cdInterval);
            cdIsRunning = false;
            cdTotalSeconds = 0;
            triggerAlarm();
            document.getElementById('cdStartBtn').textContent = 'Start';
            saveTimerState();
        }
    }, 1000);
}

function updateCountdownDisplay(totalSec) {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    let display = '';
    if (hrs > 0) display += String(hrs).padStart(2, '0') + ':';
    display += String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    document.getElementById('countdownDisplay').textContent = display;
}

function resetCountdown() {
    clearInterval(cdInterval);
    cdIsRunning = false;
    cdTotalSeconds = 0;
    cdEndTime = 0;
    document.getElementById('cdStartBtn').textContent = 'Start';
    document.getElementById('countdownInput').style.display = 'flex';
    document.getElementById('countdownDisplay').style.display = 'none';
    document.getElementById('cdHours').value = '';
    document.getElementById('cdMinutes').value = '';
    document.getElementById('cdSeconds').value = '';
    document.getElementById('alarmMessage').classList.add('hidden');
    saveTimerState();
}

function triggerAlarm() {
    const alarmMsg = document.getElementById('alarmMessage');
    alarmMsg.classList.remove('hidden');
}

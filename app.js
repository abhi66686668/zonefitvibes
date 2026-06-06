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
            { name: "Pull-ups", sets: 4, reps: "max" },
            { name: "Lat Pulldown", sets: 3, reps: "10" },
            { name: "Straight Arm Pulldown", sets: 3, reps: "12" },
            { name: "Barbell Curl", sets: 3, reps: "8" },
            { name: "Hammer Curl", sets: 3, reps: "12" }
        ]
    },
    {
        day: 3,
        title: "Hamstrings + Glutes",
        exercises: [
            { name: "RDL", sets: 4, reps: "8" },
            { name: "Lying Curl", sets: 4, reps: "12" },
            { name: "Bulgarian Split Squat", sets: 3, reps: "10" },
            { name: "Hip Thrust", sets: 3, reps: "10" },
            { name: "Seated Calf", sets: 4, reps: "15" }
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
            { name: "Deadlift / Rack Pull", sets: 3, reps: "5" },
            { name: "Chest-Supported Row", sets: 4, reps: "8" },
            { name: "Seated Row", sets: 3, reps: "10" },
            { name: "Face Pull", sets: 4, reps: "15" }
        ]
    },
    {
        day: 6,
        title: "Shoulders + Rear Delts",
        exercises: [
            { name: "Shoulder Press", sets: 3, reps: "8" },
            { name: "Lateral Raises", sets: 5, reps: "15" },
            { name: "Reverse Pec Deck", sets: 4, reps: "15" },
            { name: "Cable Lateral", sets: 3, reps: "15" }
        ]
    },
    {
        day: 7,
        title: "Quads",
        exercises: [
            { name: "Squat", sets: 4, reps: "8" },
            { name: "Leg Press", sets: 4, reps: "12" },
            { name: "Leg Extension", sets: 3, reps: "15" },
            { name: "Walking Lunges", sets: 3, reps: "20" },
            { name: "Step Up", sets: 2, reps: "10 each" },
            { name: "Standing Calf", sets: 4, reps: "15" }
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

// Initialize
function init() {
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
            // Added ?v=real2 to bypass image cache when updating images
            imageHTML = `<img src="${exercise.image}?v=real2" alt="${exercise.name}" class="exercise-image" />`;
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

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authSection = document.getElementById('authSection');
    const authToggle = document.getElementById('authToggle');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const mainNav = document.getElementById('mainNav');
    const userProfile = document.getElementById('userProfile');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const profileSetup = document.getElementById('profileSetup');
    const userInfoForm = document.getElementById('userInfoForm');
    const dashboardContent = document.getElementById('dashboardContent');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    const navItems = document.querySelectorAll('#mainNav li');
    const editStatsBtn = document.getElementById('editStatsBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const settingsTabs = document.querySelectorAll('.tab-buttons button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // User data
    let currentUser = null;
    
    // Initialize the app
    initApp();
    
    // Event Listeners
    if (authToggle) {
        authToggle.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON') {
                const tab = e.target.dataset.tab;
                document.querySelectorAll('.auth-toggle button').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                
                document.querySelectorAll('.auth-form').forEach(form => {
                    form.classList.remove('active');
                });
                document.getElementById(`${tab}Form`).classList.add('active');
            }
        });
    }
    
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', showAuthSection);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    if (userInfoForm) {
        userInfoForm.addEventListener('submit', handleProfileSetup);
    }
    
    if (profileDropdown) {
        profileDropdown.addEventListener('click', function(e) {
            if (e.target.closest('.profile-info')) {
                this.classList.toggle('active');
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showProfileSetup();
            navigateToSection('settings');
        });
    }
    
    if (editStatsBtn) {
        editStatsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showProfileSetup();
        });
    }
    
    // Navigation items
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            navigateToSection(section);
        });
    });
    
    // Settings tabs
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            settingsTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}Tab`).classList.add('active');
        });
    });
    
    // Functions
    function initApp() {
        // Check if user is already logged in
        const storedUser = localStorage.getItem('currentUser');
        
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            
            // Update UI with user data
            updateUserProfile(currentUser);
            
            if (currentUser.profileComplete) {
                showDashboard();
                calculateHealthMetrics();
            } else {
                showProfileSetup();
            }
        } else {
            showWelcomeScreen();
        }
        
        // Generate workout cards
        generateWorkoutCards();
        
        // Generate macro data
        generateMacroData();
    }
    
    function showWelcomeScreen() {
        welcomeScreen.style.display = 'flex';
        authSection.style.display = 'none';
        mainNav.style.display = 'none';
        userProfile.style.display = 'none';
        profileSetup.style.display = 'none';
        dashboardContent.style.display = 'none';
    }
    
    function showAuthSection() {
        welcomeScreen.style.display = 'none';
        authSection.style.display = 'block';
        mainNav.style.display = 'none';
        userProfile.style.display = 'none';
        profileSetup.style.display = 'none';
        dashboardContent.style.display = 'none';
        
        // Reset forms
        loginForm.reset();
        signupForm.reset();
        document.querySelector('.auth-toggle button').click();
    }
    
    function showProfileSetup() {
        welcomeScreen.style.display = 'none';
        authSection.style.display = 'none';
        mainNav.style.display = 'block';
        userProfile.style.display = 'flex';
        profileSetup.style.display = 'flex';
        dashboardContent.style.display = 'none';
        
        // Pre-fill form if user has data
        if (currentUser) {
            document.getElementById('userAge').value = currentUser.age || '';
            document.getElementById('userGender').value = currentUser.gender || '';
            document.getElementById('userHeight').value = currentUser.height || '';
            document.getElementById('userWeight').value = currentUser.weight || '';
            document.getElementById('userGoal').value = currentUser.goal || '';
            document.getElementById('userActivity').value = currentUser.activity || '';
        }
    }
    
    function showDashboard() {
        welcomeScreen.style.display = 'none';
        authSection.style.display = 'none';
        mainNav.style.display = 'block';
        userProfile.style.display = 'flex';
        profileSetup.style.display = 'none';
        dashboardContent.style.display = 'block';
        
        // Show dashboard section by default
        navigateToSection('dashboard');
    }
    
    function navigateToSection(section) {
        // Update active nav item
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === section) {
                item.classList.add('active');
            }
        });
        
        // Update dashboard title
        document.getElementById('dashboardTitle').textContent = 
            section.charAt(0).toUpperCase() + section.slice(1);
        
        // Show corresponding section
        dashboardSections.forEach(sec => {
            sec.style.display = 'none';
            if (sec.id === `${section}Section`) {
                sec.style.display = 'block';
            }
        });
    }
    
    function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }
        
        // In a real app, this would be an API call
        const storedUser = localStorage.getItem('currentUser');
        
        if (storedUser) {
            const user = JSON.parse(storedUser);
            
            if (user.email === email && user.password === password) {
                currentUser = user;
                updateUserProfile(user);
                
                if (user.profileComplete) {
                    showDashboard();
                    calculateHealthMetrics();
                } else {
                    showProfileSetup();
                }
            } else {
                alert('Invalid email or password');
            }
        } else {
            alert('No user found with that email. Please sign up.');
        }
    }
    
    function handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Create new user
        currentUser = {
            name: name,
            email: email,
            password: password,
            profileComplete: false
        };
        
        // Store user in localStorage (in a real app, this would be an API call)
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI
        updateUserProfile(currentUser);
        
        // Show profile setup
        showProfileSetup();
    }
    
    function handleProfileSetup(e) {
        e.preventDefault();
        
        // Get form values
        const age = document.getElementById('userAge').value;
        const gender = document.getElementById('userGender').value;
        const height = document.getElementById('userHeight').value;
        const weight = document.getElementById('userWeight').value;
        const goal = document.getElementById('userGoal').value;
        const activity = document.getElementById('userActivity').value;
        
        if (!age || !gender || !height || !weight || !goal || !activity) {
            alert('Please fill all fields');
            return;
        }
        
        // Update user data
        currentUser = {
            ...currentUser,
            age: age,
            gender: gender,
            height: height,
            weight: weight,
            goal: goal,
            activity: activity,
            profileComplete: true,
            joinDate: new Date().toISOString()
        };
        
        // Store updated user
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Calculate health metrics
        calculateHealthMetrics();
        
        // Show dashboard
        showDashboard();
    }
    
    function handleLogout(e) {
        e.preventDefault();
        
        // Clear current user
        currentUser = null;
        localStorage.removeItem('currentUser');
        
        // Reset UI
        showWelcomeScreen();
        
        // Close dropdown
        profileDropdown.classList.remove('active');
    }
    
    function updateUserProfile(user) {
        document.getElementById('userProfileName').textContent = user.name;
        document.getElementById('userProfileImage').src = 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=000000&color=fff`;
        
        // Update settings form if exists
        if (document.getElementById('settingsName')) {
            document.getElementById('settingsName').value = user.name;
            document.getElementById('settingsEmail').value = user.email;
            document.getElementById('settingsAge').value = user.age || '';
            document.getElementById('settingsGender').value = user.gender || '';
        }
    }
    
    function calculateHealthMetrics() {
        if (!currentUser) return;
        
        // Calculate BMI
        const heightInMeters = currentUser.height / 100;
        const bmi = (currentUser.weight / (heightInMeters * heightInMeters)).toFixed(1);
        
        // Determine BMI category
        let bmiCategory;
        if (bmi < 18.5) bmiCategory = 'Underweight';
        else if (bmi < 25) bmiCategory = 'Normal';
        else if (bmi < 30) bmiCategory = 'Overweight';
        else bmiCategory = 'Obese';
        
        // Calculate daily calories (simplified Mifflin-St Jeor formula)
        let bmr;
        if (currentUser.gender === 'male') {
            bmr = 10 * currentUser.weight + 6.25 * currentUser.height - 5 * currentUser.age + 5;
        } else {
            bmr = 10 * currentUser.weight + 6.25 * currentUser.height - 5 * currentUser.age - 161;
        }
        
        // Activity multiplier
        let activityMultiplier;
        switch(currentUser.activity) {
            case 'sedentary': activityMultiplier = 1.2; break;
            case 'light': activityMultiplier = 1.375; break;
            case 'moderate': activityMultiplier = 1.55; break;
            case 'active': activityMultiplier = 1.725; break;
            case 'extreme': activityMultiplier = 1.9; break;
            default: activityMultiplier = 1.2;
        }
        
        const dailyCalories = Math.round(bmr * activityMultiplier);
        
        // Determine workout recommendation based on goal
        let recommendedWorkout, workoutCalories;
        switch(currentUser.goal) {
            case 'weight-loss':
                recommendedWorkout = 'Cardio Blast';
                workoutCalories = Math.round(dailyCalories * 0.15);
                break;
            case 'muscle-gain':
                recommendedWorkout = 'Strength Training';
                workoutCalories = Math.round(dailyCalories * 0.1);
                break;
            case 'endurance':
                recommendedWorkout = 'HIIT Circuit';
                workoutCalories = Math.round(dailyCalories * 0.2);
                break;
            default:
                recommendedWorkout = 'Full Body Workout';
                workoutCalories = Math.round(dailyCalories * 0.12);
        }
        
        // Set target weight based on goal
        let targetWeight = currentUser.weight;
        if (currentUser.goal === 'weight-loss') {
            targetWeight = Math.round(currentUser.weight * 0.95);
        } else if (currentUser.goal === 'muscle-gain') {
            targetWeight = Math.round(currentUser.weight * 1.05);
        }
        
        // Update dashboard with calculated values
        document.getElementById('displayHeight').textContent = currentUser.height;
        document.getElementById('displayWeight').textContent = currentUser.weight;
        document.getElementById('displayBMI').textContent = bmi;
        document.getElementById('bmiCategory').textContent = bmiCategory;
        document.getElementById('recommendedWorkout').textContent = recommendedWorkout;
        document.getElementById('caloriesEstimate').textContent = workoutCalories;
        document.getElementById('dailyCalories').textContent = dailyCalories.toLocaleString() + ' kcal';
        document.getElementById('targetWeight').textContent = targetWeight + ' kg';
        document.getElementById('heartRate').textContent = '72 bpm'; // Default value
    }
    
    function generateWorkoutCards() {
        const workoutCards = document.getElementById('workoutCards');
        if (!workoutCards) return;
        
        const workouts = [
            {
                name: 'Cardio Blast',
                type: 'Cardio',
                duration: '30 min',
                difficulty: 'Intermediate',
                calories: '300-400 kcal',
                exercises: ['Running', 'Jump Rope', 'Burpees', 'Mountain Climbers']
            },
            {
                name: 'Strength Training',
                type: 'Weights',
                duration: '45 min',
                difficulty: 'Advanced',
                calories: '250-350 kcal',
                exercises: ['Bench Press', 'Squats', 'Deadlifts', 'Pull-ups']
            },
            {
                name: 'Yoga Flow',
                type: 'Flexibility',
                duration: '60 min',
                difficulty: 'Beginner',
                calories: '200-300 kcal',
                exercises: ['Sun Salutations', 'Warrior Poses', 'Tree Pose', 'Savasana']
            }
        ];
        
        workoutCards.innerHTML = '';
        
        workouts.forEach(workout => {
            const card = document.createElement('div');
            card.className = 'workout-card';
            
            card.innerHTML = `
                <div class="workout-card-header">
                    <h3>${workout.name}</h3>
                    <p>${workout.type} • ${workout.duration} • ${workout.difficulty}</p>
                </div>
                <div class="workout-card-body">
                    <ul>
                        <li><span>Type:</span> <span>${workout.type}</span></li>
                        <li><span>Duration:</span> <span>${workout.duration}</span></li>
                        <li><span>Calories:</span> <span>${workout.calories}</span></li>
                        <li><span>Exercises:</span> <span>${workout.exercises.join(', ')}</span></li>
                    </ul>
                </div>
                <div class="workout-card-footer">
                    <button class="start-btn">Start Workout</button>
                </div>
            `;
            
            workoutCards.appendChild(card);
        });
    }
    
    function generateMacroData() {
        const macrosGrid = document.getElementById('macrosGrid');
        if (!macrosGrid) return;
        
        const macros = [
            { name: 'Protein', value: '150g', goal: '160g' },
            { name: 'Carbs', value: '200g', goal: '220g' },
            { name: 'Fats', value: '50g', goal: '60g' },
            { name: 'Fiber', value: '25g', goal: '30g' },
            { name: 'Sugar', value: '30g', goal: '25g' },
            { name: 'Water', value: '2.5L', goal: '3L' }
        ];
        
        macrosGrid.innerHTML = '';
        
        macros.forEach(macro => {
            const macroItem = document.createElement('div');
            macroItem.className = 'macro-item';
            
            macroItem.innerHTML = `
                <h4>${macro.name}</h4>
                <p>${macro.value}</p>
                <span>Goal: ${macro.goal}</span>
            `;
            
            macrosGrid.appendChild(macroItem);
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.profile-dropdown') && profileDropdown.classList.contains('active')) {
            profileDropdown.classList.remove('active');
        }
    });
});
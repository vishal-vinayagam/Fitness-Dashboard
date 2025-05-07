document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts when DOM is loaded
    initWeightChart();
    initActivityChart();
    initProgressWeightChart();
    
    // Time filter functionality
    setupTimeFilters();
});

function initWeightChart() {
    const ctx = document.getElementById('weightChart');
    if (!ctx) return;
    
    const weightData = generateWeightData('1M');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: weightData.labels,
            datasets: [{
                label: 'Weight (kg)',
                data: weightData.values,
                borderColor: '#000000',
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#000000',
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBorderWidth: 0
            }]
        },
        options: getChartOptions('Weight Progress (kg)', true)
    });
}

function initActivityChart() {
    const ctx = document.getElementById('activityChart');
    if (!ctx) return;
    
    const activityData = generateActivityData();
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: activityData.labels,
            datasets: [{
                label: 'Activity Minutes',
                data: activityData.values,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderColor: '#000000',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: getChartOptions('Weekly Activity (minutes)', false)
    });
}

function initProgressWeightChart() {
    const ctx = document.getElementById('progressWeightChart');
    if (!ctx) return;
    
    const weightData = generateWeightData('3M');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: weightData.labels,
            datasets: [{
                label: 'Weight (kg)',
                data: weightData.values,
                borderColor: '#000000',
                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#000000',
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBorderWidth: 0
            }]
        },
        options: getChartOptions('Weight Trend', true)
    });
}

function generateWeightData(timePeriod) {
    // Get current user data from localStorage
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const baseWeight = currentUser?.weight || 72; // Default to 72kg if no user data
    
    let labels = [];
    let values = [];
    const variation = 1.5; // ±1.5kg variation
    
    // Generate realistic weight data with a trend based on user's goal
    const goal = currentUser?.goal || 'maintenance';
    let trendDirection = 0; // 0 = maintain, -1 = lose, 1 = gain
    
    switch(goal) {
        case 'weight-loss': trendDirection = -1; break;
        case 'muscle-gain': trendDirection = 1; break;
        case 'endurance': trendDirection = -0.5; break;
        default: trendDirection = 0;
    }
    
    switch(timePeriod) {
        case '1M':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            values = labels.map((_, i) => {
                const trend = i * 0.3 * trendDirection;
                const fluctuation = (Math.random() * variation * 2) - variation;
                return Math.round((baseWeight + trend + fluctuation) * 10) / 10;
            });
            break;
        case '3M':
            labels = Array.from({length: 12}, (_, i) => `Week ${i+1}`);
            values = labels.map((_, i) => {
                const trend = i * 0.2 * trendDirection;
                const fluctuation = (Math.random() * variation * 2) - variation;
                return Math.round((baseWeight + trend + fluctuation) * 10) / 10;
            });
            break;
        case '6M':
            labels = Array.from({length: 6}, (_, i) => `Month ${i+1}`);
            values = labels.map((_, i) => {
                const trend = i * 0.8 * trendDirection;
                const fluctuation = (Math.random() * variation * 2) - variation;
                return Math.round((baseWeight + trend + fluctuation) * 10) / 10;
            });
            break;
        case '1Y':
            labels = Array.from({length: 12}, (_, i) => `Month ${i+1}`);
            values = labels.map((_, i) => {
                const trend = i * 0.4 * trendDirection;
                const fluctuation = (Math.random() * variation * 2) - variation;
                return Math.round((baseWeight + trend + fluctuation) * 10) / 10;
            });
            break;
        default:
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            values = [baseWeight, baseWeight + (0.3 * trendDirection), 
                     baseWeight + (0.6 * trendDirection), baseWeight + (0.9 * trendDirection)];
    }
    
    return { labels, values };
}

function generateActivityData() {
    // Get current user data from localStorage
    const storedUser = localStorage.getItem('currentUser');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const activityLevel = currentUser?.activity || 'moderate';
    
    let baseActivity;
    switch(activityLevel) {
        case 'sedentary': baseActivity = 15; break;
        case 'light': baseActivity = 30; break;
        case 'moderate': baseActivity = 45; break;
        case 'active': baseActivity = 60; break;
        case 'extreme': baseActivity = 90; break;
        default: baseActivity = 45;
    }
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return {
        labels: days,
        values: days.map((_, i) => {
            // Weekdays vs weekends pattern
            const isWeekend = i >= 5;
            const variation = isWeekend ? 30 : 15;
            
            // Generate random activity minutes with base and variation
            return Math.floor(Math.random() * variation) + 
                   (isWeekend ? baseActivity * 0.8 : baseActivity);
        })
    };
}

function getChartOptions(title, isLineChart) {
    const baseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: title,
                color: '#000000',
                font: {
                    size: 14,
                    weight: '500'
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
            tooltip: {
                backgroundColor: '#333',
                titleColor: '#fff',
                bodyColor: '#fff',
                titleFont: {
                    size: 12,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 12
                },
                padding: 10,
                displayColors: false,
                cornerRadius: 4,
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: '#777'
                }
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                    drawBorder: false,
                    tickLength: 0
                },
                ticks: {
                    color: '#777',
                    padding: 5
                }
            }
        },
        layout: {
            padding: {
                top: 10,
                right: 10,
                bottom: 5,
                left: 10
            }
        }
    };
    
    // Line chart specific options
    if (isLineChart) {
        baseOptions.elements = {
            line: {
                cubicInterpolationMode: 'monotone'
            }
        };
        baseOptions.scales.y.beginAtZero = false;
    } else {
        // Bar chart specific options
        baseOptions.scales.y.beginAtZero = true;
    }
    
    return baseOptions;
}

function setupTimeFilters() {
    const timeFilterButtons = document.querySelectorAll('.time-filter button');
    const weightChart = Chart.getChart('weightChart');
    
    timeFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            timeFilterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the time period
            const timePeriod = this.dataset.period;
            
            // Update the chart data
            if (weightChart) {
                const newData = generateWeightData(timePeriod);
                weightChart.data.labels = newData.labels;
                weightChart.data.datasets[0].data = newData.values;
                weightChart.update();
            }
        });
    });
}
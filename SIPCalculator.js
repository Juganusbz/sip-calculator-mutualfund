document.addEventListener('DOMContentLoaded', () => {
    const monthlySIPInput = document.getElementById('monthlySIP');
    const investmentDurationInput = document.getElementById('investmentDuration');
    const expectedReturnInput = document.getElementById('expectedReturn');
    const calculateBtn = document.getElementById('calculateBtn');

    const totalInvestedEl = document.getElementById('totalInvested');
    const estimatedReturnsEl = document.getElementById('estimatedReturns');
    const maturityValueEl = document.getElementById('maturityValue');

    const ctx = document.getElementById('sipChart').getContext('2d');
    let sipChart; 

    // Initialize Chart using Chart.js
    const initChart = (invested, returns) => {
        if (sipChart) {
            sipChart.destroy(); 
        }
        sipChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Total Invested', 'Estimated Returns'],
                datasets: [{
                    data: [invested, returns],
                    backgroundColor: [
                        '#6A0DAD', // Primary Purple for Invested
                        '#00CC66'  // Accent Green for Returns
                    ],
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, 
                animation: {
                    animateRotate: true,
                    animateScale: true
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    // Formats number to Indian Rupee (₹)
                                    label += new Intl.NumberFormat('en-IN', {
                                        style: 'currency',
                                        currency: 'INR',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0
                                    }).format(context.parsed);
                                }
                                return label;
                            }
                        }
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#444'
                        }
                    }
                }
            }
        });
    };

    // Main SIP Calculation Function
    const calculateSIP = () => {
        const monthlySIP = parseFloat(monthlySIPInput.value);
        const investmentDuration = parseFloat(investmentDurationInput.value); // Years
        const expectedReturn = parseFloat(expectedReturnInput.value); // Annual %

        if (isNaN(monthlySIP) || monthlySIP <= 0 ||
            isNaN(investmentDuration) || investmentDuration <= 0 ||
            isNaN(expectedReturn) || expectedReturn < 0) {
            alert('Please enter valid positive numbers for all fields.');
            return;
        }

        const numberOfMonths = investmentDuration * 12;
        const monthlyRate = expectedReturn / 100 / 12;

        let maturityValue = 0;
        if (monthlyRate === 0) {
            maturityValue = monthlySIP * numberOfMonths;
        } else {
            // Future Value of an Annuity Due (SIP Formula)
            // FV = P * { [(1+i)^n - 1] / i } * (1+i)
            maturityValue = monthlySIP * (Math.pow(1 + monthlyRate, numberOfMonths) - 1) / monthlyRate * (1 + monthlyRate);
        }

        const totalInvested = monthlySIP * numberOfMonths;
        const estimatedReturns = maturityValue - totalInvested;

        // Formatter for Indian Rupees (₹)
        const formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

        // Update UI with calculated values
        totalInvestedEl.textContent = formatter.format(totalInvested);
        estimatedReturnsEl.textContent = formatter.format(estimatedReturns);
        maturityValueEl.textContent = formatter.format(maturityValue);

        // Update Chart
        initChart(totalInvested, estimatedReturns);
    };

    // Attach event listener and run initial calculation
    calculateBtn.addEventListener('click', calculateSIP);
    calculateSIP();
});
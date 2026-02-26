let chartInstance = null;

document.getElementById('irsForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Collect all form data
    const formData = {
        taxType: document.getElementById('taxType').value,
        irsJovem: document.getElementById('irsJovem').value === 'sim',
        dependents: {
            age0_3: parseInt(document.getElementById('dep0_3').value) || 0,
            age4_6: parseInt(document.getElementById('dep4_6').value) || 0,
            age6plus: parseInt(document.getElementById('dep6plus').value) || 0
        },
        income: parseFloat(document.getElementById('income').value) || 0,
        withheld: parseFloat(document.getElementById('withheld').value) || 0,
        deductions: {
            general: parseFloat(document.getElementById('generalExpenses').value) || 0,
            health: parseFloat(document.getElementById('healthExpenses').value) || 0,
            education: parseFloat(document.getElementById('educationExpenses').value) || 0,
            housing: parseFloat(document.getElementById('housingExpenses').value) || 0,
            ppr: parseFloat(document.getElementById('ppr').value) || 0,
            donations: parseFloat(document.getElementById('donations').value) || 0
        }
    };

    try {
        // API URL
        const apiUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api/calculate'
            : '/api/calculate';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Erro ao calcular IRS');
        }

        const result = await response.json();
        displayResults(result, formData.withheld);

    } catch (error) {
        alert('Erro ao calcular o IRS. Por favor, verifica os dados e tenta novamente.');
        console.error(error);
    }
});

function displayResults(result, withheld) {
    // Show results section
    document.getElementById('results').classList.remove('hidden');
    
    // Calculate final value (to receive or pay)
    const finalValue = withheld - result.coleta;
    const finalValueEl = document.getElementById('finalValue');
    const finalValueDescEl = document.getElementById('finalValueDesc');
    
    if (finalValue > 0) {
        finalValueEl.textContent = `€${finalValue.toFixed(2)}`;
        finalValueEl.style.color = '#10b981'; // green
        finalValueDescEl.textContent = 'A receber (reembolso)';
    } else if (finalValue < 0) {
        finalValueEl.textContent = `€${Math.abs(finalValue).toFixed(2)}`;
        finalValueEl.style.color = '#ef4444'; // red
        finalValueDescEl.textContent = 'A pagar';
    } else {
        finalValueEl.textContent = `€${finalValue.toFixed(2)}`;
        finalValueEl.style.color = '#6b7280'; // gray
        finalValueDescEl.textContent = 'Sem reembolso ou pagamento';
    }
    
    // Display details
    document.getElementById('collectableIncome').textContent = `€${result.collectableIncome.toFixed(2)}`;
    document.getElementById('baseTax').textContent = `€${result.baseTax.toFixed(2)}`;
    document.getElementById('specificDeductions').textContent = `-€${result.specificDeductions.toFixed(2)}`;
    document.getElementById('deductionsToColeta').textContent = `-€${result.deductionsToColeta.toFixed(2)}`;
    document.getElementById('coleta').textContent = `€${result.coleta.toFixed(2)}`;
    document.getElementById('withheldDisplay').textContent = `€${withheld.toFixed(2)}`;
    
    // Create chart
    createChart(result, withheld);
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function createChart(result, withheld) {
    const ctx = document.getElementById('chart').getContext('2d');
    
    // Destroy previous chart if exists
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Imposto Base', 'Deduções Específicas', 'Deduções à Coleta', 'Coleta Final', 'Retenção'],
            datasets: [{
                label: 'Valores (€)',
                data: [
                    result.baseTax,
                    result.specificDeductions,
                    result.deductionsToColeta,
                    result.coleta,
                    withheld
                ],
                backgroundColor: [
                    '#ef4444',
                    '#10b981',
                    '#10b981',
                    '#3b82f6',
                    '#6b7280'
                ],
                borderRadius: 8,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `€${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: '#f3f4f6'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

document.getElementById('irsForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const income = parseFloat(document.getElementById('income').value);
    const dependents = parseInt(document.getElementById('dependents').value);
    const expenses = parseFloat(document.getElementById('expenses').value);

    try {
        // Fetch calculations from the API
        const apiUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3000/api/calculate'
            : '/api/calculate';
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ income, dependents, expenses }),
        });

        if (!response.ok) {
            throw new Error('Erro ao conectar à API.');
        }

        const data = await response.json();
        const { baseTax, totalDeductions, totalTax } = data;

        // Display results in the UI
        document.getElementById('result').innerText = `
            Imposto Base: €${baseTax} | Deduções: €${totalDeductions} | Imposto Final: €${totalTax}`;

        // Create a chart
        const ctx = document.getElementById('chart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Base Tax', 'Deductions', 'Final Tax'],
                datasets: [{
                    label: 'Valores (€)',
                    data: [baseTax, totalDeductions, totalTax],
                    backgroundColor: ['#f87171', '#60a5fa', '#4ade80'],
                }],
            },
        });
    } catch (error) {
        document.getElementById('result').innerText = 'Erro ao calcular o IRS. Verifique os dados e tente novamente.';
        console.error(error);
    }
});
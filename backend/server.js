const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const taxTables = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'tax-tables.json'))
);

// IRS calculation route
app.post('/api/calculate', (req, res) => {
    const { 
        taxType,
        irsJovem,
        dependents,
        income,
        withheld,
        deductions
    } = req.body;

    const year = "2026";
    const tables = taxTables[year];
    const escaloes = tables.escaloes;
    
    // Calculate specific deductions (deduções específicas) - 4.104€ fixed for Cat. A
    const specificDeductions = Math.min(income * 0.25, 4104);
    
    // Calculate collectable income (rendimento coletável)
    const collectableIncome = Math.max(income - specificDeductions, 0);
    
    // Calculate family quotient (quoficiente familiar)
    let quotient = 1;
    const totalDependents = (dependents.age0_3 || 0) + (dependents.age4_6 || 0) + (dependents.age6plus || 0);
    
    if (taxType === 'married') {
        quotient = 2 + (totalDependents * 0.3);
    } else {
        if (totalDependents >= 1) quotient = 1.4 + ((totalDependents - 1) * 0.3);
    }
    
    // Income for tax calculation
    const incomeForTax = collectableIncome / quotient;
    
    // Calculate base tax using progressive brackets
    let baseTax = 0;
    for (const escalao of escaloes) {
        if (incomeForTax > escalao.min) {
            const maxIncome = escalao.max || incomeForTax;
            const taxableAmount = Math.min(incomeForTax, maxIncome) - escalao.min;
            baseTax += taxableAmount * escalao.rate;
        }
    }
    
    // Apply quotient to get total tax
    baseTax = baseTax * quotient;
    
    // Calculate deductions to coleta (deduções à coleta)
    let deductionsToColeta = 0;
    
    // General and family expenses - 35% up to 250€
    deductionsToColeta += Math.min((deductions.general || 0) * 0.35, 250);
    
    // Health expenses - 15% without limit
    deductionsToColeta += (deductions.health || 0) * 0.15;
    
    // Education expenses - 30% up to 800€
    deductionsToColeta += Math.min((deductions.education || 0) * 0.30, 800);
    
    // Housing expenses - 15% up to 502€
    deductionsToColeta += Math.min((deductions.housing || 0) * 0.15, 502);
    
    // PPR - 20% up to 400€ (or 350€ depending on age)
    const pprLimit = 400;
    deductionsToColeta += Math.min((deductions.ppr || 0) * 0.20, pprLimit);
    
    // Donations - 25% without specific limit (simplified)
    deductionsToColeta += (deductions.donations || 0) * 0.25;
    
    // Dependents deduction
    const depDeduction = (dependents.age0_3 || 0) * 726 + 
                         (dependents.age4_6 || 0) * 600 + 
                         (dependents.age6plus || 0) * 600;
    deductionsToColeta += depDeduction;
    
    // Calculate final coleta (tax to pay)
    const coleta = Math.max(baseTax - deductionsToColeta, 0);
    
    res.json({
        collectableIncome: parseFloat(collectableIncome.toFixed(2)),
        baseTax: parseFloat(baseTax.toFixed(2)),
        specificDeductions: parseFloat(specificDeductions.toFixed(2)),
        deductionsToColeta: parseFloat(deductionsToColeta.toFixed(2)),
        coleta: parseFloat(coleta.toFixed(2))
    });
});

app.get('/', (req, res) => {
    res.send('Servidor ativo! Utilize a rota /api/calculate para simular o IRS.');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
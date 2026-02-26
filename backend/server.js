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
    const { income, dependents, expenses } = req.body;
    const year = "2026";

    const tables = taxTables[year];
    const escaloes = tables.escaloes;
    const deductions = tables.deductions;

    let baseTax = 0;
    for (const escalao of escaloes) {
        if (income > escalao.min) {
            const taxable = Math.min(income, escalao.max || income) - escalao.min;
            baseTax += taxable * escalao.rate;
        }
    }

    const totalDeductions = (dependents * deductions.dependents) + (expenses * deductions.health);

    const totalTax = baseTax - totalDeductions;

    res.json({
        baseTax: baseTax.toFixed(2),
        totalDeductions: totalDeductions.toFixed(2),
        totalTax: Math.max(totalTax, 0).toFixed(2) // Ensure no negative tax
    });
});

app.get('/', (req, res) => {
    res.send('Servidor ativo! Utilize a rota /api/calculate para simular o IRS.');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
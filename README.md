# 🧮 Simulador de IRS (Portuguese Tax Simulator)

A web-based IRS (Portuguese Income Tax) calculator inspired by Coverflex's simulator.

## 🌟 Features

- Calculate Portuguese IRS tax based on 2026 tax brackets
- Account for dependents and deductible expenses
- Visual breakdown with charts
- Clean, modern UI with Tailwind CSS
- Real-time calculations

## 📁 Project Structure

```
IRS_Simulator/
├── backend/           # Express.js API
│   ├── server.js      # Main server file
│   ├── tax-tables.json # 2026 IRS tax brackets
│   └── package.json   # Backend dependencies
├── frontend/          # Static frontend
│   ├── index.html     # Main HTML
│   ├── app.js         # JavaScript logic
│   └── style.css      # Styling
└── database/          # Future: store simulations
    └── data.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Start the Backend Server**
   ```bash
   npm start
   # Server runs on http://localhost:3000
   ```

3. **Open the Frontend**
   - Open `frontend/index.html` in your browser
   - Or use a simple HTTP server:
     ```bash
     cd frontend
     python3 -m http.server 8080
     # Visit http://localhost:8080
     ```

## 💡 How to Use

1. Enter your **Gross Income** (€)
2. Enter **Number of Dependents**
3. Enter **Deductible Expenses** (€)
4. Click **Calculate**
5. View your tax breakdown with visual chart

## 📊 Tax Calculation

Based on Portuguese IRS 2026 tax brackets:

| Income Range (€) | Tax Rate |
|------------------|----------|
| 0 - 7,112        | 14.5%    |
| 7,113 - 10,732   | 23%      |
| 10,733 - 20,322  | 28.5%    |
| 20,323 - 25,075  | 35%      |
| 25,076 - 36,967  | 37.5%    |
| 36,968 - 80,882  | 45%      |
| 80,883+          | 48%      |

### Deductions

- **Per Dependent**: €600
- **Health Expenses**: 15% deductible
- **Education Expenses**: 30% deductible

## 🚢 Deployment

### Deploy Backend (Vercel/Railway/Render)

```bash
cd backend
# Deploy to your chosen platform
```

### Deploy Frontend (Vercel/Netlify)

```bash
cd frontend
vercel
# or
netlify deploy
```

## 🔧 API Endpoints

### `POST /api/calculate`

Calculate IRS tax based on income and deductions.

**Request Body:**
```json
{
  "income": 30000,
  "dependents": 2,
  "expenses": 5000
}
```

**Response:**
```json
{
  "baseTax": "8543.50",
  "totalDeductions": "1950.00",
  "totalTax": "6593.50"
}
```

## 📝 Future Enhancements

- [ ] Save simulations to database
- [ ] Multi-year comparisons
- [ ] Different tax regimes (single vs. married)
- [ ] Detailed breakdown by expense categories
- [ ] Export results as PDF
- [ ] Social Security calculations
- [ ] Net salary calculator

## 🤝 Contributing

Feel free to fork and submit PRs!

## 📄 License

MIT License - Feel free to use for your projects

---

**Note**: This is a simulation tool. For official tax calculations, consult the Portuguese Tax Authority (Autoridade Tributária e Aduaneira).

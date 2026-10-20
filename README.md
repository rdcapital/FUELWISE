# FuelWise — Vehicle Fuel & Maintenance Tracker

FuelWise is a web application designed to help vehicle owners keep track of fuel purchases, monitor fuel consumption and expenses, and manage vehicle maintenance records in one place.

The project provides a digital alternative to manually recording vehicle expenses in notebooks or spreadsheets.

## Live Demo

**Try FuelWise:** https://fuelwise-flax.vercel.app/



## Screenshots

<img width="1920" height="902" alt="Screenshot 2026-10-01 141641" src="https://github.com/user-attachments/assets/d34888e8-6210-48b0-8430-b51edabc1873" />

<img width="1920" height="908" alt="Screenshot 2026-10-01 141653" src="https://github.com/user-attachments/assets/7a691a20-8cc0-470d-bcc0-20d5e43fc100" />

<img width="1920" height="918" alt="Screenshot 2026-10-01 141737" src="https://github.com/user-attachments/assets/f124dbf9-2131-428d-91d5-c5cc4e7d2ade" />

<img width="1920" height="912" alt="Screenshot 2026-10-01 141808" src="https://github.com/user-attachments/assets/fb38e7f1-dd49-4064-a71e-7c8ec3d3fa24" />





## Features

- **Fuel Tracking:** Record fuel purchases and keep track of fuel-related expenses.
- **Fuel Consumption:** Calculate fuel efficiency using recorded fuel and odometer data.
- **Expense Monitoring:** Review fuel spending and related vehicle expenses.
- **Maintenance Tracking:** Record vehicle maintenance activities and monitor servicing needs.
- **Data Visualization:** Use charts to understand fuel spending and vehicle-related trends.
- **Persistent Storage:** Save records in the browser using localStorage.
- **Responsive Interface:** Use the application across different screen sizes.

## Technologies Used

- React
- JavaScript
- Tailwind CSS
- React Context API
- useReducer
- React Hooks and custom hooks
- Recharts
- localStorage
- Vite
- Vercel

## How It Works

FuelWise allows users to record fuel purchases and vehicle maintenance activities through the application interface.

The application organizes these records and uses them to calculate relevant figures and display summaries and charts.

React Context and useReducer are used to manage shared application state, while localStorage allows records to persist in the browser between sessions.

Recharts is used to present selected vehicle and fuel information visually.

## Getting Started

To run FuelWise locally, follow these steps.

### Prerequisites

- Node.js
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rdcapital/FUELWISE.git
   ```

2. Navigate into the project directory:

   ```bash
   cd FUELWISE
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

## Data Storage

FuelWise uses browser localStorage to retain application records between sessions.

Because the records are stored in the browser, they are not automatically synchronized across different browsers or devices.

Clearing the browser's stored site data may remove saved records.

## What I Learned

Building FuelWise helped me practise:

- Creating reusable React components.
- Managing shared application state with Context API and useReducer.
- Organizing logic using React Hooks and custom hooks.
- Working with arrays of records and calculating fuel-related figures.
- Displaying data through charts.
- Persisting application data with localStorage.
- Building responsive interfaces with Tailwind CSS.
- Deploying a React application using Vercel.

## Future Improvements

Potential improvements include:

- Adding automated tests for important calculations and user interactions.
- Improving data export and backup options.
- Introducing cloud storage and user authentication.
- Enhancing accessibility and performance.
- Exploring additional insights into vehicle fuel consumption and maintenance.

## Author

**Rodney Ansong**

- GitHub: https://github.com/rdcapital
- Portfolio: https://rodportfolio.lovable.app/

## Project Status

FuelWise is a personal software development project built for practical learning and demonstration.

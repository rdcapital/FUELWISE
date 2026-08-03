const storageKey = 'fuel-demo-entries';
const tripForm = document.getElementById('tripForm');
const tripList = document.getElementById('tripList');
const efficiencyEl = document.getElementById('efficiency');
const totalDistanceEl = document.getElementById('totalDistance');
const totalCostEl = document.getElementById('totalCost');

const initialEntries = [
  { date: '2026-07-20', distance: 120, fuel: 10, price: 18.5 },
  { date: '2026-07-24', distance: 95, fuel: 8, price: 18.2 }
];

let entries = JSON.parse(localStorage.getItem(storageKey) || 'null');
if (!entries || entries.length === 0) {
  entries = initialEntries;
  localStorage.setItem(storageKey, JSON.stringify(entries));
}

function formatCurrency(value) {
  return `R${value.toFixed(2)}`;
}

function calculateAverageEfficiency(items) {
  if (!items.length) return 0;
  const totalDistance = items.reduce((sum, item) => sum + Number(item.distance), 0);
  const totalFuel = items.reduce((sum, item) => sum + Number(item.fuel), 0);
  return totalFuel ? totalDistance / totalFuel : 0;
}

function calculateTotals(items) {
  const totalDistance = items.reduce((sum, item) => sum + Number(item.distance), 0);
  const totalCost = items.reduce((sum, item) => sum + Number(item.fuel) * Number(item.price), 0);
  return { totalDistance, totalCost };
}

function render() {
  const avgEfficiency = calculateAverageEfficiency(entries);
  const { totalDistance, totalCost } = calculateTotals(entries);

  efficiencyEl.textContent = `${avgEfficiency.toFixed(1)} km/L`;
  totalDistanceEl.textContent = `${totalDistance.toFixed(0)} km`;
  totalCostEl.textContent = formatCurrency(totalCost);

  if (!entries.length) {
    tripList.innerHTML = '<li>No trips yet. Add one above.</li>';
    return;
  }

  tripList.innerHTML = entries
    .map((entry) => {
      const efficiency = Number(entry.distance) / Number(entry.fuel);
      const cost = Number(entry.fuel) * Number(entry.price);
      return `
        <li>
          <div>
            <strong>${entry.date}</strong><br />
            ${entry.distance} km · ${entry.fuel} L
          </div>
          <div>
            ${efficiency.toFixed(1)} km/L<br />
            ${formatCurrency(cost)}
          </div>
        </li>
      `;
    })
    .join('');
}

tripForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(tripForm);
  const entry = {
    date: formData.get('date') || document.getElementById('date').value,
    distance: Number(document.getElementById('distance').value),
    fuel: Number(document.getElementById('fuel').value),
    price: Number(document.getElementById('price').value)
  };

  entries.unshift(entry);
  localStorage.setItem(storageKey, JSON.stringify(entries));
  tripForm.reset();
  document.getElementById('date').valueAsDate = new Date();
  render();
});

render();

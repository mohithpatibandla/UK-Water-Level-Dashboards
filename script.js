// Guard
if (!Array.isArray(damData)) {
  console.warn("damData missing or not an array");
}

// Map
const map = L.map('map').setView([54.5, -3], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

// Hover Info
const hoverInfo = document.getElementById('hover-info');

function moveHoverBox(e) {
  hoverInfo.style.top = (e.clientY + 10) + 'px';
  hoverInfo.style.left = (e.clientX + 10) + 'px';
}

(damData || []).forEach((dam, i) => {
  if (dam.latitude != null && dam.longitude != null) {
    const color = damColors[i % damColors.length];
    const icon = L.divIcon({
      className: 'custom-icon',
      html: `<div style="background-color:${color};width:15px;height:15px;border-radius:50%;border:2px solid #333;"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const popupHTML = `
      <b>${dam.name ?? 'Reservoir'}</b><br>
      Country: ${dam.country ?? '—'}<br>
      County: ${dam.county ?? '—'}<br>
      Max Volume (m³): ${dam.maxVolume_m3 ?? '—'}<br>
      Planning: ${dam.planningDate ?? '—'}<br>
      Completion: ${dam.completionDate ?? '—'}
    `;

    const marker = L.marker([dam.latitude, dam.longitude], { icon })
      .addTo(map)
      .bindPopup(popupHTML);

    marker.on('mouseover', () => {
      hoverInfo.classList.remove('hidden');
      hoverInfo.innerHTML = popupHTML;
      map.getContainer().addEventListener('mousemove', moveHoverBox);
    });
    marker.on('mouseout', () => {
      hoverInfo.classList.add('hidden');
      map.getContainer().removeEventListener('mousemove', moveHoverBox);
    });
  }
});

// Chart: Top 20 by Max Volume
const canvasEl = document.getElementById('storageChart');
if (canvasEl) {
  const byVol = (damData || [])
    .filter(d => typeof d.maxVolume_m3 === 'number' && !Number.isNaN(d.maxVolume_m3))
    .sort((a, b) => b.maxVolume_m3 - a.maxVolume_m3)
    .slice(0, 20);

  const labels = byVol.map(d => d.name || 'Reservoir');
  const values = byVol.map(d => d.maxVolume_m3);

  const ctx = canvasEl.getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Max Volume (m³)',
        data: values,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

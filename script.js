// Initialize the map
const map = L.map('map').setView([54.5, -3], 6);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Hover Info box
const hoverInfo = document.getElementById('hover-info');

// Add dam markers with matching color
damData.forEach((dam, index) => {
  if (dam.latitude && dam.longitude) {
    const color = damColors[index % damColors.length];

    const icon = L.divIcon({
      className: 'custom-icon',
      html: `<div style="background-color:${color};width:15px;height:15px;border-radius:50%;border:2px solid #333;"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const marker = L.marker([dam.latitude, dam.longitude], { icon })
      .addTo(map)
      .bindPopup(`<b>${dam.name}</b><br>Water Level: ${dam.waterLevel} m<br>Storage: ${dam.storagePercentage}%<br>Rainfall: ${dam.rainfall} mm`);

    marker.on('mouseover', function () {
      hoverInfo.classList.remove('hidden');
      hoverInfo.innerHTML = `
        <strong>${dam.name}</strong><br>
        Water Level: ${dam.waterLevel} <br>
        Storage: ${dam.storagePercentage}<br>
        Rainfall: ${dam.rainfall} 
      `;
      map.getContainer().addEventListener('mousemove', moveHoverBox);
    });

    marker.on('mouseout', function () {
      hoverInfo.classList.add('hidden');
      map.getContainer().removeEventListener('mousemove', moveHoverBox);
    });
  }
});

function moveHoverBox(e) {
  hoverInfo.style.top = (e.clientY + 10) + 'px';
  hoverInfo.style.left = (e.clientX + 10) + 'px';
}

// Storage Chart
const ctx = document.getElementById('storageChart').getContext('2d');
const storageChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: damData.map(d => d.name),
    datasets: [{
      label: 'Storage %',
      data: damData.map(d => parseFloat(d.storagePercentage)),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }
});

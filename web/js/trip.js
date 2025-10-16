const API_BASE_URL = "http://localhost:8080"; 
let currentLimit = 10;
let currentPage = 0;
let currentMonth = 0;
let totalRecords = 0;

// DOM elements
const prevBtn = document.querySelector('#prev-btn');
const nextBtn = document.querySelector('#next-btn');
const pageStatus = document.querySelector('#page-info');

// Map button click
document.addEventListener('click', function(e) {
  if (e.target.id === 'show-map') {
    const pickupLat = e.target.dataset.pickupLat;
    const pickupLng = e.target.dataset.pickupLng;
    const dropoffLat = e.target.dataset.dropoffLat;
    const dropoffLng = e.target.dataset.dropoffLng;
    const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${pickupLat},${pickupLng}&destination=${dropoffLat},${dropoffLng}&travelmode=driving`;

    window.open(mapUrl, '_blank');
  }
});

// Previous button
prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        fetchmonth();
    }
});

// Next button
nextBtn.addEventListener('click', () => {
    if ((currentPage + 1) * currentLimit < totalRecords) {
        currentPage++;
        fetchmonth();
    }
});

// Convert seconds
function convertSeconds(seconds) {
    const wholeSecond = Math.floor(seconds);
    const hours = Math.floor(wholeSecond / 3600);
    const minutes = Math.floor((wholeSecond % 3600) / 60);
    const remainingSeconds = wholeSecond % 60;
    if (hours < 1){
        return `${minutes}mins ${remainingSeconds}seconds`
    } else {        
        return `${hours}hr ${minutes}mins ${remainingSeconds}seconds`;
    }
}

// Fetch month data
async function fetchmonth() {
    try{
        const pageURL = new URLSearchParams(window.location.search);
        const month = pageURL.get('month');
        currentMonth = month;

        const skip = currentPage * currentLimit;

        const params = new URLSearchParams({
            skip,
            limit: currentLimit,
        });

        const url = `${API_BASE_URL}/trip/month/${month}?${params.toString()}`;
        const response = await fetch(url);
        const data = await response.json();

        totalRecords = data.total_trip; 
        const monthName = document.querySelector('#month-header');
        const totalTrips = document.querySelector('#total-trips');
        const avgDuration = document.querySelector('#avg-duration');
        const totalPassengers = document.querySelector('#total-passengers');

        monthName.innerHTML = `${data.month_name} Analytics`;
        totalTrips.innerHTML = data.total_trip;
        avgDuration.innerHTML = convertSeconds(data.average_trip_duration);
        totalPassengers.innerHTML = data.total_passenger;

        const trips = data.data;

        renderTable(trips);
        updatePagination(totalRecords, skip, currentLimit);

        return data.total_trip;
    } catch (err) {
        console.error("Error fetching months data:", err)
    }
}

// Render table
function renderTable(trips) {
    const tableBody = document.querySelector('#trips-table-body');
    tableBody.innerHTML = '';

    if (!trips.length) {
        tableBody.innerHTML = '<tr><td colspan="7">No trips found for this selection.</td></tr>';
        return;
    }

    trips.forEach(trip => {
        tableBody.innerHTML +=`
            <tr>
                <td>${trip.vendor_name}</td>
                <td>${trip.trip_pickup_date}</td>
                <td>${trip.trip_duration}</td>
                <td>${trip.trip_passenger_count}</td>
                <td>
                    <button class="btn btn-outline" id="show-map"
                        data-pickup-lat="${trip.location_pickup_latitude}" 
                        data-pickup-lng="${trip.location_pickup_longitude}"
                        data-dropoff-lat="${trip.location_dropoff_latitude}" 
                        data-dropoff-lng="${trip.location_dropoff_longitude}">
                        Show Map
                    </button>
                </td>
            </tr>
        `;
    });
}

// Update pagination UI
function updatePagination(total, skip, limit) {
    const totalPages = Math.ceil(total / limit);
    const currentPageNumber = Math.floor(skip / limit) + 1;

    pageStatus.textContent = total > 0 ? `Page ${currentPageNumber} of ${totalPages}` : 'No data';
    prevBtn.disabled = currentPageNumber === 1 || total === 0;
    nextBtn.disabled = currentPageNumber === totalPages || total === 0;
}

// Initial fetch
fetchmonth();

// Configuration
const API_BASE_URL = "http://localhost:8080"; // CHANGE THIS if your port is different

// DOM Elements
let month = document.querySelector('#month-select')
let monthDetail = document.querySelector('#show-month')

//onload

fetchAnalytics()
fetchMonth(month.value)

// Event Listeners
month.addEventListener('change', function () {
    const selectedValue = this.value;
    fetchMonth(selectedValue)
});

monthDetail.addEventListener('click', function (e) {
    e.preventDefault();
   
    const window_url = `/web/trip.html?month=${month.value}`;
    window.open(window_url, '_blank')

});

function convertSeconds(seconds) {
    let wholeSecond = Math.floor(seconds)
    const hours = Math.floor(wholeSecond / 3600);
    const minutes = Math.floor((wholeSecond % 3600) / 60);
    const remainingSeconds = wholeSecond % 60;
    if (hours < 1){
        return`${minutes}mins ${remainingSeconds}seconds`
    } else {
        return `${hours}hr ${minutes}mins ${remainingSeconds}seconds`;
    }
}

async function fetchAnalytics() {
    try {
        let currentLimit = 1
        let params = new URLSearchParams({
            limit: currentLimit,
        })

        let url = `${API_BASE_URL}/trip?${params.toString()}`

        let response = await fetch(url)
        let data = await response.json()

        const totalTrips = document.querySelector('#total-trips')
        const avgDuration = document.querySelector('#avg-duration')
        const totalPassengers = document.querySelector('#total-passengers')

        totalTrips.innerHTML = ''
        avgDuration.innerHTML = ''
        totalPassengers.innerHTML = ''
        let formattedTime = convertSeconds(data.average_trip_duration)

        totalTrips.innerHTML = data.total_trip
        avgDuration.innerHTML = formattedTime
        totalPassengers.innerHTML = data.total_passenger
    } catch (err) {
        console.error("Error fetching analytics data:", err)
    }
}

async function fetchMonth(month) {
    try {
        let month_number = parseInt(month)

        let currentLimit = 1
        let params = new URLSearchParams({
            limit: currentLimit,
        })

        const monthName = document.querySelector('#month-name')
        const totalTrips = document.querySelector('#month-total-trips')
        
        monthName.innerHTML = ''
        totalTrips.innerHTML = ''

        let url = `${API_BASE_URL}/trip/month/${month_number}?${params.toString()}`

        let response = await fetch(url)
        let data = await response.json()
        
        monthName.innerHTML = data.month_name || "No Data"
        totalTrips.innerHTML = `Total trip: ${data.total_trip || "No Data"}`
    } catch (err) {
        console.error(`Error fetching data for month ${month}:`, err)
    }
}

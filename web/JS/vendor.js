const API_BASE_URL = "http://localhost:8080"; // CHANGE THIS if your port is different

vendorDetails()

function convertSeconds(seconds) {
    wholeSecond = Math.floor(seconds)
    const hours = Math.floor(wholeSecond / 3600);
    const minutes = Math.floor((wholeSecond % 3600) / 60);
    const remainingSeconds = wholeSecond % 60;
    if (hours < 1){
        return`${minutes}mins ${remainingSeconds}seconds`
    } else {     
        return `${hours}hr ${minutes}mins ${remainingSeconds}seconds`;
    }
}

async function vendorDetails() {
    try{
        vendors = document.querySelector('#vendors')
        vendors.innerHTML = ''
        url = `${API_BASE_URL}/vendor`
        response = await fetch(url)
        datas = await response.json()
    
        datas.forEach(data =>{
            vendors.innerHTML += `
            <div class="metric-card">
                <div class="metric-content">
                    <h1>${data.name}</h1>
                    <p>${data.descrption}</p>
                    <div class="metric-card">
                        <div class="metric-icon">
                            <i class="fas fa-route"></i>
                        </div>
                        <div class="metric-content">
                            <p>Total Trips</p>
                            <h3>${data.trip_count}</h3>
                        </div>
                    </div>
    
                    <div class="metric-card">
                        <div class="metric-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="metric-content">
                            <p>Avg Duration</p>
                            <h3>${convertSeconds(data.average_trip_duration)}</h3>
                        </div>
                    </div>
    
                    <div class="metric-card">
                        <div class="metric-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="metric-content">
                            <p>Total Passengers</p>
                            <h3>${data.total_passenger}</h3>
                        </div>
                    </div>
                </div>
            </div>
            `
        })
    } catch (err) {
        console.error("Error fetching vendors data:", err)
    }

}
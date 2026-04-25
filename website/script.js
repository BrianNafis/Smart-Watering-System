const apiKey = '44743e72071de2b55d00375d4b6a3ee7';

// Fungsi untuk mengambil data cuaca dari API OpenWeather
async function getWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (data.cod === 200) {
            document.getElementById('location').textContent = `Location: ${data.name}, ${data.sys.country}`;
            document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
            document.getElementById('weather-description').textContent = `Weather: ${data.weather[0].description}`;
            
            // Deteksi jika hujan dan ubah mode ke manual
            if (data.weather[0].main.toLowerCase().includes('rain')) {
                setWateringMode('manual');
            }
        } else {
            alert('City not found!');
        }
    } catch (error) {
        alert('Failed to fetch weather data. Please try again later.');
    }
}

// Fungsi untuk mengambil data moisture dari database
async function fetchMoistureData() {
    try {
        // Tampilkan pesan awal untuk memastikan fungsi dipanggil
        console.log('Memulai fetch data...');
        
        // Tampilkan elemen yang akan diupdate
        const moistureElement = document.getElementById('soil-moisture');
        const timestampElement = document.getElementById('last-update');
        
        console.log('Element soil-moisture:', moistureElement);
        console.log('Element last-update:', timestampElement);

        // Test update langsung ke elemen
        moistureElement.textContent = 'Mencoba mengambil data...';
        
        const response = await fetch('control.php');
        const data = await response.json();
        
        console.log('Data yang diterima:', data);

        if (data.success) {
            // Pastikan data.data.moisture ada
            console.log('Nilai moisture:', data.data.moisture);
            
            const moistureValue = parseFloat(data.data.moisture);
            moistureElement.textContent = `Soil Moisture: ${moistureValue.toFixed(2)}%`;
            
            const timestamp = new Date(data.data.timestamp).toLocaleString();
            timestampElement.textContent = `Time stamp: ${timestamp}`;
            
            console.log('Data berhasil diupdate');
        } else {
            console.error('Gagal mengambil data:', data.message);
            moistureElement.textContent = 'Soil Moisture: Error getting data';
            timestampElement.textContent = 'Time stamp: Error getting data';
        }
    } catch (error) {
        console.error('Error dalam fetchMoistureData:', error);
        document.getElementById('soil-moisture').textContent = 'Soil Moisture: Error';
        document.getElementById('last-update').textContent = 'Time stamp: Error';
    }
}

// Fungsi untuk memulai polling data moisture
function startMoisturePolling() {
    console.log('Memulai polling data...');
    // Ambil data setiap 5 detik
    setInterval(fetchMoistureData, 5000);
}

// Pastikan script.js terhubung dan berjalan
console.log('Script.js dimuat!');

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    console.log('Halaman dimuat, memulai inisialisasi...');
    
    // Test update langsung ke elemen
    const moistureElement = document.getElementById('soil-moisture');
    if (moistureElement) {
        moistureElement.textContent = 'Soil Moisture: Initializing...';
        console.log('Berhasil update teks awal');
    } else {
        console.error('Tidak dapat menemukan element soil-moisture');
    }
    
    // Ambil data moisture pertama kali
    fetchMoistureData();
    
    // Mulai polling data moisture
    startMoisturePolling();
});

 // Test update langsung ke elemen
    const moistureElement = document.getElementById('soil-moisture');
    if (moistureElement) {
        moistureElement.textContent = 'Soil Moisture: Initializing...';
        console.log('Berhasil update teks awal');
    } else {
        console.error('Tidak dapat menemukan element soil-moisture');
    }

// Fungsi untuk mengecek dan mengaktifkan penyiraman otomatis
function checkAutoWatering(moistureValue) {
    const threshold = 30; // Batas kelembaban tanah (dapat disesuaikan)
    if (moistureValue < threshold) {
        console.log('Moisture below threshold, starting watering...');
        // Di sini bisa ditambahkan kode untuk mengaktifkan pompa air
    }
}

// Fungsi untuk mengirim perintah ke perangkat IoT dan mengaktifkan mode yang dipilih
function setWateringMode(mode) {
    console.log(`Setting mode to ${mode}`);

    // Update tampilan tombol aktif
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (mode === 'auto') {
        document.getElementById('auto-mode-btn').classList.add('active');
    } else if (mode === 'interval') {
        document.getElementById('interval-mode-btn').classList.add('active');
        showIntervalPopup();
    } else {
        document.getElementById('manual-mode-btn').classList.add('active');
    }
}

// Fungsi untuk menampilkan popup pengaturan interval
function showIntervalPopup() {
    document.getElementById('interval-popup').classList.remove('hidden');
}

// Fungsi untuk menyembunyikan popup
function hideIntervalPopup() {
    document.getElementById('interval-popup').classList.add('hidden');
}

// Event listeners untuk kontrol penyiraman
document.getElementById('auto-mode-btn').addEventListener('click', () => {
    hideIntervalPopup();
    setWateringMode('auto');
});

document.getElementById('interval-mode-btn').addEventListener('click', () => {
    setWateringMode('interval');
});

document.getElementById('manual-mode-btn').addEventListener('click', () => {
    hideIntervalPopup();
    setWateringMode('manual');
});

// Event listener untuk set interval
document.getElementById('set-interval-btn').addEventListener('click', () => {
    const hours = document.getElementById('interval-hours').value;
    const minutes = document.getElementById('interval-minutes').value;
    
    if (hours === '' && minutes === '') {
        alert('Please enter hours or minutes');
        return;
    }
    
    const intervalTime = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
    if (intervalTime <= 0) {
        alert('Please enter a valid time interval');
        return;
    }

    alert(`Watering interval set to ${hours} hours and ${minutes} minutes`);
    hideIntervalPopup();
    
    // Mulai interval penyiraman
    setInterval(() => {
        if (document.getElementById('interval-mode-btn').classList.contains('active')) {
            console.log('Interval watering activated');
            // Di sini bisa ditambahkan kode untuk mengaktifkan pompa air
        }
    }, intervalTime * 60 * 1000);
});

// Event listener untuk tombol 'Get Weather'
document.getElementById('get-weather-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeatherData(city);
    } else {
        alert('Please enter a city name');
    }
});

// Fungsi untuk memulai polling data moisture 
function startMoisturePolling() {
    // Ambil data setiap 5 detik
    setInterval(fetchMoistureData, 5000);
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Ambil data cuaca
    const defaultCity = 'Jakarta';
    getWeatherData(defaultCity);
    
    // Ambil data moisture pertama kali
    fetchMoistureData();
    
    // Mulai polling data moisture
    startMoisturePolling();
});

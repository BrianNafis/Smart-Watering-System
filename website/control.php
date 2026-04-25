<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Koneksi database
$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'moisture_data';

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Koneksi gagal: ' . $conn->connect_error]));
}

// Query untuk mengambil data terbaru
$sql = "SELECT data, timestamp 
        FROM moisture_readings 
        ORDER BY timestamp DESC 
        LIMIT 1";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode([
        'success' => true,
        'data' => [
            'moisture' => $row['data'],
            'timestamp' => $row['timestamp']
        ],
        'debug' => 'Data retrieved successfully'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Tidak ada data'
    ]);
}

$conn->close();
?>
<?php
// Koneksi database
$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'moisture_data';

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Test query
$sql = "SELECT * FROM moisture_readings ORDER BY timestamp DESC LIMIT 1";
$result = $conn->query($sql);

if ($result) {
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo "Data terbaru:<br>";
        echo "ID: " . $row['id'] . "<br>";
        echo "Data: " . $row['data'] . "<br>";
        echo "Timestamp: " . $row['timestamp'] . "<br>";
    } else {
        echo "Tidak ada data dalam tabel";
    }
} else {
    echo "Error dalam query: " . $conn->error;
}

$conn->close();
?>

-- Creating the 'users' table
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15),
    role ENUM('admin', 'user') DEFAULT 'user'
);

-- Creating the 'routes' table
CREATE TABLE routes (
    route_id INT PRIMARY KEY AUTO_INCREMENT,
    start VARCHAR(100),
    end VARCHAR(100),
    stops VARCHAR(255)
);

-- Creating the 'buses' table
CREATE TABLE buses (
    bus_id INT PRIMARY KEY AUTO_INCREMENT,
    route_id INT,
    capacity INT,
    FOREIGN KEY (route_id) REFERENCES routes(route_id)
);

-- Creating the 'schedules' table
CREATE TABLE schedules (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    bus_id INT,
    route_id INT,
    departure_time TIME,
    arrival_time TIME,
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id),
    FOREIGN KEY (route_id) REFERENCES routes(route_id)
);

-- Creating the 'reservations' table
CREATE TABLE reservations (
    reservation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    schedule_id INT,
    pickup VARCHAR(100),
    dropoff VARCHAR(100),
    adults INT,
    children INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (schedule_id) REFERENCES schedules(schedule_id)
);

-- Creating the 'pricing' table
CREATE TABLE pricing (
    pricing_id INT PRIMARY KEY AUTO_INCREMENT,
    route_id INT,
    price_per_adult DECIMAL(10, 2),
    price_per_child DECIMAL(10, 2),
    FOREIGN KEY (route_id) REFERENCES routes(route_id)
);

-- Creating the 'payments' table
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    reservation_id INT,
    amount_paid DECIMAL(10, 2),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
);

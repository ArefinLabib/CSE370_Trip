CREATE TABLE accounts (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    userName VARCHAR(100),
    password VARCHAR(100),
    role VARCHAR(50),
    email VARCHAR(100)
);
CREATE TABLE TouristDetails (
    touristID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT UNIQUE NOT NULL,
    FOREIGN KEY (userID) REFERENCES Account(ID)
);

CREATE TABLE AdminDetails (
    adminID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT UNIQUE NOT NULL,
    FOREIGN KEY (userID) REFERENCES Account(ID)
);

CREATE TABLE ServiceDetails (
    providerID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT UNIQUE NOT NULL,
    FOREIGN KEY (userID) REFERENCES Account(ID)
);
CREATE TABLE Location (
    locationID INT PRIMARY KEY AUTO_INCREMENT,
    locationName VARCHAR(100),
    description TEXT(500)
    rating FLOAT;
);

CREATE TABLE Service (
    serviceID INT PRIMARY KEY AUTO_INCREMENT,
    description TEXT(500),
    rating DECIMAL(2, 1),
    serviceType VARCHAR(50),
    providerID INT NOT NULL,
    locationID INT NOT NULL,
    FOREIGN KEY (providerID) REFERENCES ServiceDetails(providerID),
    FOREIGN KEY (locationID) REFERENCES Location(locationID)
);

CREATE TABLE Hotels (
    hotelID INT PRIMARY KEY AUTO_INCREMENT,
    serviceID INT UNIQUE,
    averageCost DECIMAL(10, 2),
    FOREIGN KEY (serviceID) REFERENCES Service(serviceID)
);

CREATE TABLE Restaurants (
    restaurantID INT PRIMARY KEY AUTO_INCREMENT,
    serviceID INT UNIQUE NOT NULL,
    FOREIGN KEY (serviceID) REFERENCES Service(serviceID)
);

CREATE TABLE Wishlist (
    W_Id INT AUTO_INCREMENT PRIMARY KEY,
    touristID INT NOT NULL,
    locationID INT NOT NULL,
    serviceID INT NOT NULL,
    FOREIGN KEY (touristID) REFERENCES TouristDetails(touristID),
    FOREIGN KEY (locationID) REFERENCES Location(locationID),
    FOREIGN KEY (serviceID) REFERENCES Hotels(serviceID)
);

CREATE TABLE Reviews (
	reviewId INT AUTO_INCREMENT PRIMARY KEY,
	userID INT NOT NULL,
	serviceID INT,
    locationID INT NOT NULL,
	rating INT NOT NULL,
	description TEXT(500),
    FOREIGN KEY (locationID) REFERENCES Location(locationID),
	FOREIGN KEY (userID) REFERENCES TouristDetails(touristID),
	FOREIGN KEY (serviceID) REFERENCES Service(serviceID)
);

CREATE TABLE Requests (
    requestID INT AUTO_INCREMENT PRIMARY KEY,
    providerID INT NOT NULL,
    serviceID INT, -- Nullable for add requests
    actionType ENUM('add', 'update', 'delete') NOT NULL,
    requestData JSON NOT NULL, -- Contains the request details
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (providerID) REFERENCES ServiceDetails(providerID)
);

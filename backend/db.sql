CREATE DATABASE Crowdfunding;
USE Crowdfunding;

CREATE TABLE User(
	id INT UNIQUE,
    PRIMARY KEY(id),
    password VARCHAR(100),
    email VARCHAR(50),
    fullname JSON,
    created_at DATE
);

CREATE TABLE Admin(
	id INT UNIQUE,
    PRIMARY KEY(id),
    password VARCHAR(100),
    email VARCHAR(50),
    fullname JSON,
    created_at DATE,
    campaign JSON
);

ALTER TABLE Admin 
ADD COLUMN status ENUM('active', 'completed', 'expired') NOT NULL DEFAULT 'active';

CREATE TABLE Campaign(
	id INT UNIQUE,
    PRIMARY KEY(id),
    title VARCHAR(20),
    description VARCHAR(500),
    amount_target INT UNSIGNED,
    category VARCHAR(20),
    raised_amount INT UNSIGNED,
    creator_id INT,
    FOREIGN KEY(creator_id) REFERENCES Admin(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    status ENUM('active', 'completed', 'expired') NOT NULL DEFAULT 'active',
    created_at DATE
);

CREATE TABLE Donation(
	id INT UNIQUE,
    PRIMARY KEY(id),
    donor_id INT,
    FOREIGN KEY(donor_id) REFERENCES User(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    campaign_id INT,
    FOREIGN KEY(campaign_id) REFERENCES Campaign(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    donation_date DATE
);


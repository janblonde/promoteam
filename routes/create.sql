CREATE TABLE customer (
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    name VARCHAR(30) NOT NULL,
    vat_number VARCHAR(15),
    email VARCHAR(50)
) ENGINE=INNODB;

CREATE TABLE project (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    project_number VARCHAR(6) NOT NULL,
    customer_id INT,
    INDEX cust_ind (customer_id),
    FOREIGN KEY (customer_id) 
        REFERENCES customer(id)
        ON DELETE CASCADE
) ENGINE=INNODB;

CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    username VARCHAR(30) NOT NULL,
    password VARCHAR(100) NOT NULL
) ENGINE=INNODB;



-- SQL Migration Script for Bulk Marketplace Negotiation Chat System
-- Note: If using Spring Boot with spring.jpa.hibernate.ddl-auto=update, 
-- these tables will be created automatically. This script is provided for manual execution.

-- Table for Bulk Products
CREATE TABLE bulk_products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INT NOT NULL,
    minimum_price DECIMAL(10,2) NOT NULL,
    location VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bulk_product_farmer FOREIGN KEY (farmer_id) REFERENCES users(id)
);

-- Table for Conversations
CREATE TABLE conversations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    bulk_product_id BIGINT NOT NULL,
    farmer_id BIGINT NOT NULL,
    wholesaler_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_conv_bulk_product FOREIGN KEY (bulk_product_id) REFERENCES bulk_products(id),
    CONSTRAINT fk_conv_farmer FOREIGN KEY (farmer_id) REFERENCES users(id),
    CONSTRAINT fk_conv_wholesaler FOREIGN KEY (wholesaler_id) REFERENCES users(id),
    -- Prevent duplicate active conversations for the same product and wholesaler
    UNIQUE KEY uk_conv_product_wholesaler (bulk_product_id, wholesaler_id)
);

-- Table for Negotiation Messages
CREATE TABLE negotiation_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    message_type VARCHAR(50) NOT NULL DEFAULT 'TEXT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_msg_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- Table for Deal Offers
CREATE TABLE deal_offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT NOT NULL,
    price_per_unit DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_deal_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

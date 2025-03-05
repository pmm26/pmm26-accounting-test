-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL,
  client_id UUID REFERENCES clients(id),
  amount_cents INTEGER NOT NULL DEFAULT 0,
  tax_amount_cents INTEGER NOT NULL DEFAULT 0,
  discount_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  payment_terms TEXT,
  notes TEXT,
  additional_info TEXT,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create line_items table
CREATE TABLE IF NOT EXISTS line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit_price_cents INTEGER NOT NULL DEFAULT 0,
  tax_percent NUMERIC NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for all tables
alter publication supabase_realtime add table clients;
alter publication supabase_realtime add table invoices;
alter publication supabase_realtime add table line_items;

-- Create sample data
INSERT INTO clients (name, email, phone, address, type)
VALUES 
('Acme Corporation', 'contact@acmecorp.com', '+1 (555) 123-4567', '123 Business Ave, Suite 100, San Francisco, CA 94107', 'business'),
('TechStart Inc.', 'info@techstart.io', '+1 (555) 987-6543', '456 Innovation Blvd, Austin, TX 78701', 'business'),
('John Smith', 'john.smith@example.com', '+1 (555) 555-1234', '789 Residential St, Apt 42, New York, NY 10001', 'individual');

-- Insert sample invoices
INSERT INTO invoices (invoice_number, client_id, amount_cents, tax_amount_cents, discount_cents, total_cents, status, invoice_date, due_date, payment_terms)
VALUES 
('INV-2023-001', (SELECT id FROM clients WHERE name = 'Acme Corporation' LIMIT 1), 125000, 12500, 5000, 132500, 'paid', '2023-05-01', '2023-05-15', 'net15'),
('INV-2023-002', (SELECT id FROM clients WHERE name = 'TechStart Inc.' LIMIT 1), 250000, 25000, 0, 275000, 'pending', '2023-06-01', '2023-07-01', 'net30'),
('INV-2023-003', (SELECT id FROM clients WHERE name = 'John Smith' LIMIT 1), 75000, 7500, 0, 82500, 'overdue', '2023-04-15', '2023-04-30', 'net15');

-- Insert sample line items
INSERT INTO line_items (invoice_id, description, quantity, unit_price_cents, tax_percent, total_cents)
VALUES 
((SELECT id FROM invoices WHERE invoice_number = 'INV-2023-001' LIMIT 1), 'UX/UI Design', 10, 15000, 10, 165000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2023-001' LIMIT 1), 'Web Development', 5, 20000, 10, 110000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2023-002' LIMIT 1), 'Mobile App Development', 20, 10000, 10, 220000),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2023-002' LIMIT 1), 'QA Testing', 15, 5000, 10, 82500),
((SELECT id FROM invoices WHERE invoice_number = 'INV-2023-003' LIMIT 1), 'Consulting Services', 5, 15000, 10, 82500);
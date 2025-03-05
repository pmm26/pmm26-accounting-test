-- Enable Row Level Security on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_items ENABLE ROW LEVEL SECURITY;

-- Create a users table to store Clerk user IDs
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  clerk_id TEXT NOT NULL UNIQUE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Add user_id to clients table to associate clients with users
ALTER TABLE clients ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Create RLS policies for clients table
DROP POLICY IF EXISTS "Users can view their own clients" ON clients;
CREATE POLICY "Users can view their own clients"
  ON clients FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own clients" ON clients;
CREATE POLICY "Users can insert their own clients"
  ON clients FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own clients" ON clients;
CREATE POLICY "Users can update their own clients"
  ON clients FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own clients" ON clients;
CREATE POLICY "Users can delete their own clients"
  ON clients FOR DELETE
  USING (user_id = auth.uid());

-- Create RLS policies for invoices table
DROP POLICY IF EXISTS "Users can view their own invoices" ON invoices;
CREATE POLICY "Users can view their own invoices"
  ON invoices FOR SELECT
  USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own invoices" ON invoices;
CREATE POLICY "Users can insert their own invoices"
  ON invoices FOR INSERT
  WITH CHECK (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update their own invoices" ON invoices;
CREATE POLICY "Users can update their own invoices"
  ON invoices FOR UPDATE
  USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own invoices" ON invoices;
CREATE POLICY "Users can delete their own invoices"
  ON invoices FOR DELETE
  USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));

-- Create RLS policies for line_items table
DROP POLICY IF EXISTS "Users can view their own line items" ON line_items;
CREATE POLICY "Users can view their own line items"
  ON line_items FOR SELECT
  USING (invoice_id IN (SELECT id FROM invoices WHERE client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())));

DROP POLICY IF EXISTS "Users can insert their own line items" ON line_items;
CREATE POLICY "Users can insert their own line items"
  ON line_items FOR INSERT
  WITH CHECK (invoice_id IN (SELECT id FROM invoices WHERE client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())));

DROP POLICY IF EXISTS "Users can update their own line items" ON line_items;
CREATE POLICY "Users can update their own line items"
  ON line_items FOR UPDATE
  USING (invoice_id IN (SELECT id FROM invoices WHERE client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())));

DROP POLICY IF EXISTS "Users can delete their own line items" ON line_items;
CREATE POLICY "Users can delete their own line items"
  ON line_items FOR DELETE
  USING (invoice_id IN (SELECT id FROM invoices WHERE client_id IN (SELECT id FROM clients WHERE user_id = auth.uid())));

-- Create RLS policies for users table
DROP POLICY IF EXISTS "Users can view their own user data" ON users;
CREATE POLICY "Users can view their own user data"
  ON users FOR SELECT
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own user data" ON users;
CREATE POLICY "Users can update their own user data"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- Add realtime support
alter publication supabase_realtime add table clients;
alter publication supabase_realtime add table invoices;
alter publication supabase_realtime add table line_items;
alter publication supabase_realtime add table users;

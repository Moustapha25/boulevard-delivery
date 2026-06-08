
-- Dishes table
CREATE TABLE dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dishes_select" ON dishes FOR SELECT TO anon USING (true);
CREATE POLICY "dishes_insert" ON dishes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "dishes_update" ON dishes FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "dishes_delete" ON dishes FOR DELETE TO anon USING (true);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('amana', 'nita')),
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'preparing', 'ready', 'delivering', 'delivered', 'refused')),
  total INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_select" ON orders FOR SELECT TO anon USING (true);
CREATE POLICY "orders_insert" ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "orders_update" ON orders FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "orders_delete" ON orders FOR DELETE TO anon USING (true);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  dish_id UUID REFERENCES dishes(id) ON DELETE SET NULL,
  dish_name TEXT NOT NULL,
  dish_price INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_select" ON order_items FOR SELECT TO anon USING (true);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "order_items_update" ON order_items FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "order_items_delete" ON order_items FOR DELETE TO anon USING (true);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed 8 initial dishes
INSERT INTO dishes (name, description, price, category, image_url, sort_order) VALUES
('Riz au Poulet', 'Riz parfumé aux épices sahéliennes accompagné de poulet tendre mijoté dans une sauce tomate maison', 2500, 'Riz', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
('Thiéboudiène', 'Le roi des plats d''Afrique de l''Ouest : riz au poisson, légumes de saison et sauce tomate épicée', 3500, 'Riz', 'https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
('Poulet Braisé', 'Poulet entier braisé au charbon de bois, mariné aux épices locales, servi avec frites croustillantes', 4500, 'Grillades', 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
('Brochettes de Boeuf', 'Tendres morceaux de boeuf marinés et grillés au feu de bois, accompagnés d''une sauce piment maison', 3000, 'Grillades', 'https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg?auto=compress&cs=tinysrgb&w=800', 4),
('Sandwich Club Boulevard', 'Triple étage garni de poulet grillé, tomate fraîche, laitue et sauce maison signature', 2000, 'Sandwichs', 'https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg?auto=compress&cs=tinysrgb&w=800', 5),
('Burger Spécial', 'Steak haché 150g, fromage fondu, oignons caramélisés, cornichons, dans un pain brioché maison', 2500, 'Sandwichs', 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800', 6),
('Jus de Bissap', 'Infusion fraîche d''hibiscus, sucrée naturellement, la boisson traditionnelle de Niamey', 500, 'Boissons', 'https://images.pexels.com/photos/1536749/pexels-photo-1536749.jpeg?auto=compress&cs=tinysrgb&w=800', 7),
('Eau Minérale 1,5L', 'Bouteille d''eau minérale fraîche 1,5 litre', 300, 'Boissons', 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=800', 8);

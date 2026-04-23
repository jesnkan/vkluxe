-- VK Luxe Database Schema

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image TEXT NOT NULL,
  colors TEXT[] NOT NULL,
  rating NUMERIC DEFAULT 5.0,
  reviews INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  description TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON products FOR INSERT TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update products" ON products FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete products" ON products FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Promotions Table
CREATE TABLE IF NOT EXISTS promotions (
  id INTEGER PRIMARY KEY DEFAULT 1,
  hero_title TEXT NOT NULL,
  hero_gradient TEXT NOT NULL,
  hero_description TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS on Promotions
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view promotions" ON promotions FOR SELECT USING (true);
CREATE POLICY "Admins can modify promotions" ON promotions FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- User Roles Table
CREATE TABLE IF NOT EXISTS user_roles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policies for user_roles
CREATE POLICY "Users can view their own role" 
  ON user_roles FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
  ON user_roles FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- NEW: Function to handle new user role assignment (Runs as System)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'role', 'client'))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- NEW: Trigger to call the function on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, -- e.g., VK-1001
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view orders" ON orders FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  quantity INTEGER NOT NULL,
  selected_color TEXT NOT NULL,
  price NUMERIC NOT NULL
);

-- Enable RLS on Order Items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view order items" ON order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Function to decrement stock safely
CREATE OR REPLACE FUNCTION decrement_product_stock(product_id_param BIGINT, quantity_param INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET stock = GREATEST(0, stock - quantity_param)
  WHERE id = product_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Seed Initial Products
INSERT INTO products (id, name, price, original_price, image, colors, rating, reviews, category, description, stock)
VALUES 
(1, 'Women Purse Bag', 3450, 4200, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600', ARRAY['#f4f4f5', '#000000', '#d4af37', '#ffcf52'], 4.8, 450, 'Purse', 'A sleek, stylish purse designed for effortless elegance. Made from quality materials, it''s perfect for carrying your essentials. Features multiple compartments and a durable strap.', 15),
(2, 'Executive Satchel', 4120, NULL, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600', ARRAY['#d4af37', '#000000', '#78716c'], 4.9, 512, 'Satchel', 'Classic satchel design with premium materials. Spacious interior with secure closures, ideal for work or casual outings.', 8),
(3, 'Elite Crossbody', 2860, NULL, 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=600', ARRAY['#000000', '#78716c'], 4.5, 320, 'Purse', 'Perfect for everyday use with multiple compartments. Lightweight and comfortable to wear across the body.', 24),
(4, 'Gilded Makeup Bag', 1840, NULL, 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=600', ARRAY['#ffcf52', '#f4f4f5'], 4.6, 210, 'Purse', 'Keep your essentials organized in style. Compact yet roomy enough for all your daily makeup needs.', 45),
(5, 'Classic Briefcase', 5200, 6000, 'https://images.unsplash.com/photo-1544816153-12ad5d71431a?auto=format&fit=crop&q=80&w=600', ARRAY['#000000', '#422006'], 4.9, 128, 'Briefcase', 'The ultimate professional statement. Crafted from full-grain leather with dedicated laptop and document sections.', 5),
(6, 'Urban Explorer Backpack', 3800, NULL, 'https://images.unsplash.com/photo-1553062407-98eeb94c6a62?auto=format&fit=crop&q=80&w=600', ARRAY['#000000', '#d4af37'], 4.7, 89, 'Backpack', 'Adventure meets luxury. Ergonomic design with premium gold hardware and weather-resistant lining.', 12),
(7, 'Midnight Tote', 4500, NULL, 'https://images.unsplash.com/photo-1591348113529-6af1145ebbb4?auto=format&fit=crop&q=80&w=600', ARRAY['#000000', '#fb7185'], 4.8, 256, 'Tote', 'Versatile and chic. A spacious tote that transitions perfectly from brunch to the boardroom.', 18),
(8, 'Heritage Satchel', 4800, NULL, 'https://images.unsplash.com/photo-1591561954555-607968c989ab?auto=format&fit=crop&q=80&w=600', ARRAY['#422006', '#d4af37'], 4.9, 167, 'Satchel', 'A tribute to craftsmanship. Hand-stitched details and antique gold hardware for a timeless look.', 3)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Promotions
INSERT INTO promotions (id, hero_title, hero_gradient, hero_description, hero_image)
VALUES (1, 'Timeless', 'Artistry', 'Experience a symphony of pure gold accents and midnight aesthetics.', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800')
ON CONFLICT (id) DO NOTHING;

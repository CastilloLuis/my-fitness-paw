CREATE TABLE stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  text_en TEXT NOT NULL,
  text_es TEXT NOT NULL,
  link TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active stories"
  ON stories FOR SELECT USING (is_active = true);

-- Seed 2 example stories
INSERT INTO stories (title, image_url, text_en, text_es, link, sort_order) VALUES
  ('Play Keeps Cats Healthy',
   'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
   'Regular play reduces obesity risk by 40% and keeps indoor cats mentally stimulated.',
   'El juego regular reduce el riesgo de obesidad en un 40% y mantiene a los gatos de interior mentalmente estimulados.',
   'https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/how-often-should-you-feed-your-cat',
   1),
  ('The Power of Cat Naps',
   'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800',
   'Cats sleep 12-16 hours daily. Quality rest between play sessions is key to muscle recovery.',
   'Los gatos duermen de 12 a 16 horas diarias. El descanso de calidad entre sesiones de juego es clave para la recuperación muscular.',
   'https://www.purina.com/articles/cat/behavior/how-much-do-cats-sleep',
   2);

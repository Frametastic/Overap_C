-- Add image URL column to gerichte table
alter table gerichte add column if not exists bild_url text;

-- Assign Unsplash images to all 50 recipes

-- Frühstück
update gerichte set bild_url = 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop' where name = 'Rührei mit Tomaten';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=600&h=400&fit=crop' where name = 'Overnight Oats';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&h=400&fit=crop' where name = 'Avocado-Toast';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop' where name = 'Pfannkuchen';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&h=400&fit=crop' where name = 'Shakshuka';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1571748982800-fa51082c2224?w=600&h=400&fit=crop' where name = 'Bircher Müsli';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&h=400&fit=crop' where name = 'Bauernfrühstück';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=400&fit=crop' where name = 'Smoothie Bowl';

-- Mittagessen
update gerichte set bild_url = 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop' where name = 'Spaghetti Bolognese';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop' where name = 'Hähnchen-Curry';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&h=400&fit=crop' where name = 'Caesar Salad';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop' where name = 'Gemüse-Stir-Fry';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1543339308-d595c3a9b291?w=600&h=400&fit=crop' where name = 'Burrito Bowl';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=400&fit=crop' where name = 'Griechischer Salat';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop' where name = 'Tomatensuppe';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=400&fit=crop' where name = 'Pad Thai';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&h=400&fit=crop' where name = 'Kartoffelsuppe';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop' where name = 'Penne Arrabiata';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&h=400&fit=crop' where name = 'Couscous-Salat';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop&q=80' where name = 'Linsensuppe';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop' where name = 'Thunfisch-Wrap';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=400&fit=crop' where name = 'Risotto mit Pilzen';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=600&h=400&fit=crop' where name = 'Falafel-Teller';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&h=400&fit=crop' where name = 'Hähnchen-Wrap';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1603105037880-880cd4f6be00?w=600&h=400&fit=crop' where name = 'Minestrone';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop' where name = 'Gebratener Reis';

-- Abendessen
update gerichte set bild_url = 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop' where name = 'Lachs mit Brokkoli';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop' where name = 'Pizza Margherita';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=600&h=400&fit=crop' where name = 'Schnitzel mit Kartoffelsalat';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&h=400&fit=crop' where name = 'Thai-Curry mit Tofu';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&h=400&fit=crop' where name = 'Tacos';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=600&h=400&fit=crop' where name = 'Auberginen-Parmesan';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=600&h=400&fit=crop' where name = 'Lachs-Teriyaki';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1597712660928-536aab4661e7?w=600&h=400&fit=crop' where name = 'Bratwurst mit Sauerkraut';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop' where name = 'Spinat-Ricotta-Pasta';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&h=400&fit=crop&q=80' where name = 'Süßkartoffel-Curry';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop' where name = 'Hamburger';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&h=400&fit=crop&q=80' where name = 'Garnelen-Pasta';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=400&fit=crop' where name = 'Gefüllte Paprika';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop' where name = 'Zucchini-Frittata';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop' where name = 'Butter Chicken';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=600&h=400&fit=crop' where name = 'Kartoffel-Lauch-Auflauf';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop' where name = 'Tofu-Stir-Fry';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=600&h=400&fit=crop' where name = 'Caprese-Salat mit Bruschetta';

-- Snacks
update gerichte set bild_url = 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&h=400&fit=crop' where name = 'Hummus mit Gemüsesticks';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&h=400&fit=crop' where name = 'Bruschetta';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&h=400&fit=crop' where name = 'Energiebällchen';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=600&h=400&fit=crop' where name = 'Guacamole mit Tortilla-Chips';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1605090930601-522a50400e5c?w=600&h=400&fit=crop' where name = 'Banana Bread';
update gerichte set bild_url = 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=600&h=400&fit=crop' where name = 'Caprese-Spieße';

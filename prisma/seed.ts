import { PrismaClient, OrderStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // 1. Seed Admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@resincraft.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "Craft Studio Manager",
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Craft Studio Manager",
    },
  });
  console.log(`Admin seeded: ${admin.email}`);

  // 2. Seed Categories
  const categoriesData = [
    {
      name: "Resin Crafts",
      slug: "resin-crafts",
      description: "Hand-poured crystal clear resin art, preserved florals, and bespoke resin creations.",
    },
    {
      name: "Paper Crafts",
      slug: "paper-crafts",
      description: "Artisanal paper flowers, quilled keepsakes, and intricately folded paper treasures.",
    },
    {
      name: "Keychains",
      slug: "keychains",
      description: "Personalized letter keychains, botanical tags, and everyday pocket delights.",
    },
    {
      name: "Home Decor",
      slug: "home-decor",
      description: "Artistic frames, botanical coasters, and statement handcrafted tabletop pieces.",
    },
    {
      name: "Gifts",
      slug: "gifts",
      description: "Thoughtful handmade gift sets, curated boxes, and meaningful tokens of affection.",
    },
    {
      name: "Custom Crafts",
      slug: "custom-crafts",
      description: "Made-to-order crafts personalized with initials, birthstones, and custom colorways.",
    },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        isActive: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        isActive: true,
      },
    });
    categoriesMap[cat.slug] = createdCat.id;
  }
  console.log(`Seeded ${Object.keys(categoriesMap).length} categories.`);

  // 3. Seed Products
  const sampleProducts = [
    {
      name: "Resin Letter Keychain with Gold Foil",
      slug: "resin-letter-keychain-with-gold-foil",
      description: "Custom hand-poured crystal resin initial keychain embedded with real dried baby's breath and delicate 24k gold leaf flakes. Finished with high-grade anti-tarnish gold hardware.",
      price: 350.0,
      stock: 15,
      categorySlug: "keychains",
      mainImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      additionalImages: [
        "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80",
      ],
      isFeatured: true,
    },
    {
      name: "Pressed Flower Resin Bookmark",
      slug: "pressed-flower-resin-bookmark",
      description: "An ultra-thin, durable resin bookmark featuring real pressed wildflowers, purple hydrangeas, and finished with a soft champagne silk tassel. Perfect for book lovers.",
      price: 280.0,
      stock: 20,
      categorySlug: "resin-crafts",
      mainImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      additionalImages: [
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      ],
      isFeatured: true,
    },
    {
      name: "Handmade Paper Flower Bouquet",
      slug: "handmade-paper-flower-bouquet",
      description: "Everlasting bouquet of 7 hand-sculpted Italian crepe paper peonies and eucalyptus sprigs. Each petal is individually dyed, shaped, and arranged with care.",
      price: 1250.0,
      stock: 8,
      categorySlug: "paper-crafts",
      mainImage: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80",
      additionalImages: [
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80",
      ],
      isFeatured: true,
    },
    {
      name: "Botanical Resin Photo Frame",
      slug: "botanical-resin-photo-frame",
      description: "A 4x6 freestanding photo frame embedded with wild ferns, miniature daisies, and warm amber resin accents. Holds standard portrait photographs securely.",
      price: 850.0,
      stock: 6,
      categorySlug: "home-decor",
      mainImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
      additionalImages: [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      ],
      isFeatured: true,
    },
    {
      name: "Custom Name Keychain with Dried Botanicals",
      slug: "custom-name-keychain-dried-botanicals",
      description: "Rectangular resin keychain personalized with calligraphy name vinyl sealed under a second protective coat. Features soft pink rose petals and copper foil accents.",
      price: 390.0,
      stock: 12,
      categorySlug: "custom-crafts",
      mainImage: "https://images.unsplash.com/photo-1582142407894-ec85a1260a46?auto=format&fit=crop&w=800&q=80",
      additionalImages: [],
      isFeatured: false,
    },
    {
      name: "3D Origami Paper Butterfly Wall Art",
      slug: "3d-origami-paper-butterfly-wall-art",
      description: "Set of 9 iridescent gradient paper butterflies designed to bring whimsy to any gallery wall. Includes mounting adhesive that is safe for painted walls.",
      price: 550.0,
      stock: 10,
      categorySlug: "paper-crafts",
      mainImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
      additionalImages: [],
      isFeatured: false,
    },
    {
      name: "Botanical Resin Coaster Set of 4",
      slug: "botanical-resin-coaster-set-4",
      description: "Set of four hexagonal drink coasters featuring real pressed cosmos blossoms, gold leaf rims, and non-slip clear silicone feet on the bottom.",
      price: 980.0,
      stock: 7,
      categorySlug: "home-decor",
      mainImage: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
      additionalImages: [
        "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80",
      ],
      isFeatured: true,
    },
    {
      name: "Handmade Botanical Greeting Card",
      slug: "handmade-botanical-greeting-card",
      description: "Deckle-edged cotton rag paper card adorned with a real pressed forget-me-not flower and stamped with gold wax seal. Blank inside with matching parchment envelope.",
      price: 180.0,
      stock: 25,
      categorySlug: "gifts",
      mainImage: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80",
      additionalImages: [],
      isFeatured: false,
    },
    {
      name: "Ocean Wave Resin Pendant Necklace",
      slug: "ocean-wave-resin-pendant-necklace",
      description: "A wearable slice of the sea. Realistic white foam sea-spray effects over deep turquoise resin on an 18-inch 14k gold-filled chain.",
      price: 620.0,
      stock: 9,
      categorySlug: "resin-crafts",
      mainImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      additionalImages: [],
      isFeatured: true,
    },
    {
      name: "Mini Geometric Paper Keepsake Gift Box",
      slug: "mini-geometric-paper-keepsake-box",
      description: "Hand-folded origami multifaceted gift box crafted from heavyweight Japanese washi paper with copper foil geometric embossing. Perfect for rings and small treasures.",
      price: 220.0,
      stock: 18,
      categorySlug: "gifts",
      mainImage: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
      additionalImages: [],
      isFeatured: false,
    },
    {
      name: "Gold Leaf Fern Trinket Dish",
      slug: "gold-leaf-fern-trinket-dish",
      description: "Curved round trinket dish ideal for daily rings and jewelry. Features real miniature woodland fern fronds preserved forever in high-gloss UV-stable resin.",
      price: 480.0,
      stock: 11,
      categorySlug: "home-decor",
      mainImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      additionalImages: [],
      isFeatured: false,
    },
    {
      name: "Limited Edition Floral Resin Paperweight",
      slug: "limited-edition-floral-resin-paperweight",
      description: "Solid 3-inch resin sphere containing a perfectly preserved dandelion puffball suspended in mid-air. An exquisite conversation starter for desks and bookshelves.",
      price: 1100.0,
      stock: 4,
      categorySlug: "resin-crafts",
      mainImage: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
      additionalImages: [],
      isFeatured: true,
    },
  ];

  for (const item of sampleProducts) {
    const categoryId = categoriesMap[item.categorySlug];
    if (!categoryId) continue;

    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        stock: item.stock,
        categoryId: categoryId,
        mainImage: item.mainImage,
        isFeatured: item.isFeatured,
        isActive: true,
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        stock: item.stock,
        categoryId: categoryId,
        mainImage: item.mainImage,
        isFeatured: item.isFeatured,
        isActive: true,
      },
    });

    // Create additional images
    await prisma.productImage.deleteMany({
      where: { productId: product.id },
    });

    if (item.additionalImages && item.additionalImages.length > 0) {
      for (let i = 0; i < item.additionalImages.length; i++) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            imageUrl: item.additionalImages[i],
            sortOrder: i + 1,
          },
        });
      }
    }
  }
  console.log(`Seeded ${sampleProducts.length} products.`);

  // 4. Seed an initial sample order to showcase realistic dashboard statistics
  const existingOrder = await prisma.order.findUnique({
    where: { orderNumber: "RPC-10001" },
  });

  if (!existingOrder) {
    const bookmark = await prisma.product.findUnique({
      where: { slug: "pressed-flower-resin-bookmark" },
    });
    const keychain = await prisma.product.findUnique({
      where: { slug: "resin-letter-keychain-with-gold-foil" },
    });

    if (bookmark && keychain) {
      const order = await prisma.order.create({
        data: {
          orderNumber: "RPC-10001",
          customerName: "Sarah Rahman",
          phone: "01712345678",
          email: "sarah.rahman@example.com",
          address: "House 24, Road 7A",
          city: "Dhaka",
          area: "Dhanmondi",
          deliveryInstructions: "Please call before arriving.",
          subtotal: 630.0,
          deliveryFee: 80.0,
          total: 710.0,
          paymentMethod: "Cash on Delivery",
          status: OrderStatus.Processing,
          items: {
            create: [
              {
                productId: bookmark.id,
                productName: bookmark.name,
                quantity: 1,
                unitPrice: bookmark.price,
                subtotal: bookmark.price,
              },
              {
                productId: keychain.id,
                productName: keychain.name,
                quantity: 1,
                unitPrice: keychain.price,
                subtotal: keychain.price,
              },
            ],
          },
        },
      });
      console.log(`Sample order created: ${order.orderNumber}`);
    }
  }

  console.log("Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

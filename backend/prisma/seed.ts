import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Önce ürünleri temizle
  await prisma.product.deleteMany();
  // Sonra kategorileri temizle
  await prisma.category.deleteMany();

  // Kategorileri ekle
  const categories = [
    {
      name: 'Elektrik',
      description: 'Elektrik malzemeleri ve ekipmanları',
      image: '/images/categories/elektrik.jpg',
      icon: '⚡'
    },
    {
      name: 'Hırdavat',
      description: 'Hırdavat malzemeleri ve aletleri',
      image: '/images/categories/hirdavat.jpg',
      icon: '🔧'
    },
    {
      name: 'Isıtma',
      description: 'Isıtma sistemleri ve ekipmanları',
      image: '/images/categories/isitma.jpg',
      icon: '🔥'
    },
    {
      name: 'Su Tesisatı',
      description: 'Su tesisatı malzemeleri ve ekipmanları',
      image: '/images/categories/su-tesisati.jpg',
      icon: '💧'
    }
  ];

  // Kategorileri oluştur ve ID'lerini al
  const createdCategories = await Promise.all(
    categories.map(category => prisma.category.create({ data: category }))
  );

  // Kategori ID'lerini al
  const elektrikId = createdCategories.find(c => c.name === 'Elektrik')?.id;
  const hirdavatId = createdCategories.find(c => c.name === 'Hırdavat')?.id;
  const isitmaId = createdCategories.find(c => c.name === 'Isıtma')?.id;
  const suTesisatiId = createdCategories.find(c => c.name === 'Su Tesisatı')?.id;

  if (!elektrikId || !hirdavatId || !isitmaId || !suTesisatiId) {
    throw new Error('Kategori ID\'leri bulunamadı');
  }

  // Ürünleri ekle
  const products = [
    {
      name: 'Duş Bataryası',
      description: 'Modern tasarımlı duş bataryası',
      price: 1299.99,
      stock: 50,
      image: '/images/products/dus-bataryasi.jpg',
      categoryId: suTesisatiId
    },
    {
      name: 'El Aletleri Seti',
      description: 'Profesyonel el aletleri seti',
      price: 2499.99,
      stock: 30,
      image: '/images/products/el-aletleri-seti.jpg',
      categoryId: hirdavatId
    },
    {
      name: 'Klozet',
      description: 'Modern tasarımlı klozet',
      price: 3499.99,
      stock: 20,
      image: '/images/products/klozet.jpg',
      categoryId: suTesisatiId
    },
    {
      name: 'Kombi',
      description: 'Enerji tasarruflu kombi',
      price: 12999.99,
      stock: 15,
      image: '/images/products/kombi.jpg',
      categoryId: isitmaId
    },
    {
      name: 'Lavabo Bataryası',
      description: 'Şık tasarımlı lavabo bataryası',
      price: 899.99,
      stock: 40,
      image: '/images/products/lavabo-bataryasi.jpg',
      categoryId: suTesisatiId
    },
    {
      name: 'LED Panel',
      description: 'Enerji tasarruflu LED panel',
      price: 599.99,
      stock: 25,
      image: '/images/products/led-panel.jpg',
      categoryId: elektrikId
    },
    {
      name: 'Matkap Seti',
      description: 'Profesyonel matkap seti',
      price: 1999.99,
      stock: 35,
      image: '/images/products/matkap-seti.jpg',
      categoryId: hirdavatId
    },
    {
      name: 'Merdiven',
      description: 'Güvenli ve sağlam merdiven',
      price: 799.99,
      stock: 20,
      image: '/images/products/merdiven.jpg',
      categoryId: hirdavatId
    },
    {
      name: 'NYM Kablo',
      description: 'Kaliteli NYM kablo',
      price: 299.99,
      stock: 100,
      image: '/images/products/nym-kablo.jpg',
      categoryId: elektrikId
    },
    {
      name: 'Panel Radyatör',
      description: 'Modern panel radyatör',
      price: 2499.99,
      stock: 25,
      image: '/images/products/panel-radyator.jpg',
      categoryId: isitmaId
    },
    {
      name: 'PPR Boru',
      description: 'Kaliteli PPR boru',
      price: 199.99,
      stock: 200,
      image: '/images/products/ppr-boru.jpg',
      categoryId: suTesisatiId
    },
    {
      name: 'Priz Kasası',
      description: 'Güvenli priz kasası',
      price: 149.99,
      stock: 50,
      image: '/images/products/priz-kasasi.jpg',
      categoryId: elektrikId
    },
    {
      name: 'Termostat',
      description: 'Akıllı termostat',
      price: 899.99,
      stock: 30,
      image: '/images/products/termostat.jpg',
      categoryId: isitmaId
    }
  ];

  // Ürünleri oluştur
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log('Kategoriler ve ürünler başarıyla eklendi');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
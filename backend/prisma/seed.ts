import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Önce ilişkili alt tabloları sil
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Kategorileri ekle
  const elektrik = await prisma.category.create({
    data: {
      name: 'Elektrik',
      description: 'Elektrik malzemeleri ve ekipmanları',
      image: '/images/categories/elektrik.jpg',
      icon: '⚡'
    }
  });
  const hirdavat = await prisma.category.create({
    data: {
      name: 'Hırdavat',
      description: 'Hırdavat malzemeleri ve aletleri',
      image: '/images/categories/hirdavat.jpg',
      icon: '🔧'
    }
  });
  const isitma = await prisma.category.create({
    data: {
      name: 'Isıtma',
      description: 'Isıtma sistemleri ve ekipmanları',
      image: '/images/categories/isitma.jpg',
      icon: '🔥'
    }
  });
  const suTesisati = await prisma.category.create({
    data: {
      name: 'Su Tesisatı',
      description: 'Su tesisatı malzemeleri ve ekipmanları',
      image: '/images/categories/su-tesisati.jpg',
      icon: '💧'
    }
  });

  // Ürünleri ekle
  const products = [
    {
      name: 'Duş Bataryası',
      description: 'Modern tasarımlı duş bataryası',
      price: 1299.99,
      stock: 50,
      image: '/images/products/dus-bataryasi.jpg',
      categoryId: suTesisati.id
    },
    {
      name: 'El Aletleri Seti',
      description: 'Profesyonel el aletleri seti',
      price: 2499.99,
      stock: 30,
      image: '/images/products/el-aletleri-seti.jpg',
      categoryId: hirdavat.id
    },
    {
      name: 'Klozet',
      description: 'Modern tasarımlı klozet',
      price: 3499.99,
      stock: 20,
      image: '/images/products/klozet.jpg',
      categoryId: suTesisati.id
    },
    {
      name: 'Kombi',
      description: 'Enerji tasarruflu kombi',
      price: 12999.99,
      stock: 15,
      image: '/images/products/kombi.jpg',
      categoryId: isitma.id
    },
    {
      name: 'Lavabo Bataryası',
      description: 'Şık tasarımlı lavabo bataryası',
      price: 899.99,
      stock: 40,
      image: '/images/products/lavabo-bataryasi.jpg',
      categoryId: suTesisati.id
    },
    {
      name: 'LED Panel',
      description: 'Enerji tasarruflu LED panel',
      price: 599.99,
      stock: 25,
      image: '/images/products/led-panel.jpg',
      categoryId: elektrik.id
    },
    {
      name: 'Matkap Seti',
      description: 'Profesyonel matkap seti',
      price: 1999.99,
      stock: 35,
      image: '/images/products/matkap-seti.jpg',
      categoryId: hirdavat.id
    },
    {
      name: 'Merdiven',
      description: 'Güvenli ve sağlam merdiven',
      price: 799.99,
      stock: 20,
      image: '/images/products/merdiven.jpg',
      categoryId: hirdavat.id
    },
    {
      name: 'NYM Kablo',
      description: 'Kaliteli NYM kablo',
      price: 299.99,
      stock: 100,
      image: '/images/products/nym-kablo.jpg',
      categoryId: elektrik.id
    },
    {
      name: 'Panel Radyatör',
      description: 'Modern panel radyatör',
      price: 2499.99,
      stock: 25,
      image: '/images/products/panel-radyator.jpg',
      categoryId: isitma.id
    },
    {
      name: 'PPR Boru',
      description: 'Kaliteli PPR boru',
      price: 199.99,
      stock: 200,
      image: '/images/products/ppr-boru.jpg',
      categoryId: suTesisati.id
    },
    {
      name: 'Priz Kasası',
      description: 'Güvenli priz kasası',
      price: 149.99,
      stock: 50,
      image: '/images/products/priz-kasasi.jpg',
      categoryId: elektrik.id
    },
    {
      name: 'Termostat',
      description: 'Akıllı termostat',
      price: 899.99,
      stock: 30,
      image: '/images/products/termostat.jpg',
      categoryId: isitma.id
    }
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
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
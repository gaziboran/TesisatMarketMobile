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
      name: 'Su Tesisatı',
      description: 'Lavabo bataryası, duş bataryası, PPR boru seti ve klozet gibi su tesisatı ürünleri',
      image: '/images/categories/su-tesisati.jpg',
      icon: 'water-outline'
    },
    {
      name: 'Elektrik',
      description: 'LED panel, priz kasası, NYM kablo ve sigorta kutusu gibi elektrik ürünleri',
      image: '/images/categories/elektrik.jpg',
      icon: 'flash-outline'
    },
    {
      name: 'Isıtma',
      description: 'Kombi, panel radyatör, havlupan ve termostat gibi ısıtma ürünleri',
      image: '/images/categories/isitma.jpg',
      icon: 'flame-outline'
    },
    {
      name: 'Hırdavat',
      description: 'Matkap seti, el aletleri seti, merdiven ve kaynak makinesi gibi hırdavat ürünleri',
      image: '/images/categories/hirdavat.jpg',
      icon: 'hammer-outline'
    }
  ];

  // Kategorileri oluştur ve ID'lerini al
  const createdCategories = await Promise.all(
    categories.map(category => prisma.category.create({ data: category }))
  );

  // Ürünleri ekle
  const products = [
    // Su Tesisatı
    {
      name: 'Lavabo Bataryası',
      price: 449.99,
      image: '/images/products/lavabo-bataryasi.jpg',
      description: 'Modern tasarım, krom kaplama, seramik valf',
      categoryId: createdCategories[0].id,
      stock: 50
    },
    {
      name: 'Duş Bataryası',
      price: 599.99,
      image: '/images/products/dus-bataryasi.jpg',
      description: 'Termostatik, yağmur başlıklı, el duşu dahil',
      categoryId: createdCategories[0].id,
      stock: 30
    },
    {
      name: 'PPR Boru Seti',
      price: 159.99,
      image: '/images/products/ppr-boru.jpg',
      description: '20mm çap, 10 metre, sıcak su dayanımlı',
      categoryId: createdCategories[0].id,
      stock: 100
    },
    {
      name: 'Klozet',
      price: 1299.99,
      image: '/images/products/klozet.jpg',
      description: 'Gizli rezervuarlı, yavaş kapanan kapak',
      categoryId: createdCategories[0].id,
      stock: 20
    },
    // Elektrik
    {
      name: 'LED Panel',
      price: 259.99,
      image: '/images/products/led-panel.jpg',
      description: '24W, Beyaz ışık, ultra ince',
      categoryId: createdCategories[1].id,
      stock: 40
    },
    {
      name: 'Priz Kasası',
      price: 39.99,
      image: '/images/products/priz-kasasi.jpg',
      description: 'Standart tip, kolay montaj',
      categoryId: createdCategories[1].id,
      stock: 200
    },
    {
      name: 'NYM Kablo',
      price: 129.99,
      image: '/images/products/nym-kablo.jpg',
      description: '3x2.5 mm², 50 metre',
      categoryId: createdCategories[1].id,
      stock: 60
    },
    // Isıtma
    {
      name: 'Kombi',
      price: 8999.99,
      image: '/images/products/kombi.jpg',
      description: 'Yoğuşmalı, A enerji sınıfı',
      categoryId: createdCategories[2].id,
      stock: 10
    },
    {
      name: 'Panel Radyatör',
      price: 799.99,
      image: '/images/products/panel-radyator.jpg',
      description: '600x1200 mm, yüksek verim',
      categoryId: createdCategories[2].id,
      stock: 25
    },
    {
      name: 'Termostat',
      price: 349.99,
      image: '/images/products/termostat.jpg',
      description: 'Dijital ekran, programlanabilir',
      categoryId: createdCategories[2].id,
      stock: 35
    },
    // Hırdavat
    {
      name: 'Matkap Seti',
      price: 1199.99,
      image: '/images/products/matkap-seti.jpg',
      description: '12V, 2 akülü, 50 parça uç seti',
      categoryId: createdCategories[3].id,
      stock: 15
    },
    {
      name: 'El Aletleri Seti',
      price: 499.99,
      image: '/images/products/el-aletleri-seti.jpg',
      description: 'Çantalı, 40 parça',
      categoryId: createdCategories[3].id,
      stock: 30
    },
    {
      name: 'Merdiven',
      price: 699.99,
      image: '/images/products/merdiven.jpg',
      description: '6 basamaklı, alüminyum',
      categoryId: createdCategories[3].id,
      stock: 12
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
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: 'Su Tesisatı',
      description: 'Su tesisatı ürünleri',
      image: 'https://www.sutesisatfirmasi.com/wp-content/uploads/2023/05/Ucuz-Tesisatci.png',
      slug: 'su-tesisati',
    },
    {
      name: 'Elektrik',
      description: 'Elektrik malzemeleri',
      image: 'https://5.imimg.com/data5/SELLER/Default/2023/6/320571543/VB/DG/PK/21448494/residential-electrical-work-services.jpg',
      slug: 'elektrik',
    },
    {
      name: 'Isıtma',
      description: 'Isıtma sistemleri',
      image: 'https://www.deltamekanik.com.tr/images/isitma-sistemleri.jpg',
      slug: 'isitma',
    },
    {
      name: 'Hırdavat',
      description: 'Hırdavat ürünleri',
      image: 'https://ideacdn.net/idea/hi/39/myassets/blogs/hirdavat.jpeg?revision=1677512276',
      slug: 'hirdavat',
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log('Kategoriler başarıyla eklendi!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
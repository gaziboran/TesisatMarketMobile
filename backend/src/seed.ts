import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Kategorileri oluştur
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

    for (const category of categories) {
        const existing = await prisma.category.findFirst({ where: { name: category.name } });
        if (!existing) {
            await prisma.category.create({ data: category });
        }
    }

    console.log('Kategoriler başarıyla eklendi');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 
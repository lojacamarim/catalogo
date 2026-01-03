// ============================================
// PRODUTOS DO CATÁLOGO
// ============================================
const productsData = {
    "products": [
        {
            "id": "CAM-00002",
            "name": "Sandália Moleca - Marrom",
            "category": "Shoes",
            "sellingPrice": 100,
            "stock": 3,
            "discount": 30,
            "images": ["2.webp"]
        },
        {
            "id": "CAM-00003",
            "name": "Sandália Moleca - Preto",
            "category": "Shoes",
            "sellingPrice": 100,
            "stock": 3,
            "discount": 30,
            "images": ["3.webp"]
        },
        {
            "id": "CAM-00004",
            "name": "Sandália Viamarte - Branco",
            "category": "Shoes",
            "sellingPrice": 105,
            "stock": 6,
            "discount": 30,
            "images": ["4.webp"]
        },
        {
            "id": "CAM-00005",
            "name": "Sandália Grendha - Preto",
            "category": "Shoes",
            "sellingPrice": 60,
            "stock": 4,
            "discount": 15,
            "images": ["5.webp"]
        },
        {
            "id": "CAM-00006",
            "name": "Sandália Viamarte Napa Casual - Preto",
            "category": "Shoes",
            "sellingPrice": 139.90,
            "stock": 2,
            "discount": 0,
            "images": ["6.webp"]
        },
        {
            "id": "CAM-00007",
            "name": "Sandália Beira Rio - Nude",
            "category": "Shoes",
            "sellingPrice": 100,
            "stock": 9,
            "discount": 30,
            "images": ["7.webp"]
        },
        {
            "id": "CAM-00008",
            "name": "Sandália Beira Rio - Preto",
            "category": "Shoes",
            "sellingPrice": 60,
            "stock": 1,
            "discount": 15,
            "images": ["8.webp"]
        },
        {
            "id": "CAM-00010",
            "name": "Vizzano Papete - Marrom",
            "category": "Shoes",
            "sellingPrice": 139.90,
            "stock": 0,
            "discount": 14,
            "images": ["10.webp"]
        },
        {
            "id": "CAM-00011",
            "name": "Papete Tira - Marrom",
            "category": "Shoes",
            "sellingPrice": 160,
            "stock": 1,
            "discount": 30,
            "images": ["11.webp"]
        },
        {
            "id": "CAM-00012",
            "name": "Rasteirinha",
            "category": "Shoes",
            "sellingPrice": 40,
            "stock": 6,
            "discount": 0,
            "images": ["12.webp", "12-1.webp", "12-2.webp", "12-3.webp", "12-4.webp", "12-5.webp"]
        },
        {
            "id": "CAM-00013",
            "name": "Vizzano Tira Pronta - Preto",
            "category": "Shoes",
            "sellingPrice": 150,
            "stock": 1,
            "discount": 15,
            "images": ["13.webp"]
        },
        {
            "id": "CAM-00014",
            "name": "Bolsa com Carteira",
            "category": "Bags",
            "sellingPrice": 140,
            "stock": 7,
            "discount": 25,
            "images": ["14.webp"]
        },
        {
            "id": "CAM-00015",
            "name": "Bolsa Coração",
            "category": "Bags",
            "sellingPrice": 120,
            "stock": 6,
            "discount": 25,
            "images": ["15.webp"]
        },
        {
            "id": "CAM-00016",
            "name": "Bolsa Bella Paula",
            "category": "Bags",
            "sellingPrice": 80,
            "stock": 2,
            "discount": 20,
            "images": ["16.webp"]
        },
        {
            "id": "CAM-00017",
            "name": "Bolsa Beaclea Grande",
            "category": "Bags",
            "sellingPrice": 150,
            "stock": 2,
            "discount": 15,
            "images": ["17.webp"]
        },
        {
            "id": "CAM-00018",
            "name": "Bolsa Beaclea Pequena",
            "category": "Bags",
            "sellingPrice": 100,
            "stock": 1,
            "discount": 10,
            "images": ["18.webp"]
        },
        {
            "id": "CAM-00020",
            "name": "Carteira Classic & Modern Fashion",
            "category": "Bags",
            "sellingPrice": 50,
            "stock": 1,
            "discount": 15,
            "images": ["20.webp", "20-1.webp"]
        },
        {
            "id": "CAM-00021",
            "name": "Bolsa Bella Paula Bag",
            "category": "Bags",
            "sellingPrice": 120,
            "stock": 2,
            "discount": 25,
            "images": ["21.webp"]
        },
        {
            "id": "CAM-00022",
            "name": "Carteira Bella Paula",
            "category": "Bags",
            "sellingPrice": 80,
            "stock": 1,
            "discount": 30,
            "images": ["22.webp"]
        },
        {
            "id": "CAM-00023",
            "name": "Bolsa Kuihou",
            "category": "Bags",
            "sellingPrice": 170,
            "stock": 1,
            "discount": 20,
            "images": ["23.webp"]
        },
        {
            "id": "CAM-00024",
            "name": "Cinto Elástico",
            "category": "Belts",
            "sellingPrice": 19.90,
            "stock": 4,
            "discount": 0,
            "images": ["24.webp"]
        },
        {
            "id": "CAM-00025",
            "name": "Cinto Básico",
            "category": "Belts",
            "sellingPrice": 24.90,
            "stock": 2,
            "discount": 0,
            "images": ["25.webp"]
        },
        {
            "id": "CAM-00026",
            "name": "Cinto com Detalhes",
            "category": "Belts",
            "sellingPrice": 59.90,
            "stock": 3,
            "discount": 0,
            "images": ["26.webp"]
        },
        {
            "id": "CAM-00027",
            "name": "Cinto Mola",
            "category": "Belts",
            "sellingPrice": 15,
            "stock": 2,
            "discount": 0,
            "images": ["27.webp"]
        },
        {
            "id": "CAM-00028",
            "name": "Conjunto Legging + Top G",
            "category": "Activewear",
            "sellingPrice": 160,
            "stock": 5,
            "discount": 20,
            "images": ["28.webp", "28-1.webp", "28-2.webp", "28-3.webp", "28-4.webp", "28-5.webp", "28-6.webp", "28-7.webp", "28-8.webp", "28-9.webp", "28-10.webp", "28-11.webp"]
        },
        {
            "id": "CAM-00029",
            "name": "Conjunto Legging + Top M",
            "category": "Activewear",
            "sellingPrice": 160,
            "stock": 5,
            "discount": 20,
            "images": ["29.webp", "29-1.webp", "29-2.webp", "29-3.webp", "29-4.webp", "29-5.webp", "29-6.webp", "29-7.webp", "29-8.webp", "29-9.webp", "29-10.webp", "29-11.webp", "29-12.webp"]
        },
        {
            "id": "CAM-00030",
            "name": "Conjunto Legging + Top P",
            "category": "Activewear",
            "sellingPrice": 140,
            "stock": 1,
            "discount": 15,
            "images": ["30.webp", "30-1.webp"]
        },
        {
            "id": "CAM-00031",
            "name": "Conjunto Short + Top M",
            "category": "Activewear",
            "sellingPrice": 140,
            "stock": 2,
            "discount": 15,
            "images": ["31.webp", "31-1.webp", "31-2.webp", "31-3.webp", "31-4.webp", "31-5.webp"]
        },
        {
            "id": "CAM-00032",
            "name": "Macaquinho M",
            "category": "Activewear",
            "sellingPrice": 120,
            "stock": 4,
            "discount": 15,
            "images": ["32.webp", "32-1.webp", "32-2.webp", "32-3.webp", "32-4.webp", "32-5.webp", "32-6.webp"]
        },
        {
            "id": "CAM-00033",
            "name": "Short Alfaiataria - Tam. M",
            "category": "Clothing",
            "sellingPrice": 70,
            "stock": 3,
            "discount": 15,
            "images": ["33.webp", "33-1.webp", "33-2.webp"]
        },
        {
            "id": "CAM-00034",
            "name": "Short Algodão Cru - Tam. 36",
            "category": "Clothing",
            "sellingPrice": 100,
            "stock": 1,
            "discount": 10,
            "images": ["34.webp"]
        },
        {
            "id": "CAM-00035",
            "name": "Conjunto Verde Claro - Tam. G",
            "category": "Clothing",
            "sellingPrice": 140,
            "stock": 1,
            "discount": 10,
            "images": ["35.webp", "35-1.webp", "35-2.webp"]
        },
        {
            "id": "CAM-00036",
            "name": "Short 100% Algodão - Tam. 36",
            "category": "Clothing",
            "sellingPrice": 120,
            "stock": 1,
            "discount": 20,
            "images": ["36.webp", "36-1.webp"]
        },
        {
            "id": "CAM-00037",
            "name": "Short Alfaiataria - Tam. P",
            "category": "Clothing",
            "sellingPrice": 70,
            "stock": 2,
            "discount": 15,
            "images": ["37.webp", "37-1.webp"]
        },
        {
            "id": "CAM-00038",
            "name": "Conjunto Marrom - Tam. M",
            "category": "Clothing",
            "sellingPrice": 140,
            "stock": 1,
            "discount": 10,
            "images": ["38.webp"]
        },
        {
            "id": "CAM-00039",
            "name": "Short Alfaiataria - Tam. G",
            "category": "Clothing",
            "sellingPrice": 70,
            "stock": 3,
            "discount": 15,
            "images": ["39.webp", "39-1.webp"]
        },
    ]
};
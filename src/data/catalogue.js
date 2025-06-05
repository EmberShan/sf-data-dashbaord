const catalogueData = {"clothing_inventory": [
    {
      "season": "Spring 2025",
      "product_lines": [
        {
          "name": "Everyday Essentials",
          "id": "EE-SPR25",
          "products": [
            {"product_id": "TS001-SPR25", "name": "Classic Crew Neck Tee", "type": "shirt", "color": ["Blue"], "fabric": "Organic Cotton", "price": 35.00, "cost": 8.75, "quantity_sold": 120, "date_added": "2025-01-15", "available_sizes": ["XS", "S", "M", "L", "XL"], "image_url": "/cloth/shirt/blue.png", "buyer": "Nordstrom"},
            {"product_id": "TS002-SPR25", "name": "Essential V-Neck", "type": "shirt", "color": ["White"], "fabric": "Premium Cotton", "price": 38.00, "cost": 7.98, "quantity_sold": 210, "date_added": "2025-01-15", "available_sizes": ["XS", "S", "M", "L", "XL"], "image_url": "/cloth/shirt/white.png", "buyer": "Amazon"},
            {"product_id": "TS012-SPR25", "name": "Modern Blue Tee", "type": "shirt", "color": ["Blue"], "fabric": "Cotton", "price": 36.00, "cost": 8.28, "quantity_sold": 130, "date_added": "2025-01-20", "available_sizes": ["S", "M", "L", "XL"], "image_url": "/cloth/shirt/blue-1.png", "buyer": "Walmart"},
            {"product_id": "TS013-SPR25", "name": "Blue Style Tee", "type": "shirt", "color": ["Blue"], "fabric": "Cotton", "price": 37.00, "cost": 7.77, "quantity_sold": 110, "date_added": "2025-01-22", "available_sizes": ["S", "M", "L", "XL"], "image_url": "/cloth/shirt/blue-2.png", "buyer": "Macy's"},
            {"product_id": "TS014-SPR25", "name": "Blue Urban Tee", "type": "shirt", "color": ["Blue"], "fabric": "Cotton", "price": 39.00, "cost": 8.19, "quantity_sold": 100, "date_added": "2025-01-25", "available_sizes": ["S", "M", "L", "XL"], "image_url": "/cloth/shirt/blue-3.png", "buyer": "Dick's"},
            {"product_id": "TS015-SPR25", "name": "Blue Classic Tee", "type": "shirt", "color": ["Blue"], "fabric": "Cotton", "price": 40.00, "cost": 8.00, "quantity_sold": 90, "date_added": "2025-01-28", "available_sizes": ["S", "M", "L", "XL"], "image_url": "/cloth/shirt/blue-4.png", "buyer": "Saks"},
            {"product_id": "TS016-SPR25", "name": "Blue Fresh Tee", "type": "shirt", "color": ["Blue"], "fabric": "Cotton", "price": 42.00, "cost": 8.40, "quantity_sold": 80, "date_added": "2025-01-30", "available_sizes": ["S", "M", "L", "XL"], "image_url": "/cloth/shirt/blue-5.png", "buyer": "Nordstrom"},
            {"product_id": "BT001-SPR25", "name": "Classic Blue Jeans", "type": "bottoms", "color": ["Blue"], "fabric": "Denim", "price": 45.00, "cost": 15.00, "quantity_sold": 150, "date_added": "2025-01-15", "available_sizes": ["XS", "S", "M", "L", "XL"], "image_url": "/bottoms/blue.png", "buyer": "Nordstrom"},
            {"product_id": "BT002-SPR25", "name": "Essential Black Pants", "type": "bottoms", "color": ["Dark Gray"], "fabric": "Cotton Blend", "price": 48.00, "cost": 16.00, "quantity_sold": 180, "date_added": "2025-01-15", "image_url": "/bottoms/dark gray.png", "buyer": "Amazon"},
            {"product_id": "BT003-SPR25", "name": "Urban Gray Pants", "type": "bottoms", "color": ["Gray"], "fabric": "Cotton Blend", "price": 50.00, "cost": 17.00, "quantity_sold": 160, "date_added": "2025-01-20", "available_sizes": ["S", "M", "L", "XL"], "image_url": "/bottoms/gray.png", "buyer": "Walmart"},
            {"product_id": "BT004-SPR25", "name": "Green Casual Pants", "type": "bottoms", "color": ["Green"], "fabric": "Cotton", "price": 52.00, "cost": 18.00, "quantity_sold": 140, "date_added": "2025-01-22", "available_sizes": ["S", "M", "L", "XL"], "image_url": "/bottoms/green.png", "buyer": "Macy's"}
          ]
        },
        {
          "name": "Urban Collection",
          "id": "UC-SPR25",
          "products": [
            {"product_id": "TS003-SPR25", "name": "Street Style Tee", "type": "shirt", "color": ["Dark Gray"], "fabric": "Cotton Blend", "price": 45.00, "cost": 9.00, "quantity_sold": 175, "date_added": "2025-01-20", "available_sizes": ["S", "M", "L", "XL"], "image_url": "/cloth/shirt/dark gray.png", "buyer": "Amazon"},
            {"product_id": "TS017-SPR25", "name": "Dark Gray Urban Tee", "type": "shirt", "color": ["Dark Gray"], "fabric": "Cotton Blend", "price": 46.00, "cost": 9.20, "quantity_sold": 160, "date_added": "2025-01-22", "available_sizes": ["S", "M", "L", "XL"], "image_url": "/cloth/shirt/dark gray-1.png", "buyer": "Walmart"},
            {"product_id": "TS018-SPR25", "name": "Dark Gray Classic Tee", "type": "shirt", "color": ["Dark Gray"], "fabric": "Cotton Blend", "price": 47.00, "cost": 9.40, "quantity_sold": 150, "date_added": "2025-01-24", "available_sizes": ["S", "M", "L", "XL"], "image_url": "/cloth/shirt/dark gray-2.png", "buyer": "Macy's"},
            {"product_id": "TS019-SPR25", "name": "Dark Gray Fresh Tee", "type": "shirt", "color": ["Dark Gray"], "fabric": "Cotton Blend", "price": 48.00, "cost": 9.60, "quantity_sold": 140, "date_added": "2025-01-26", "available_sizes": ["S", "M", "L", "XL"], "image_url": "/cloth/shirt/dark gray-3.png", "buyer": "Dick's"},
            {"product_id": "TS020-SPR25", "name": "Dark Gray Style Tee", "type": "shirt", "color": ["Dark Gray"], "fabric": "Cotton Blend", "price": 49.00, "cost": 9.80, "quantity_sold": 130, "date_added": "2025-01-28", "available_sizes": ["S", "M", "L", "XL"], "image_url": "/cloth/shirt/dark gray-4.png", "buyer": "Saks"},
            {"product_id": "TS021-SPR25", "name": "Dark Gray Modern Tee", "type": "shirt", "color": ["Dark Gray"], "fabric": "Cotton Blend", "price": 50.00, "cost": 10.00, "quantity_sold": 120, "date_added": "2025-01-30", "available_sizes": ["S", "M", "L", "XL"], "image_url": "/cloth/shirt/dark gray-5.png", "buyer": "Nordstrom"},
            {"product_id": "TS022-SPR25", "name": "Dark Gray Limited Tee", "type": "shirt", "color": ["Dark Gray"], "fabric": "Cotton Blend", "price": 52.00, "cost": 10.40, "quantity_sold": 110, "date_added": "2025-02-01", "available_sizes": ["S", "M", "L", "XL"], "image_url": "/cloth/shirt/dark gray-6.png", "buyer": "Amazon"}
          ]
        }
      ]
    },
    {
      "season": "Summer 2025",
      "product_lines": [
        {
          "name": "Beach Collection",
          "id": "BC-SUM25",
          "products": [
            {"product_id": "TS004-SUM25", "name": "Ocean Breeze Tee", "type": "shirt", "color": ["Blue", "White"], "fabric": "light Cotton", "price": 43.00, "cost": 8.60, "quantity_sold": 98, "date_added": "2025-03-01", "available_sizes": ["XS", "S", "M", "L", "XL"], "image_url": "/cloth/shirt/blue+white.png", "buyer": "Walmart"},
            {"product_id": "TS023-SUM25", "name": "Blue+White Modern Tee", "type": "shirt", "color": ["Blue", "White"], "fabric": "light Cotton", "price": 44.00, "cost": 9.80, "quantity_sold": 90, "date_added": "2025-03-05", "available_sizes": ["XS", "S", "M", "L", "XL"], "image_url": "/cloth/shirt/blue+white-1.png", "buyer": "Macy's"},
            {"product_id": "BT005-SUM25", "name": "Beach Blue Shorts", "type": "bottoms", "color": ["Blue"], "fabric": "Cotton", "price": 40.00, "cost": 14.00, "quantity_sold": 120, "date_added": "2025-03-01", "available_sizes": ["XS", "S", "M", "L", "XL"], "image_url": "/bottoms/blue-1.png", "buyer": "Walmart"},
            {"product_id": "BT006-SUM25", "name": "Summer Gray Shorts", "type": "bottoms", "color": ["Gray"], "fabric": "Cotton Blend", "price": 42.00, "cost": 15.00, "quantity_sold": 110, "date_added": "2025-03-05", "available_sizes": ["XS", "S", "M", "L", "XL"], "image_url": "/bottoms/gray-1.png", "buyer": "Macy's"},
            {"product_id": "BT007-SUM25", "name": "Summer Green Shorts", "type": "bottoms", "color": ["Green"], "fabric": "Cotton", "price": 44.00, "cost": 16.00, "quantity_sold": 100, "date_added": "2025-03-15", "available_sizes": ["XS", "S", "M", "L"], "image_url": "/bottoms/green-1.png", "buyer": "Dick's"},
            {"product_id": "BT008-SUM25", "name": "Beige Casual Shorts", "type": "bottoms", "color": ["Beige"], "fabric": "Cotton Blend", "price": 46.00, "cost": 17.00, "quantity_sold": 90, "date_added": "2025-03-18", "available_sizes": ["XS", "S", "M", "L"], "image_url": "/bottoms/beige.png", "buyer": "Saks"}
          ]
        },
        {
          "name": "Summer Essentials",
          "id": "SE-SUM25",
          "products": [
            {"product_id": "TS005-SUM25", "name": "Summer Breeze V-Neck", "type": "shirt", "color": ["Pink"], "fabric": "Breathable Cotton", "price": 41.00, "cost": 8.20, "quantity_sold": 260, "date_added": "2025-03-15", "available_sizes": ["XS", "S", "M", "L"], "image_url": "/cloth/shirt/pink.png", "buyer": "Dick's"},
            {"product_id": "TS024-SUM25", "name": "Pink Modern Tee", "type": "shirt", "color": ["Pink"], "fabric": "Breathable Cotton", "price": 42.00, "cost": 8.40, "quantity_sold": 100, "date_added": "2025-03-18", "available_sizes": ["XS", "S", "M", "L"], "image_url": "/cloth/shirt/pink-1.png", "buyer": "Saks"},
            {"product_id": "TS025-SUM25", "name": "Pink Classic Tee", "type": "shirt", "color": ["Pink"], "fabric": "Breathable Cotton", "price": 43.00, "cost": 9.60, "quantity_sold": 90, "date_added": "2025-03-20", "available_sizes": ["XS", "S", "M", "L"], "image_url": "/cloth/shirt/pink-2.png", "buyer": "Nordstrom"},
            {"product_id": "TS026-SUM25", "name": "Pink Urban Tee", "type": "shirt", "color": ["Pink"], "fabric": "Breathable Cotton", "price": 44.00, "cost": 8.80, "quantity_sold": 80, "date_added": "2025-03-22", "available_sizes": ["XS", "S", "M", "L"], "image_url": "/cloth/shirt/pink-3.png", "buyer": "Amazon"},
            {"product_id": "TS027-SUM25", "name": "Pink Style Tee", "type": "shirt", "color": ["Pink"], "fabric": "Breathable Cotton", "price": 45.00, "cost": 9.00, "quantity_sold": 70, "date_added": "2025-03-24", "available_sizes": ["XS", "S", "M", "L"], "image_url": "/cloth/shirt/pink-4.png", "buyer": "Walmart"}
          ]
        }
      ]
    },
    {
      "season": "Fall 2025",
      "product_lines": [
        {
          "name": "Autumn Collection",
          "id": "AC-FAL25",
          "products": [
            {"product_id": "TS006-FAL25", "name": "Fall Classic Tee", "type": "shirt", "color": ["Dark Gray"], "fabric": "Heavyweight Cotton", "price": 46.00, "cost": 12.20, "quantity_sold": 300, "date_added": "2025-06-01", "available_sizes": ["S", "M", "L", "XL"], "image_url": "/cloth/shirt/dark gray-1.png", "buyer": "Macy's"},
            {"product_id": "TS028-FAL25", "name": "White+Gray Tee", "type": "shirt", "color": ["White", "Gray"], "fabric": "Cotton Blend", "price": 44.00, "cost": 8.80, "quantity_sold": 60, "date_added": "2025-06-05", "available_sizes": ["XS", "S", "M", "L", "XL"], "image_url": "/cloth/shirt/white+gray.png", "buyer": "Dick's"},
            {"product_id": "TS029-FAL25", "name": "White Classic Tee", "type": "shirt", "color": ["White"], "fabric": "Cotton", "price": 45.00, "cost": 9.00, "quantity_sold": 55, "date_added": "2025-06-07", "available_sizes": ["XS", "S", "M", "L", "XL"], "image_url": "/cloth/shirt/white-1.png", "buyer": "Saks"},
            {"product_id": "TS030-FAL25", "name": "White Modern Tee", "type": "shirt", "color": ["White"], "fabric": "Cotton", "price": 46.00, "cost": 10.20, "quantity_sold": 50, "date_added": "2025-06-09", "available_sizes": ["XS", "S", "M", "L", "XL"], "image_url": "/cloth/shirt/white-2.png", "buyer": "Nordstrom"},
            {"product_id": "TS031-FAL25", "name": "White Urban Tee", "type": "shirt", "color": ["White"], "fabric": "Cotton", "price": 47.00, "cost": 9.40, "quantity_sold": 45, "date_added": "2025-06-11", "available_sizes": ["XS", "S", "M", "L", "XL"], "image_url": "/cloth/shirt/white-3.png", "buyer": "Amazon"},
            {"product_id": "TS032-FAL25", "name": "White Style Tee", "type": "shirt", "color": ["White"], "fabric": "Cotton", "price": 48.00, "cost": 9.60, "quantity_sold": 40, "date_added": "2025-06-13", "available_sizes": ["XS", "S", "M", "L", "XL"], "image_url": "/cloth/shirt/white-4.png", "buyer": "Walmart"},
            {"product_id": "BT009-FAL25", "name": "Fall Dark Gray Pants", "type": "bottoms", "color": ["Dark Gray"], "fabric": "Heavyweight Cotton", "price": 55.00, "cost": 20.00, "quantity_sold": 130, "date_added": "2025-06-01", "available_sizes": ["S", "M", "L", "XL"], "image_url": "/bottoms/dark gray-1.png", "buyer": "Macy's"},
            {"product_id": "BT010-FAL25", "name": "Autumn Beige Pants", "type": "bottoms", "color": ["Beige"], "fabric": "Cotton Blend", "price": 58.00, "cost": 22.00, "quantity_sold": 120, "date_added": "2025-06-05", "available_sizes": ["XS", "S", "M", "L", "XL"], "image_url": "/bottoms/beige-1.png", "buyer": "Dick's"}
          ]
        }
      ]
    },
    {
      "season": "Winter 2025",
      "product_lines": [
        {
          "name": "Winter Essentials",
          "id": "WE-WIN25",
          "products": [
            {
              "product_id": "TS008-WIN25",
              "name": "Winter Comfort Tee",
              "type": "shirt",
              "color": ["Blue"],
              "fabric": "Thermal Cotton",
              "price": 49.00,
              "cost": 12.80,
              "quantity_sold": 220,
              "date_added": "2025-09-01",
              "available_sizes": ["S", "M", "L", "XL"],
              "image_url": "/cloth/shirt/blue-1.png",
              "buyer": "Macy's"
            },
            {
              "product_id": "BT011-WIN25",
              "name": "Winter Blue Pants",
              "type": "bottoms",
              "color": ["Blue"],
              "fabric": "Thermal Cotton",
              "price": 60.00,
              "cost": 25.00,
              "quantity_sold": 140,
              "date_added": "2025-09-01",
              "available_sizes": ["S", "M", "L", "XL"],
              "image_url": "/bottoms/blue.png",
              "buyer": "Macy's"
            },
            {
              "product_id": "BT012-WIN25",
              "name": "Holiday Dark Gray Pants",
              "type": "bottoms",
              "color": ["Dark Gray"],
              "fabric": "Premium Cotton",
              "price": 65.00,
              "cost": 28.00,
              "quantity_sold": 130,
              "date_added": "2025-09-15",
              "available_sizes": ["XS", "S", "M", "L", "XL"],
              "image_url": "/bottoms/dark gray-2.png",
              "buyer": "Dick's"
            }
          ]
        },
        {
          "name": "Holiday Collection",
          "id": "HC-WIN25",
          "products": [
            {
              "product_id": "TS009-WIN25",
              "name": "Festive Tee",
              "type": "shirt",
              "color": ["Pink"],
              "fabric": "Premium Cotton",
              "price": 55.00,
              "cost": 12.40,
              "quantity_sold": 185,
              "date_added": "2025-09-15",
              "available_sizes": ["XS", "S", "M", "L", "XL"],
              "image_url": "/cloth/shirt/pink-1.png",
              "buyer": "Dick's"
            }
          ]
        }
      ]
    },
    {
      "season": "Holiday 2025",
      "product_lines": [
        {
          "name": "Special Edition",
          "id": "SE-HOL25",
          "products": [
            {
              "product_id": "TS010-HOL25",
              "name": "Limited Edition Tee",
              "type": "shirt",
              "color": ["White"],
              "fabric": "Premium Cotton",
              "price": 52.00,
              "cost": 14.40,
              "quantity_sold": 75,
              "date_added": "2025-11-01",
              "available_sizes": ["S", "M", "L"],
              "image_url": "/cloth/shirt/white-1.png",
              "buyer": "Saks"
            },
            {
              "product_id": "BT013-HOL25",
              "name": "Limited Edition Blue Pants",
              "type": "bottoms",
              "color": ["Blue"],
              "fabric": "Premium Cotton",
              "price": 70.00,
              "cost": 30.00,
              "quantity_sold": 100,
              "date_added": "2025-11-01",
              "available_sizes": ["S", "M", "L"],
              "image_url": "/bottoms/blue-1.png",
              "buyer": "Saks"
            },
            {
              "product_id": "BT014-HOL25",
              "name": "Gift Box Dark Gray Pants",
              "type": "bottoms",
              "color": ["Dark Gray"],
              "fabric": "Organic Cotton",
              "price": 75.00,
              "cost": 32.00,
              "quantity_sold": 90,
              "date_added": "2025-11-15",
              "available_sizes": ["XS", "S", "M", "L", "XL"],
              "image_url": "/bottoms/dark gray-3.png",
              "buyer": "Nordstrom"
            },
            {
              "product_id": "BT015-HOL25",
              "name": "Holiday Green Pants",
              "type": "bottoms",
              "color": ["Green"],
              "fabric": "Premium Cotton",
              "price": 72.00,
              "cost": 31.00,
              "quantity_sold": 95,
              "date_added": "2025-11-20",
              "available_sizes": ["S", "M", "L", "XL"],
              "image_url": "/bottoms/green-1.png",
              "buyer": "Saks"
            },
            {
              "product_id": "BT016-HOL25",
              "name": "Festive Beige Pants",
              "type": "bottoms",
              "color": ["Beige"],
              "fabric": "Organic Cotton",
              "price": 68.00,
              "cost": 29.00,
              "quantity_sold": 85,
              "date_added": "2025-11-25",
              "available_sizes": ["XS", "S", "M", "L"],
              "image_url": "/bottoms/beige-1.png",
              "buyer": "Nordstrom"
            },
            {
              "product_id": "BT017-HOL25",
              "name": "Winter Blue Pants",
              "type": "bottoms",
              "color": ["Blue"],
              "fabric": "Premium Cotton",
              "price": 70.00,
              "cost": 30.00,
              "quantity_sold": 100,
              "date_added": "2025-12-01",
              "available_sizes": ["S", "M", "L"],
              "image_url": "/bottoms/blue-2.png",
              "buyer": "Saks"
            },
            {
              "product_id": "BT018-HOL25",
              "name": "Holiday Dark Gray Pants",
              "type": "bottoms",
              "color": ["Dark Gray"],
              "fabric": "Organic Cotton",
              "price": 75.00,
              "cost": 32.00,
              "quantity_sold": 90,
              "date_added": "2025-12-15",
              "available_sizes": ["XS", "S", "M", "L", "XL"],
              "image_url": "/bottoms/dark gray-4.png",
              "buyer": "Nordstrom"
            },
            {
              "product_id": "BT019-HOL25",
              "name": "Holiday Green Pants",
              "type": "bottoms",
              "color": ["Green"],
              "fabric": "Premium Cotton",
              "price": 72.00,
              "cost": 31.00,
              "quantity_sold": 95,
              "date_added": "2025-12-20",
              "available_sizes": ["S", "M", "L", "XL"],
              "image_url": "/bottoms/green-2.png",
              "buyer": "Saks"
            },
            {
              "product_id": "BT020-HOL25",
              "name": "Festive Beige Pants",
              "type": "bottoms",
              "color": ["Beige"],
              "fabric": "Organic Cotton",
              "price": 68.00,
              "cost": 29.00,
              "quantity_sold": 85,
              "date_added": "2025-12-25",
              "available_sizes": ["XS", "S", "M", "L"],
              "image_url": "/bottoms/beige-2.png",
              "buyer": "Nordstrom"
            },
            {
              "product_id": "BT021-HOL25",
              "name": "Winter Blue Pants",
              "type": "bottoms",
              "color": ["Blue"],
              "fabric": "Premium Cotton",
              "price": 70.00,
              "cost": 30.00,
              "quantity_sold": 100,
              "date_added": "2025-12-30",
              "available_sizes": ["S", "M", "L"],
              "image_url": "/bottoms/blue-3.png",
              "buyer": "Saks"
            },
            {
              "product_id": "BT022-HOL25",
              "name": "Holiday Dark Gray Pants",
              "type": "bottoms",
              "color": ["Dark Gray"],
              "fabric": "Organic Cotton",
              "price": 75.00,
              "cost": 32.00,
              "quantity_sold": 90,
              "date_added": "2025-12-31",
              "available_sizes": ["XS", "S", "M", "L", "XL"],
              "image_url": "/bottoms/dark gray-5.png",
              "buyer": "Nordstrom"
            }
          ]
        },
        {
          "name": "Gift Collection",
          "id": "GC-HOL25",
          "products": [
            {
              "product_id": "TS011-HOL25",
              "name": "Gift Box Tee",
              "type": "shirt",
              "color": ["Blue", "White"],
              "fabric": "Organic Cotton",
              "price": 51.00,
              "cost": 15.20,
              "quantity_sold": 140,
              "date_added": "2025-11-15",
              "available_sizes": ["XS", "S", "M", "L", "XL"],
              "image_url": "/cloth/shirt/blue+white-1.png",
              "buyer": "Nordstrom"
            }
          ]
        }
      ]
    }
  ]
} 
export default catalogueData;
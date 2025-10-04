import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import OrderDialog from "./OrderDialog";

// Food images
import saladImg from "@/assets/salad.jpg";
import platsImg from "@/assets/plats.jpg";
import pizza1Img from "@/assets/pizza1.jpg";
import pizza2Img from "@/assets/pizza2.jpg";
import burgerImg from "@/assets/burger.jpg";
import drinkImg from "@/assets/drink.jpg";

const MenuSection = () => {
  const [orderItems, setOrderItems] = useState<Record<string, number>>({});
  const [showOrderDialog, setShowOrderDialog] = useState(false);

  const handleQuantityChange = (itemName: string, delta: number) => {
    setOrderItems(prev => {
      const newQuantity = (prev[itemName] || 0) + delta;
      if (newQuantity <= 0) {
        const { [itemName]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemName]: newQuantity };
    });
  };

  const totalItems = Object.values(orderItems).reduce((sum, qty) => sum + qty, 0);

  const menuCategories = [
    {
      title: "🥗 Entrées",
      sections: [
        {
          subtitle: "Entrées Froides",
          items: [
            { name: "César", price: "17dt" },
            { name: "Italienne", price: "19dt" },
            { name: "The Wise", price: "24dt" },
            { name: "Fruits de Mer", price: "27dt" }
          ]
        },
        {
          subtitle: "Entrées Chaudes",
          items: [
            { name: "Omelette Thon-Fromage", price: "13dt" },
            { name: "Omelette Jambon-Fromage", price: "17dt" },
            { name: "Calamars Dorés", price: "21dt" },
            { name: "Moule Mariné", price: "24dt" },
            { name: "Crevettes Panées", price: "25dt" },
            { name: "Crevettes Sautées", price: "27dt" }
          ]
        }
      ],
      image: saladImg
    },
    {
      title: "🥩 Plats Principaux",
      sections: [
        {
          subtitle: "Les Volailles",
          items: [
            { name: "Escalope Grillé", price: "20dt" },
            { name: "Escalope Panée", price: "21dt" },
            { name: "Chich Taouk", price: "22dt" },
            { name: "Cordon Bleu", price: "23dt" },
            { name: "French Chicken", price: "26dt" },
            { name: "Suprême de Poulet à l'Italienne", price: "26dt" },
            { name: "Escalope Sauce Champignons", price: "27dt" }
          ]
        },
        {
          subtitle: "Les Viandes",
          items: [
            { name: "Kabeb Viande", price: "28dt" },
            { name: "Steak de Bœuf Farci", price: "28dt" },
            { name: "Grillade Mixte", price: "29dt" },
            { name: "Émincé de Bœuf à la Crème", price: "33dt" },
            { name: "Côte à l'Os", price: "35dt" },
            { name: "Filet de Bœuf", price: "42dt" }
          ]
        },
        {
          subtitle: "Supplément Sauce",
          items: [
            { name: "Poivre", price: "5dt" },
            { name: "Champignons", price: "6dt" },
            { name: "Roquefort", price: "7dt" }
          ]
        }
      ],
      image: platsImg
    },
    {
      title: "🦞 Fruits de Mer",
      items: [
        { name: "Poisson Grillé", description: "(Loup/Bourride)", price: "25dt" },
        { name: "Fruits de Mer", price: "36dt" },
        { name: "Oja Fruits de Mer", price: "38dt" },
        { name: "Délire The Wise", price: "48dt" },
        { name: "Gratin Fruits de Mer", price: "59dt" }
      ],
      // TODO: Replace with your seafood image
      // image: seafood
    },
    {
      title: "🍝 Pasta",
      items: [
        { name: "Lasagne Bolognaise", price: "21dt" },
        { name: "Putanesca", price: "23dt" },
        { name: "Bolognaise", price: "29dt" },
        { name: "Alfredo", price: "29dt" },
        { name: "Carbonara", price: "32dt" },
        { name: "4 Fromages", price: "33dt" },
        { name: "Spinaci", price: "33dt" },
        { name: "The Wise", price: "33dt" },
        { name: "Fruits de Mer", price: "36dt" },
        { name: "Lasposa", price: "39dt" },
        { name: "Pink", price: "39dt" }
      ],
      // TODO: Replace with your pasta image
      // image: pastaDish
    },
    {
      title: "🍕 Pizzas",
      items: [
        { name: "Margherita", sizes: "Petit 9dt - Moyen 12dt - Large 15dt - 1/4m 12dt - 1/2m 24dt - 1m 48dt" },
        { name: "Tuna", sizes: "Petit 10dt - Moyen 13dt - Large 16dt - 1/4m 13dt - 1/2m 26dt - 1m 52dt" },
        { name: "Vegetarien", sizes: "Petit 11dt - Moyen 14dt - Large 17dt - 1/4m 14dt - 1/2m 28dt - 1m 56dt" },
        { name: "Pepperoni", sizes: "Petit 12dt - Moyen 15dt - Large 18dt - 1/4m 15dt - 1/2m 30dt - 1m 60dt" },
        { name: "Chicken Grilli", sizes: "Petit 13dt - Moyen 16dt - Large 19dt - 1/4m 14dt - 1/2m 28dt - 1m 56dt" },
        { name: "4 Seasons", sizes: "Petit 14dt - Moyen 17dt - Large 20dt - 1/4m 15dt - 1/2m 30dt - 1m 60dt" },
        { name: "Queen", sizes: "Petit 14dt - Moyen 17dt - Large 20dt - 1/4m 15dt - 1/2m 30dt - 1m 60dt" },
        { name: "Regina", sizes: "Petit 14dt - Moyen 17dt - Large 20dt - 1/4m 15dt - 1/2m 30dt - 1m 60dt" },
        { name: "Norwegian", sizes: "Petit 14dt - Moyen 17dt - Large 20dt - 1/4m 15dt - 1/2m 30dt - 1m 60dt" },
        { name: "Orientale", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 16dt - 1/2m 32dt - 1m 64dt" },
        { name: "4 Fromages", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 16dt - 1/2m 32dt - 1m 64dt" },
        { name: "Gauss", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 16dt - 1/2m 32dt - 1m 64dt" },
        { name: "John Locke", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 16dt - 1/2m 32dt - 1m 64dt" },
        { name: "Pesto", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 16dt - 1/2m 32dt - 1m 64dt" },
        { name: "Chicken Spicy", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 16dt - 1/2m 32dt - 1m 64dt" },
        { name: "Carnot", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 16dt - 1/2m 32dt - 1m 64dt" },
        { name: "Mariotte", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 16dt - 1/2m 32dt - 1m 64dt" },
        { name: "Kepler", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 16dt - 1/2m 32dt - 1m 64dt" },
        { name: "Van der Waals", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 16dt - 1/2m 32dt - 1m 64dt" },
        { name: "Tesla", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 16dt - 1/2m 32dt - 1m 64dt" },
        { name: "Mexican", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 16dt - 1/2m 32dt - 1m 64dt" },
        { name: "Kentucky", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 16dt - 1/2m 32dt - 1m 64dt" },
        { name: "Sea Food", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 16dt - 1/2m 32dt - 1m 64dt" },
        { name: "Newton", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 17dt - 1/2m 34dt - 1m 68dt" },
        { name: "Einstein", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 17dt - 1/2m 34dt - 1m 68dt" },
        { name: "Barlow", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 17dt - 1/2m 34dt - 1m 68dt" },
        { name: "Millikan", sizes: "Petit 15dt - Moyen 18dt - Large 21dt - 1/4m 17dt - 1/2m 34dt - 1m 68dt" },
        { name: "Ampere", sizes: "Petit 19dt - Moyen 22dt - Large 25dt - 1/4m 20dt - 1/2m 40dt - 1m 80dt" },
        { name: "The Wise", sizes: "Petit 19dt - Moyen 22dt - Large 25dt - 1/4m 20dt - 1/2m 40dt - 1m 80dt" }
      ],
      images: [pizza1Img, pizza2Img]
    },
    {
      title: "🥪 Sandwiches",
      sections: [
        {
          subtitle: "Standard",
          items: [
            { name: "Jambon Dinde", price: "8.5dt" },
            { name: "Esc. Poulet Grillé", price: "9.5dt" },
            { name: "Esc. Poulet Panée", price: "10dt" },
            { name: "Chich Taouk", price: "10dt" },
            { name: "Cordon Bleu", price: "11dt" },
            { name: "Kabeb", price: "12dt" },
            { name: "Tacos Gratin", price: "+2.5dt" }
          ]
        },
        {
          subtitle: "Special The Wise",
          items: [
            { name: "Mariotte", price: "12dt" },
            { name: "Savored", price: "13dt" },
            { name: "Wilson", price: "13dt" },
            { name: "TacoWISE", price: "14dt" }
          ]
        },
        {
          subtitle: "Baguette Farcie / Makloub",
          items: [
            { name: "Thon", price: "12dt" },
            { name: "Pepperoni", price: "12dt" },
            { name: "Chicken Wise", price: "12dt" },
            { name: "Kentucky", price: "12dt" },
            { name: "Cheesy Wise", price: "12dt" },
            { name: "Cordon Bleu", price: "13dt" },
            { name: "Corleone", price: "13dt" },
            { name: "The Wise", price: "14dt" }
          ]
        },
        {
          subtitle: "Supplements Sandwich/Bowls",
          items: [
            { name: "Champignons", price: "3dt" },
            { name: "Gruyère", price: "3dt" },
            { name: "Cheddar", price: "3dt" },
            { name: "Mozzarella", price: "3dt" },
            { name: "Jambon", price: "3.5dt" },
            { name: "Portion Frites", price: "4.5dt" },
            { name: "Esc. Poulet Grillé", price: "4.5dt" },
            { name: "Esc. Poulet Panée", price: "4.5dt" },
            { name: "Nuggets", price: "4.5dt" },
            { name: "Cordon Bleu", price: "5.5dt" },
            { name: "Kabeb", price: "6dt" }
          ]
        }
      ],
      // TODO: Replace with your sandwiches image
      // image: sandwiches
    },
    {
      title: "🍔 Burgers",
      items: [
        { name: "Chicken Burger", price: "13dt" },
        { name: "Cheese Burger", price: "15dt" },
        { name: "Big Chicken Burger", price: "18dt" },
        { name: "Americain Burger", price: "19dt" },
        { name: "Big Cheese Burger", price: "21dt" },
        { name: "The Wise Burger", price: "24dt" }
      ],
      image: burgerImg
    },
    {
      title: "🍗 Chicken Box",
      items: [
        { name: "Hot Chicken Wings", description: "(8 pcs)", price: "16dt" },
        { name: "Chicken Fingers", description: "(12 pcs)", price: "17dt" },
        { name: "Hot Chicken Legs", description: "(6 pcs)", price: "22dt" },
        { name: "Fried Chicken Legs", description: "(6 pcs)", price: "24dt" },
        { name: "Fried Chicken Cheese", description: "(6 pcs)", price: "25dt" },
        { name: "Chicken Mix", description: "(3 fingers + 3 wings + 3 legs)", price: "28dt" }
      ],
      // TODO: Replace with your chicken box image
      // image: chickenBox
    },
    {
      title: "🥗 Bowls",
      items: [
        { name: "Esc. Grillé", price: "14.5dt" },
        { name: "Esc. Panée", price: "15dt" },
        { name: "Steak de Bœuf Haché", price: "16.5dt" },
        { name: "Pepperoni", price: "16.5dt" },
        { name: "Crevettes Sautées ou Panées", price: "19dt" }
      ],
      // TODO: Replace with your bowls image
      // image: bowls
    },
    {
      title: "⭐ Special The Wise",
      items: [
        { name: "Paella (1 pers.)", price: "39dt" },
        { name: "Paella (2 pers.)", price: "65dt" },
        { name: "Symphonie Fruits de Mer", price: "98dt" },
        { name: "Symphonie Mixte (Terre & Mer)", price: "160dt" }
      ]
    },
    {
      title: "🍫 Snacks",
      sections: [
        {
          subtitle: "Crêpes Sucrées",
          items: [
            { name: "Simple Nutella", price: "9.5dt" },
            { name: "Nutella Banane", price: "11dt" },
            { name: "Nutella Speculoos", price: "11.5dt" },
            { name: "Euchapina", price: "12dt" },
            { name: "Big Dolce", price: "16dt" }
          ]
        },
        {
          subtitle: "Crêpes Salées",
          items: [
            { name: "Thon Fromage", price: "10dt" },
            { name: "Jambon Fromage", price: "10.5dt" },
            { name: "Puttanesca", price: "12dt" },
            { name: "The Wise", price: "13dt" }
          ]
        },
        {
          subtitle: "Gaufres",
          items: [
            { name: "Nutella", price: "9.5dt" },
            { name: "Tropicale", price: "11dt" },
            { name: "Big Dolce", price: "16dt" },
            { name: "The Wise", price: "16dt" }
          ]
        }
      ],
      // TODO: Replace with your snacks image
      // image: snacks
    },
    {
      title: "👶 Menu Enfants",
      items: [
        { name: "Chapletta", description: "(Mini Pizza + Frites + Soda)", price: "13.8dt" },
        { name: "Calico", description: "(Nuggets + Frites + Soda)", price: "13.8dt" }
      ],
      // TODO: Replace with your kids menu image
      // image: kidsMenu
    },
    {
      title: "🥤 Boissons",
      sections: [
        {
          subtitle: "Boissons Chaudes",
          items: [
            { name: "Thé", price: "2dt" },
            { name: "Café Express", price: "2dt" },
            { name: "Café Direct", price: "2.5dt" },
            { name: "Café Crème", price: "3dt" },
            { name: "Cappuccino", price: "4dt" }
          ]
        },
        {
          subtitle: "Boissons Froides",
          items: [
            { name: "Eau Minérale", price: "1.5dt" },
            { name: "Coca Cola", price: "2.5dt" },
            { name: "Fanta", price: "2.5dt" },
            { name: "Sprite", price: "2.5dt" },
            { name: "Jus Frais", price: "5dt" },
            { name: "Smoothie", price: "7dt" },
            { name: "Mojito", price: "8dt" }
          ]
        }
      ],
      image: drinkImg
    }
  ];

  const getOrderList = () => {
    const items: Array<{ name: string; quantity: number; price: string }> = [];
    Object.entries(orderItems).forEach(([name, quantity]) => {
      items.push({ name, quantity, price: "" });
    });
    return items;
  };

  return (
    <section id="menu" className="py-16 bg-warm-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-restaurant-red/5 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-warm-neutral mb-4">
            Notre Menu Complet
          </h2>
          <p className="text-muted-foreground text-lg">
            Découvrez notre sélection de plats délicieux
          </p>
        </div>

        {/* Floating Order Button */}
        {totalItems > 0 && (
          <div className="fixed bottom-8 right-8 z-50 animate-scale-in">
            <Button
              onClick={() => setShowOrderDialog(true)}
              size="lg"
              className="rounded-full shadow-2xl bg-restaurant-red hover:bg-restaurant-red-dark text-white glow-on-hover h-16 px-8"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Commander ({totalItems})
            </Button>
          </div>
        )}

        <div className="grid gap-8">
          {menuCategories.map((category, index) => (
            <Card key={index} className="shadow-lg card-hover-effect animate-scale-in border-2 border-border/50" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardHeader className="bg-gradient-to-r from-restaurant-red to-restaurant-red-dark text-white">
                <CardTitle className="text-2xl font-bold text-center">
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {category.items && category.items.map((item: any, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between items-start p-4 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-all duration-200 rounded-lg group">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg group-hover:text-restaurant-red transition-colors text-warm-neutral">
                            {item.name}
                          </h4>
                          {item.description && (
                            <p className="text-muted-foreground text-sm mt-1">
                              {item.description}
                            </p>
                          )}
                          {item.sizes && (
                            <p className="text-restaurant-red text-sm mt-1 font-medium">
                              {item.sizes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {item.price && (
                            <Badge variant="secondary" className="bg-restaurant-red/10 text-restaurant-red border-restaurant-red/20">
                              {item.price}
                            </Badge>
                          )}
                          <div className="flex items-center gap-1 bg-muted rounded-full p-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 rounded-full hover:bg-restaurant-red hover:text-white"
                              onClick={() => handleQuantityChange(item.name, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {orderItems[item.name] || 0}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 rounded-full hover:bg-restaurant-red hover:text-white"
                              onClick={() => handleQuantityChange(item.name, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {category.sections && category.sections.map((section: any, sectionIndex) => (
                      <div key={sectionIndex} className="space-y-3">
                        <h3 className="font-bold text-xl text-restaurant-red mt-4 flex items-center gap-2">
                          <span className="h-1 w-8 bg-restaurant-red rounded"></span>
                          {section.subtitle}
                        </h3>
                        {section.items.map((item: any, itemIndex: number) => (
                          <div key={itemIndex} className="flex justify-between items-start p-4 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-all duration-200 rounded-lg group">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg group-hover:text-restaurant-red transition-colors text-warm-neutral">
                                {item.name}
                              </h4>
                              {item.description && (
                                <p className="text-muted-foreground text-sm mt-1">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {item.price && (
                                <Badge variant="secondary" className="bg-restaurant-red/10 text-restaurant-red border-restaurant-red/20">
                                  {item.price}
                                </Badge>
                              )}
                              <div className="flex items-center gap-1 bg-muted rounded-full p-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 rounded-full hover:bg-restaurant-red hover:text-white"
                                  onClick={() => handleQuantityChange(item.name, -1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-semibold">
                                  {orderItems[item.name] || 0}
                                </span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 rounded-full hover:bg-restaurant-red hover:text-white"
                                  onClick={() => handleQuantityChange(item.name, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  {/* Single image */}
                  {category.image && (
                    <div className="hidden lg:flex items-center justify-center">
                      <img 
                        src={category.image} 
                        alt={category.title}
                        className="max-w-md w-full h-auto object-contain rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                        style={{
                          filter: 'contrast(1.1) saturate(1.15) brightness(1.05)',
                        }}
                      />
                    </div>
                  )}
                  {/* Multiple images (like pizzas) */}
                  {category.images && (
                    <div className="hidden lg:flex flex-col gap-4 items-center justify-center">
                      {category.images.map((img: string, imgIndex: number) => (
                        <img 
                          key={imgIndex}
                          src={img} 
                          alt={`${category.title} ${imgIndex + 1}`}
                          className="max-w-sm w-full h-auto object-contain rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                          style={{
                            filter: 'contrast(1.1) saturate(1.15) brightness(1.05)',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {showOrderDialog && (
        <OrderDialog 
          open={showOrderDialog}
          onOpenChange={setShowOrderDialog}
          orderItems={getOrderList()}
        />
      )}
    </section>
  );
};

export default MenuSection;

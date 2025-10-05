import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import OrderDialog from "./OrderDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Food images
import saladImg from "@/assets/salad.jpg";
import platsImg from "@/assets/plats.jpg";
import pizza1Img from "@/assets/pizza1.jpg";
import pizza2Img from "@/assets/pizza2.jpg";
import burgerImg from "@/assets/burger.jpg";
import drinkImg from "@/assets/drink.jpg";

interface OrderItem {
  name: string;
  size?: string;
  price: number;
}

const MenuSection = () => {
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem & { quantity: number }>>({});
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [pizzaSizes, setPizzaSizes] = useState<Record<string, string>>({});
  const [quarterMeterPizzas, setQuarterMeterPizzas] = useState<string[]>([]);
  const { toast } = useToast();

  const handlePizzaOrder = (pizzaName: string, sizes: any) => {
    const selectedSize = pizzaSizes[pizzaName];
    
    if (!selectedSize) {
      toast({
        title: "Veuillez sélectionner une taille",
        description: "Choisissez la taille de votre pizza",
        variant: "destructive",
      });
      return;
    }

    const price = sizes[selectedSize];
    
    // Handle 1/4m orders differently
    if (selectedSize === "1/4m") {
      // Check if this pizza is already in the 1/4m selection
      if (quarterMeterPizzas.includes(pizzaName)) {
        toast({
          title: "Déjà ajouté",
          description: `${pizzaName} est déjà dans votre sélection 1/4m`,
          variant: "destructive",
        });
        return;
      }
      
      // Add to quarter meter selection
      setQuarterMeterPizzas(prev => [...prev, pizzaName]);
      
      toast({
        title: "Pizza 1/4m ajoutée",
        description: `${pizzaName} ajouté (${quarterMeterPizzas.length + 1}/4 pizzas sélectionnées)`,
      });
      return;
    }
    
    const itemKey = `${pizzaName} (${selectedSize})`;
    
    setOrderItems(prev => {
      const existing = prev[itemKey];
      if (existing) {
        return { ...prev, [itemKey]: { ...existing, quantity: existing.quantity + 1 } };
      }
      return { ...prev, [itemKey]: { name: pizzaName, size: selectedSize, price, quantity: 1 } };
    });

    toast({
      title: "Ajouté au panier",
      description: `${pizzaName} ajouté`,
    });
  };

  const handleQuantityChange = (itemKey: string, item: any, delta: number, isDirectPrice: boolean = false) => {
    if (!isDirectPrice) return; // Only allow direct price items for now
    
    setOrderItems(prev => {
      const existing = prev[itemKey];
      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          const { [itemKey]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [itemKey]: { ...existing, quantity: newQuantity } };
      } else if (delta > 0) {
        const newItem = { 
          name: item.name, 
          price: parseFloat(item.price.replace('dt', '')),
          quantity: 1 
        };
        
        toast({
          title: "Ajouté au panier",
          description: `${item.name} ajouté`,
        });
        
        return { 
          ...prev, 
          [itemKey]: newItem
        };
      }
      return prev;
    });
  };

  const handleCommander = () => {
    // Validate 1/4m pizzas selection
    if (quarterMeterPizzas.length > 0 && quarterMeterPizzas.length !== 4) {
      toast({
        title: "Sélection 1/4m incomplète",
        description: `Vous devez sélectionner exactement 4 types de pizzas différents pour le 1/4m. Actuellement: ${quarterMeterPizzas.length}/4`,
        variant: "destructive",
      });
      return;
    }
    
    // If we have exactly 4 quarter meter pizzas, add them to order
    if (quarterMeterPizzas.length === 4) {
      const quarterMeterKey = `Pizza 1/4m (${quarterMeterPizzas.join(", ")})`;
      const price = 12; // Base price for 1/4m from the menu
      
      setOrderItems(prev => ({
        ...prev,
        [quarterMeterKey]: {
          name: `Pizza 1/4m`,
          size: "1/4m",
          price: price,
          quantity: 1
        }
      }));
      
      // Clear the quarter meter selection
      setQuarterMeterPizzas([]);
    }
    
    setShowOrderDialog(true);
  };

  const totalItems = Object.values(orderItems).reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = Object.values(orderItems).reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const pizzaSizesData = {
    "Margherita: Sauce Tomate, Mozzarella": { "Petite": 11, "Moyenne": 15, "Grande": 19, "1/4m": 12, "1/2 mètre": 13, "1 mètre": 17 },
    "Tuna: Thon, Tomates Fraîches, Oignons, Olives, Sauce Tomate, Mozzarella": { "Petite": 12.5, "Moyenne": 17.5, "Grande": 26, "1/4m": 14.5, "1/2 mètre": 22, "1 mètre": 32 },
    "Tuna: Thon, Tomates Fraîches, Oignons, Olives, Sauce Tomate, Mozzarella": { "Petite": 12.5, "Moyenne": 17.5, "Grande": 26, "1/4m": 14.5, "1/2 mètre": 22, "1 mètre": 32 },
    "4 Seasons: Thon, Jambon de Dinde, Champignons, Poivrons, Oignons, Olives, Mozzarella, Sauce Tomate ": { "Petite": 14.5, "Moyenne": 22, "Grande": 32, "1/4m": 15, "1/2 mètre": 30, "1 mètre": 60 },
    "Vegetarien: Champignons, Poivrons, Oignons, Olives, Tomates Fraîches, Mozzarella, Sauce Tomate": { "Petite": 12.5, "Moyenne": 17.5, "Grande": 28, "1/4m": 14.5, "1/2 mètre": 17, "1 mètre": 32 },
    "Queen: Jambon de Dinde, Champignons, Mozzarella, Sauce Tomate": { "Petite": 12, "Moyenne": 17, "Grande": 25, "1/4m": 14, "1/2 mètre": 14, "1 mètre": 28 },
    "Orientale: Merguez, Poivrons, Oignons, Champignons, Tomates Fraîches, Sauce Tomate, Mozzarella ": { "Petite": 12, "Moyenne": 17.5, "Grande": 23, "1/4m": 14, "1/2 mètre": 14, "1 mètre": 24 },
    "Pepperoni: Pepperoni, Oignons, Sauce Tomate, Mozzarella": { "Petite": 12.5, "Moyenne": 17.5, "Grande": 28, "1/4m": 14.5, "1/2 mètre": 17, "1 mètre": 32 },
    "Chicken Supreme: Suprême de Poulet Fumé, Oignons, Poivrons, Champignons, Sauce Tomate, Mozzarella ": { "Petite": 15, "Moyenne": 22, "Grande": 32, "1/4m": 16, "1/2 mètre": 32, "1 mètre": 64 },
    "4 Cheese: Sauce Tomate, Mozzarella, Fromage, Sauce Blanche": { "Petite": 12.5, "Moyenne": 17.5, "Grande": 28, "1/4m": 14.5, "1/2 mètre": 17, "1 mètre": 32 },
    "Regina: Jambon de Dinde, Champignons, Oignons, Olives, Sauce Tomate, Mozzarella": { "Petite": 12, "Moyenne": 17, "Grande": 25, "1/4m": 14, "1/2 mètre": 14, "1 mètre": 28 },
    "Chicken Grill: Émincés de Poulet Grillés, Poivrons, Champignons, Oignons, Sauce Tomate, Mozzarella": { "Petite": 13, "Moyenne": 20, "Grande": 29, "1/4m": 14, "1/2 mètre": 28, "1 mètre": 56 },
    "Mexicain: Poivrons, Piments Jalapeños, Champignons, Oignons, Tomates, Sauce Tomate, Mozzarella": { "Petite": 13, "Moyenne": 20, "Grande": 29, "1/4m": 15, "1/2 mètre": 29, "1 mètre": 58 },
    "Kentucky: Poulet Kentucky, Champignons, Oignons, Poivrons, Tomates, Sauce Tomate, Mozzarella": { "Petite": 14, "Moyenne": 21, "Grande": 30, "1/4m": 15, "1/2 mètre": 30, "1 mètre": 60 },
    "Norwegian: Saumon Fumé, Crème Fraîche, Mozzarella": { "Petite": 17, "Moyenne": 27, "Grande": 35, "1/4m": 19, "1/2 mètre": 35, "1 mètre": 70 },
    "Sea Food: Fruits de Mer, Poivrons, Oignons, Olives, Sauce Tomate, Mozzarella": { "Petite": 17, "Moyenne": 27, "Grande": 35, "1/4m": 19, "1/2 mètre": 35, "1 mètre": 70 },
    "Newton: Poulet Grillé, Poulet Pané, Champignons, Poivrons, Oignons, Tomates, Sauce Tomate, Mozzarella": { "Petite": 18, "Moyenne": 29, "Grande": 32, "1/4m": 15.5, "1/2 mètre": 15.5, "1 mètre": 32 },
    "Einstein: Viande de Bœuf Hachée, Champignons, Tomates Fraîches, Oignons, Sauce Tomate, Mozzarella": { "Petite": 18, "Moyenne": 29, "Grande": 32, "1/4m": 15.5, "1/2 mètre": 15.5, "1 mètre": 32 },
    "Barlow: Viande de Bœuf Hachée, Jambon, Champignons, Poivrons, Oignons, Tomates, Sauce Tomate, Mozzarella": { "Petite": 18, "Moyenne": 29, "Grande": 32, "1/4m": 15.5, "1/2 mètre": 15.5, "1 mètre": 32 },
    "Millikan: Anchois, Filet de Sardine, Olives, Poivrons, Sauce Tomate, Mozzarella": { "Petite": 18, "Moyenne": 29, "Grande": 32, "1/4m": 16, "1/2 mètre": 16, "1 mètre": 32 },
    "Ampere: Pepperoni, Viande de Bœuf Hachée, Oignons, Poivrons, Olives, Sauce Tomate, Mozzarella": { "Petite": 18, "Moyenne": 29, "Grande": 32, "1/4m": 17.5, "1/2 mètre": 17.5, "1 mètre": 32 },
    "Gauss: Thon, Œuf, Roquefort, Gruyère, Oignons, Olives, Sauce Tomate, Mozzarella": { "Petite": 13, "Moyenne": 22, "Grande": 32, "1/4m": 16, "1/2 mètre": 16, "1 mètre": 32 },
    "John Locke: Poulet Pané, Sauce Piquante, Oignons, Poivrons, Olives, Sauce Tomate, Mozzarella": { "Petite": 13, "Moyenne": 22, "Grande": 32, "1/4m": 16, "1/2 mètre": 16, "1 mètre": 32 },
    "Pesto: Sauce Pesto, Mozzarella, Pepperoni ": { "Petite": 13, "Moyenne": 22, "Grande": 32, "1/4m": 16, "1/2 mètre": 16, "1 mètre": 32 },
    "Chicken Spicy: Poulet Pané, Sauce Piquante, Poivrons, Oignons, Olives, Champignons, Sauce Tomate, Mozzarella": { "Petite": 13, "Moyenne": 22, "Grande": 32, "1/4m": 16, "1/2 mètre": 16, "1 mètre": 32 },
    "Carnot: Gruyère, Oignons, Poivrons, Champignons, Sauce Tomate, Mozzarella": { "Petite": 15.5, "Moyenne": 22, "Grande": 32, "1/4m": 17.5, "1/2 mètre": 17.5, "1 mètre": 32 },
    "Mariotte: Poulet Pané, Gruyère, Oignons, Olives, Sauce Tomate, Mozzarella": { "Petite": 14.5, "Moyenne": 21, "Grande": 32, "1/4m": 16.5, "1/2 mètre": 16.5, "1 mètre": 32 },
    "Kepler: Crevettes, Champignons, Oignons, Sauce Tomate, Mozzarella": { "Petite": 14, "Moyenne": 21, "Grande": 32, "1/4m": 17, "1/2 mètre": 17, "1 mètre": 32 },
    "Van der waals: Viande Hachée, Champignons, Oignons, Mozzarella, Sauce Barbecue": { "Petite": 13, "Moyenne": 21, "Grande": 32, "1/4m": 16.5, "1/2 mètre": 16.5, "1 mètre": 32 },
    "Tesla: Suprême de Poulet Fumé, Sauce Tomate, Mozzarella": { "Petite": 13, "Moyenne": 21, "Grande": 32, "1/4m": 17, "1/2 mètre": 17, "1 mètre": 32 },
    "The Wise: Saumon Fumé, Crevettes, Fruits de Mer, Mozzarella": { "Petite": 13, "Moyenne": 21, "Grande": 32, "1/4m": 17, "1/2 mètre": 17, "1 mètre": 32 },
  };

  const menuCategories = [
    {
      title: "🥗 Entrées",
      sections: [
        {
          subtitle: "Entrées Froides",
          items: [
            { name: "César", price: "17dt" },
            { name: "Italienne", price: "19dt" },
            { name: "Fruits de Mer", price: "27dt" },
            { name: "The Wise", price: "24dt" }
          ]
        },
        {
          subtitle: "Entrées Chaudes",
          items: [
            { name: "Omelette Thon-Fromage", price: "13dt" },
            { name: "Omelette Jambon-Fromage", price: "18dt" },
            { name: "Moule Mariné", price: "24dt" },
            { name: "Calamars Dorés", price: "21dt" },
            { name: "à l'Ail", price: "25dt" },
            { name: "à la Crème", price: "27dt" },
            { name: "Crevettes Sautées", price: "27dt" },
            { name: "Crevettes Panées", price: "25dt" }
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
            { name: "Cordon Bleu", price: "23dt" },
            { name: "French Chicken", price: "26dt" },
            { name: "Suprême de Poulet à l'Italien", price: "26dt" },
            { name: "Chich Taouk", price: "22dt" },
            { name: "Escalope Sauce Champignons", price: "27dt" }
          ]
        },
        {
          subtitle: "Les Viandes",
          items: [
            { name: "Grillade Mixte", price: "33dt" },
            { name: "Émincé de Bœuf à la Crème", price: "33dt" },
            { name: "Filet de Bœuf", price: "42dt" },
            { name: "Kabeb Viande", price: "28dt" },
            { name: "Steak Haché Fondant", price: "31dt" },
            { name: "Côte à l'Os", price: "35dt" }
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
        { name: "Poisson Grillé", description: "(Loup ou Bourride)", price: "25dt" },
        { name: "Loup", description: "Garniture du chef", price: "29dt" },
        { name: "à l'Ail", description: "Garniture du chef", price: "35dt" },
        { name: "Fruits de Mer", description: "Garniture du chef", price: "37dt" },
        { name: "Oja Fruits de Mer", price: "43dt" },
        { name: "Délice The Wise", description: "Fruits de Mer / Filet de Poisson / Garniture du chef", price: "48dt" },
        { name: "Gratin Fruits de Mer", description: "Garniture du chef", price: "59dt" }
      ]
    },
    {
      title: "🍝 Pasta",
      subtitle: "Spaghetti, Pennes, Tagliatelles",
      items: [
        { name: "Fruits de Mer (Sauce Rouge)", price: "36dt" },
        { name: "Lasposa (Fruits de Mer, Sauce Blanche)", price: "39dt" },
        { name: "Pink (Viande Fumé, Sauce Pink, Oignon, Gruyère)", price: "31dt" },
        { name: "Carbonara (Jambon, Champignons, Jaune d'œuf, Sauce Blanche)", price: "22dt" },
        { name: "Bolognaise (Viande hachée, Sauce tomate)", price: "25dt" },
        { name: "Putanesca (Thon, Olive, Câpre, Piments de Cayenne)", price: "23dt" },
        { name: "Spinaci (Chevrettes, Champignons, Epinard, Tomates Cerises)", price: "33dt" },
        { name: "Alfredo (Poulet, Champignons, Sauce Blanche)", price: "26dt" },
        { name: "The Wise (Crevette, Saumon, Sauce Rosée)", price: "39dt" },
        { name: "Lasagne Bolognaise", price: "21dt" },
        { name: "4 Fromages", price: "25dt" }
      ]
    },
    {
      title: "🍕 Pizzas",
      isPizza: true,
      pizzas: Object.keys(pizzaSizesData),
      images: [pizza1Img, pizza2Img]
    },
    {
      title: "🥪 Sandwiches",
      sections: [
        {
          subtitle: "Ciabata",
          items: [
            { name: "Jambon Dinde", price: "8.5dt" },
            { name: "Esc. Poulet Grillé", price: "9.5dt" },
            { name: "Esc. Poulet Panée", price: "10dt" },
            { name: "Chich Taouk", price: "10dt" },
            { name: "Cordon Bleu", price: "11dt" },
            { name: "Kabeb", price: "12dt" }
          ]
        },
        {
          subtitle: "Special The Wise",
          items: [
            { name: "Mariotte", price: "12dt" },
            { name: "Wilson", price: "13dt" },
            { name: "Savored", price: "13dt" },
            { name: "TacoWise", price: "14dt" }
          ]
        },
        {
          subtitle: "Baguette Farcie / Makloub The Wise",
          items: [
            { name: "Thon", price: "12dt" },
            { name: "Pepperoni", price: "12dt" },
            { name: "Oriental", price: "12dt" },
            { name: "Corleone", price: "13dt" },
            { name: "Kentucky", price: "12dt" },
            { name: "Cheesy Wise", price: "14dt" },
            { name: "Chicken Wise", price: "13dt" },
            { name: "The Wise", price: "14dt" }
          ]
        },
        {
          subtitle: "Supplements Sandwich/Bowls",
          items: [
            { name: "Portion Frites", price: "4dt" },
            { name: "Thon", price: "4.5dt" },
            { name: "Nuggets", price: "4.5dt" },
            { name: "Esc. Poulet Grillé", price: "4.5dt" },
            { name: "Esc. Poulet Panée", price: "4.5dt" },
            { name: "Jambon", price: "2.5dt" },
            { name: "Œuf", price: "1dt" },
            { name: "Champignons", price: "2.5dt" },
            { name: "Gruyère", price: "3.5dt" },
            { name: "Cheddar", price: "3dt" },
            { name: "Mozzarella", price: "3dt" },
            { name: "Cordon Bleu", price: "5dt" },
            { name: "Chich Taouk", price: "6dt" },
            { name: "Kabeb", price: "6dt" }
          ]
        }
      ]
    },
    {
      title: "🍔 Burgers",
      items: [
        { name: "Chicken Burger", price: "13dt" },
        { name: "Big Chicken Burger", price: "18dt" },
        { name: "Cheese Burger", price: "15dt" },
        { name: "Big Cheese Burger", price: "21dt" },
        { name: "Americain Burger", price: "19dt" },
        { name: "The Wise Burger", price: "22dt" }
      ],
      image: burgerImg
    },
    {
      title: "🍗 Chicken Box",
      items: [
        { name: "Chicken Fingers", description: "Bâtonnets de poulet Panés (9 pièces)", price: "17dt" },
        { name: "Hot Chicken Legs", description: "Cuisses de Poulet Épicées (6 pièces)", price: "22dt" },
        { name: "Fried Chicken Cheese", description: "Poulet Pané Farci au Fromage (6 pièces)", price: "25dt" },
        { name: "Fried Chicken Legs", description: "Cuisses de Poulet Panées (6 pièces)", price: "22dt" },
        { name: "Hot Chicken Wings", description: "Ailes de Poulet Épicées (8 pièces)", price: "16dt" },
        { name: "Chicken Mix", description: "3 fingers + 2 wings + 3 legs (8 pièces)", price: "28dt" }
      ]
    },
    {
      title: "🥗 Bowls",
      description: "Nos Bowls sont Garnis d'une Sauce Maison, Frites, Mozzarella + Viande Au Choix",
      items: [
        { name: "Esc. Grillé", price: "14.5dt" },
        { name: "Esc. Panée", price: "15dt" },
        { name: "Steak de Bœuf Haché", price: "16dt" },
        { name: "Pepperoni", price: "14.5dt" },
        { name: "Crevettes Sautées ou Panées", price: "19dt" }
      ]
    },
    {
      title: "⭐ Special The Wise",
      items: [
        { name: "Symphonie Fruits de Mer", price: "98dt" },
        { name: "Paella (1 pers.)", price: "39dt" },
        { name: "Paella (2 pers.)", price: "85dt" },
        { name: "Symphonie Mixte (Terre, Mer)", price: "160dt" }
      ]
    },
    {
      title: "🍫 Snacks",
      sections: [
        {
          subtitle: "Les Crêpes Sucrées",
          items: [
            { name: "Simple Nutella, Garniture", price: "9dt" },
            { name: "Thon Fromage, Thon, Fromage", price: "8.5dt" },
            { name: "Nutella Banane, Nutella, Banane, Garniture", price: "12dt" },
            { name: "Jambon Fromage, Jambon, Fromage", price: "9dt" },
            { name: "Dolce, Nutella, Speculoos", price: "11dt" },
            { name: "Puttanesca, Sauce Puttanesca, Sauce Napolitaine, Câpre, Piment de Cayenne, Thon, Olive", price: "11.5dt" },
            { name: "Ecubana, Banane, Miel", price: "14dt" },
            { name: "Complet, Œuf, Harissa, Jambon, Thon, Mozzarella", price: "11dt" },
            { name: "The Wise, Nutella, Chocolat Blanc, m&m's, Twix, Speculoos, Crème Cheese", price: "16dt" },
            { name: "The Wise, Harissa, mozzarella, ricotta jambon fumée, emincé de poulet champignon sauté", price: "18dt" }
          ]
        },
        {
          subtitle: "Les Crêpes Salées",
          items: [
            { name: "Thon Fromage", price: "10dt" },
            { name: "Jambon Fromage", price: "10.5dt" },
            { name: "Puttanesca", price: "11.5dt" },
            { name: "The Wise", price: "18dt" }
          ]
        },
        {
          subtitle: "Gaufres",
          items: [
            { name: "Nutella", price: "9.5dt" },
            { name: "Tropicale, Nutella, Kiwi, Banane, Chantilly", price: "11dt" },
            { name: "Big Dolce, Nutella, Oreo, Speculoos, Fruit sec, garnitures", price: "13dt" },
            { name: "The Wise, Nutella, Oreo, Speculoos, Fruit sec, garnitures", price: "16dt" }
          ]
        }
      ]
    },
    {
      title: "👶 Menu Enfants",
      items: [
        { name: "Chapletta", description: "(Mini Pizza ou Frites + Soda)", price: "13.8dt" },
        { name: "Calico", description: "(Nuggets + Frites + Soda)", price: "13.8dt" }
      ]
    },
    {
      title: "🥤 Boissons",
      sections: [
        {
          subtitle: "Hot Drinks",
          items: [
            { name: "Express", price: "2.5dt" },
            { name: "Direct", price: "3dt" },
            { name: "Cappuccin", price: "2.8dt" },
            { name: "Crème", price: "5.5dt" },
            { name: "Cappuccino", price: "4.5dt" },
            { name: "Crème Nutella", price: "5.4dt" },
            { name: "Chocolat au lait", price: "3dt" },
            { name: "Thé à la menthe", price: "1.8dt" },
            { name: "Thé aux amandes", price: "4.8dt" },
            { name: "Thé pignon", price: "7.8dt" },
            { name: "Verveine", price: "2.8dt" }
          ]
        },
        {
          subtitle: "Cocktails",
          items: [
            { name: "Amoureux, Fraise, banane", price: "9.2dt" },
            { name: "Scandinave, kiwi, Banane", price: "9.8dt" },
            { name: "Black & white, Banane, Nutella", price: "10.5dt" },
            { name: "Palmier, Dattes, Banane", price: "10.5dt" },
            { name: "The wise, Banane, Datte, Miel, Fruits Secs+Garnitures", price: "12.8dt" }
          ]
        },
        {
          subtitle: "Mojito",
          items: [
            { name: "Virgin Mojito", price: "7.8dt" },
            { name: "Healthy Mojito", price: "7.8dt" },
            { name: "Blue Mojito", price: "8.8dt" },
            { name: "Red Mojito", price: "8.8dt" },
            { name: "Fruit de Passion", price: "8.8dt" },
            { name: "Energetic Mojito", price: "12.8dt" }
          ]
        },
        {
          subtitle: "Smoothies",
          items: [
            { name: "Red Frutti", price: "9.8dt" },
            { name: "Pina Colada", price: "10.5dt" },
            { name: "Blue Berry", price: "9.8dt" },
            { name: "Passion kiwi", price: "11.5dt" },
            { name: "The Wise", price: "13.5dt" }
          ]
        },
        {
          subtitle: "Les Jus",
          items: [
            { name: "Citron", price: "3.8dt" },
            { name: "Citron aux amandes", price: "7.2dt" },
            { name: "Banane", price: "7.8dt" },
            { name: "Orange", price: "4.2dt" },
            { name: "Fraise", price: "6.5dt" },
            { name: "Jus Fruits", price: "9.8dt" }
          ]
        },
        {
          subtitle: "Frappuccino",
          items: [
            { name: "Nutella", price: "9.8dt" },
            { name: "Spéculoos", price: "9.8dt" },
            { name: "Oreo", price: "9.8dt" },
            { name: "Twix", price: "9.8dt" },
            { name: "Snickers", price: "9.8dt" },
            { name: "The wise, Banane, Nutella, Oreo, Garnitures", price: "13.8dt" }
          ]
        },
        {
          subtitle: "Jwajem",
          items: [
            { name: "Mini The Wise", price: "12dt" },
            { name: "Spécial The Wise", price: "17dt" }
          ]
        },
        {
          subtitle: "Desserts",
          items: [
            { name: "Tiramisu", price: "6.8dt" },
            { name: "Cheese Cake", price: "6.8dt" },
            { name: "American Chocolate", price: "9.8dt" }
          ]
        },
        {
          subtitle: "Suppléments",
          items: [
            { name: "Dose arôme", price: "2.8dt" },
            { name: "Chantilly", price: "1.8dt" },
            { name: "Nutella", price: "3.8dt" },
            { name: "Amande", price: "3.2dt" }
          ]
        },
        {
          subtitle: "Boissons",
          items: [
            { name: "Eau Minérale 0.5L", price: "1.3dt" },
            { name: "Eau Minérale 1L", price: "2.5dt" },
            { name: "Soda", price: "2.8dt" },
            { name: "Orangina", price: "3.2dt" },
            { name: "Energy Drink", price: "8.8dt" }
          ]
        }
      ],
      image: drinkImg
    }
  ];

  const getOrderList = () => {
    return Object.entries(orderItems).map(([key, item]) => ({
      name: key,
      quantity: item.quantity,
      price: `${item.price}dt`
    }));
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
        {(totalItems > 0 || quarterMeterPizzas.length > 0) && (
          <div className="fixed bottom-8 right-8 z-50 animate-scale-in">
            <Button
              onClick={handleCommander}
              size="lg"
              className="rounded-full shadow-2xl bg-restaurant-red hover:bg-restaurant-red-dark text-white glow-on-hover h-16 px-8"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Commander ({totalItems + (quarterMeterPizzas.length > 0 ? 1 : 0)})
              {totalPrice > 0 && ` - ${totalPrice.toFixed(2)}dt`}
              {quarterMeterPizzas.length > 0 && (
                <span className="ml-2 text-xs">
                  (1/4m: {quarterMeterPizzas.length}/4)
                </span>
              )}
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
                {category.subtitle && (
                  <p className="text-center text-white/90 text-sm mt-2">{category.subtitle}</p>
                )}
              </CardHeader>
              <CardContent className="p-6">
                {category.isPizza ? (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {category.pizzas?.map((pizzaName: string, pizzaIndex: number) => (
                        <div key={pizzaIndex} className="p-4 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-all duration-200 rounded-lg group">
                          <h4 className="font-semibold text-lg group-hover:text-restaurant-red transition-colors text-warm-neutral mb-3">
                            {pizzaName}
                          </h4>
                          <div className="flex gap-2 items-center flex-wrap">
                            <Select
                              value={pizzaSizes[pizzaName] || ""}
                              onValueChange={(value) => setPizzaSizes(prev => ({ ...prev, [pizzaName]: value }))}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sélectionnez la taille" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(pizzaSizesData[pizzaName] || {}).map(([size, price]: [string, number]) => (
                                  <SelectItem key={size} value={size}>
                                    {size} - {price}dt
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={() => handlePizzaOrder(pizzaName, pizzaSizesData[pizzaName])}
                              size="sm"
                              className="bg-restaurant-red hover:bg-restaurant-red-dark text-white"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Ajouter
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {category.images && (
                      <div className="hidden lg:flex flex-col gap-4 items-center justify-center">
                        {category.images.map((img: string, imgIndex: number) => (
                          <img 
                            key={imgIndex}
                            src={img} 
                            alt={`${category.title} ${imgIndex + 1}`}
                            className="max-w-lg w-full h-auto object-contain rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                            style={{
                              filter: 'contrast(1.1) saturate(1.15) brightness(1.05)',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {category.description && (
                        <p className="text-sm text-muted-foreground italic mb-4">{category.description}</p>
                      )}
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
                                onClick={() => handleQuantityChange(item.name, item, -1, true)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-semibold">
                                {orderItems[item.name]?.quantity || 0}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 rounded-full hover:bg-restaurant-red hover:text-white"
                                onClick={() => handleQuantityChange(item.name, item, 1, true)}
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
                                    onClick={() => handleQuantityChange(item.name, item, -1, true)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center text-sm font-semibold">
                                    {orderItems[item.name]?.quantity || 0}
                                  </span>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 rounded-full hover:bg-restaurant-red hover:text-white"
                                    onClick={() => handleQuantityChange(item.name, item, 1, true)}
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
                  </div>
                )}
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
          totalPrice={totalPrice}
        />
      )}
    </section>
  );
};

export default MenuSection;

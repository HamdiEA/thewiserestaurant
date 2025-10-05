import { MapPin, Phone, Clock } from "lucide-react";

const Footer = () => {
  const locations = [
    { 
      name: "Bardo Tunis", 
      phone: "52 555 414", 
      address: "AV HABIB BOURGUIBA (RUE DES ORANGES) 2000, BARDO TUNIS"
    },
    { 
      name: "Ben Arous Tunis", 
      phone: "94 722 566", 
      address: "COMPLEXE COMMERCIAL AV HABIB BOURGUIBA - BEN AROUS"
    },
    { 
      name: "Ksar Hellal Monastir", 
      phone: "52 555 400", 
      address: "AV HAJ ALI SOUA KSAR HELLAL - MONASTIR"
    }
  ];

  return (
    <footer className="bg-warm-neutral text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-restaurant-red to-restaurant-red-light text-white px-4 py-2 rounded-lg font-bold text-xl inline-block">
              The Wise
            </div>
            <p className="text-white/80">
              Restaurant
            </p>
            <p className="text-white/70 text-sm">
              Choisissez Votre Nourriture Sagement - Découvrez une cuisine exceptionnelle dans nos trois emplacements en Tunisie.
            </p>
          </div>

          {/* Locations */}
          {locations.map((location, index) => (
            <div key={index} className="space-y-3">
              <h4 className="font-semibold text-restaurant-red-light text-lg">
                {location.name}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-restaurant-red-light flex-shrink-0" />
                  <span className="text-white/80">
                    {location.address}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-restaurant-red-light" />
                  <span className="text-white/80">
                    {location.phone}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="h-4 w-4 text-restaurant-red-light" />
            <span className="text-white/80 text-sm">
              Ouvert Tous les Jours | Les horaires peuvent varier selon l'emplacement
            </span>
          </div>
          <p className="text-white/60 text-sm">
            © 2024 The Wise Restaurant. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
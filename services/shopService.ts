import { Card, ElementType } from '../types';
import { collectionService } from './collectionService';
import GEN1_RAW from '../pokemons/gen1';

export interface ShopOffer {
  id: string;
  cardId: string;
  category: 'featured' | 'weekly' | 'rare' | 'starter' | 'legendary';
  price: number;
  originalPrice?: number; // Se tiver desconto
  discount?: number; // Porcentagem de desconto
  startDate?: string; // ISO string
  endDate?: string; // ISO string
  stock?: number; // Quantidade disponível (undefined = ilimitado)
  maxPurchasesPerPlayer?: number; // Máximo por jogador
}

export interface ShopCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

const SHOP_CATEGORIES: ShopCategory[] = [
  {
    id: 'featured',
    name: 'Destaques',
    icon: '⭐',
    description: 'Ofertas especiais selecionadas!',
    color: 'from-yellow-600 to-amber-600'
  },
  {
    id: 'weekly',
    name: 'Oferta Semanal',
    icon: '🔥',
    description: 'Promoções que mudam toda semana!',
    color: 'from-red-600 to-orange-600'
  },
  {
    id: 'rare',
    name: 'Raros',
    icon: '💎',
    description: 'Cartas raras e poderosas',
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 'starter',
    name: 'Iniciantes',
    icon: '🌱',
    description: 'Perfeito para começar sua jornada',
    color: 'from-green-600 to-emerald-600'
  },
  {
    id: 'legendary',
    name: 'Lendários',
    icon: '👑',
    description: 'Os mais poderosos do jogo',
    color: 'from-blue-600 to-cyan-600'
  }
];

// Configuração das ofertas da loja
const SHOP_OFFERS: ShopOffer[] = [
  // DESTAQUES - Rotação quinzenal
  {
    id: 'featured_1',
    cardId: '006',
    category: 'featured',
    price: 5800,
    originalPrice: 8000,
    discount: 33,
    startDate: '2025-12-25',
    endDate: '2026-01-08'
  },
  {
    id: 'featured_2',
    cardId: '150',
    category: 'featured',
    price: 10500,
    originalPrice: 20000,
    discount: 25,
    startDate: '2025-12-25',
    endDate: '2026-01-08'
  },
  {
    id: 'featured_3',
    cardId: '149',
    category: 'featured',
    price: 9000,
    originalPrice: 13000,
    discount: 31,
    startDate: '2025-12-25',
    endDate: '2026-01-08'
  },

  // OFERTA SEMANAL - Rotação semanal
  {
    id: 'weekly_1',
    cardId: '094',
    category: 'weekly',
    price: 4500,
    originalPrice: 7500,
    discount: 40,
    startDate: '2025-12-30',
    endDate: '2026-01-06'
  },
  {
    id: 'weekly_2',
    cardId: '065',
    category: 'weekly',
    price: 4800,
    originalPrice: 8000,
    discount: 40,
    startDate: '2025-12-30',
    endDate: '2026-01-06'
  },
  {
    id: 'weekly_3',
    cardId: '068',
    category: 'weekly',
    price: 4200,
    originalPrice: 7000,
    discount: 40,
    startDate: '2025-12-30',
    endDate: '2026-01-06'
  },
  {
    id: 'weekly_4',
    cardId: '130',
    category: 'weekly',
    price: 4500,
    originalPrice: 7500,
    discount: 40,
    startDate: '2025-12-30',
    endDate: '2026-01-06'
  },

  // RAROS - Sempre disponíveis, preços premium
  {
    id: 'rare_1',
    cardId: '131',
    category: 'rare',
    price: 8500
  },
  {
    id: 'rare_2',
    cardId: '143',
    category: 'rare',
    price: 9000
  },
  {
    id: 'rare_3',
    cardId: '144',
    category: 'rare',
    price: 11000
  },
  {
    id: 'rare_4',
    cardId: '145',
    category: 'rare',
    price: 11000
  },
  {
    id: 'rare_5',
    cardId: '146',
    category: 'rare',
    price: 11000
  },
  {
    id: 'rare_6',
    cardId: '142',
    category: 'rare',
    price: 8000
  },

  // INICIANTES - Cartas acessíveis para começar
  {
    id: 'starter_1',
    cardId: '025',
    category: 'starter',
    price: 200
  },
  {
    id: 'starter_2',
    cardId: '004',
    category: 'starter',
    price: 150
  },
  {
    id: 'starter_3',
    cardId: '001',
    category: 'starter',
    price: 150
  },
  {
    id: 'starter_4',
    cardId: '007',
    category: 'starter',
    price: 150
  },
  {
    id: 'starter_5',
    cardId: '133',
    category: 'starter',
    price: 250
  },
  {
    id: 'starter_6',
    cardId: '039',
    category: 'starter',
    price: 180
  },
  {
    id: 'starter_7',
    cardId: '054',
    category: 'starter',
    price: 160
  },
  {
    id: 'starter_8',
    cardId: '052',
    category: 'starter',
    price: 140
  },

  // LENDÁRIOS - Cartas mais caras e poderosas
  {
    id: 'legendary_1',
    cardId: '151',
    category: 'legendary',
    price: 25000
  },
  {
    id: 'legendary_2',
    cardId: '150',
    category: 'legendary',
    price: 20000
  },
  {
    id: 'legendary_3',
    cardId: '149',
    category: 'legendary',
    price: 13000
  },
  {
    id: 'legendary_4',
    cardId: '144',
    category: 'legendary',
    price: 11000
  },
  {
    id: 'legendary_5',
    cardId: '145',
    category: 'legendary',
    price: 11000
  },
  {
    id: 'legendary_6',
    cardId: '146',
    category: 'legendary',
    price: 11000
  }
];

const STORAGE_KEY = 'pokecardBattle_shop_purchases';

class ShopService {
  private purchases: Map<string, number> = new Map();
  private DEFAULT_MAX_PURCHASES_PER_PLAYER = 1;

  constructor() {
    this.loadPurchases();
  }

  private loadPurchases(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        this.purchases = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Error loading shop purchases:', error);
    }
  }

  private savePurchases(): void {
    try {
      const data = Object.fromEntries(this.purchases);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving shop purchases:', error);
    }
  }

  getCategories(): ShopCategory[] {
    return SHOP_CATEGORIES;
  }

  getAllOffers(): ShopOffer[] {
    return SHOP_OFFERS.filter(offer => this.isOfferActive(offer));
  }

  getOffersByCategory(categoryId: string): ShopOffer[] {
    return SHOP_OFFERS.filter(
      offer => offer.category === categoryId && this.isOfferActive(offer)
    );
  }

  getOffer(offerId: string): ShopOffer | undefined {
    const offer = SHOP_OFFERS.find(o => o.id === offerId);
    if (offer && this.isOfferActive(offer)) {
      return offer;
    }
    return undefined;
  }

  private isOfferActive(offer: ShopOffer): boolean {
    const now = new Date();
    
    if (offer.startDate) {
      const start = new Date(offer.startDate);
      if (now < start) return false;
    }

    if (offer.endDate) {
      const end = new Date(offer.endDate);
      if (now > end) return false;
    }

    return true;
  }

  getCard(cardId: string): any | undefined {
    return GEN1_RAW.find(c => c.id === cardId);
  }

  canPurchase(offer: ShopOffer): { can: boolean; reason?: string } {
    const collection = collectionService.getCollection();

    // Verificar se tem coins suficientes
    if (collection.coins < offer.price) {
      return { can: false, reason: 'Coins insuficientes' };
    }

    // Verificar limite de compras por jogador (padrão: 1)
    const maxPerPlayer = offer.maxPurchasesPerPlayer ?? this.DEFAULT_MAX_PURCHASES_PER_PLAYER;
    if (maxPerPlayer !== undefined) {
      const purchased = this.purchases.get(offer.id) || 0;
      if (purchased >= maxPerPlayer) {
        return { can: false, reason: 'Limite de compras atingido' };
      }
    }

    // Verificar estoque
    if (offer.stock !== undefined && offer.stock <= 0) {
      return { can: false, reason: 'Sem estoque' };
    }

    return { can: true };
  }

  purchaseOffer(offerId: string): { success: boolean; message: string; card?: any } {
    const offer = this.getOffer(offerId);
    
    if (!offer) {
      return { success: false, message: 'Oferta não encontrada ou expirada' };
    }

    const canPurchase = this.canPurchase(offer);
    if (!canPurchase.can) {
      return { success: false, message: canPurchase.reason || 'Não é possível comprar' };
    }

    const card = this.getCard(offer.cardId);
    if (!card) {
      return { success: false, message: 'Carta não encontrada' };
    }

    // Realizar a compra
    const collection = collectionService.getCollection();
    collection.coins -= offer.price;
    collectionService.addCard(card.id);

    // Atualizar contagem de compras
    const currentPurchases = this.purchases.get(offer.id) || 0;
    this.purchases.set(offer.id, currentPurchases + 1);
    this.savePurchases();

    return { 
      success: true, 
      message: `${card.name} adicionado à sua coleção!`,
      card 
    };
  }

  getPurchaseCount(offerId: string): number {
    return this.purchases.get(offerId) || 0;
  }

  // Método para calcular quando a próxima rotação acontece
  getNextRotation(category: string): Date | null {
    const offers = this.getOffersByCategory(category);
    if (offers.length === 0) return null;

    const endDates = offers
      .filter(o => o.endDate)
      .map(o => new Date(o.endDate!))
      .sort((a, b) => a.getTime() - b.getTime());

    return endDates[0] || null;
  }

  // Método para limpar histórico de compras (útil para testes)
  clearPurchaseHistory(): void {
    this.purchases.clear();
    this.savePurchases();
  }
}

export const shopService = new ShopService();

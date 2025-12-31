import React, { useState, useEffect } from 'react';
import { shopService, ShopOffer, ShopCategory } from '../services/shopService';
import { collectionService } from '../services/collectionService';
import { soundService } from '../services/soundService';
import { CardComponent } from './CardComponent';
import { CardType, ElementType } from '../types';

interface ShopViewProps {
  onClose: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('featured');
  const [coins, setCoins] = useState(0);
  const [purchaseAnimation, setPurchaseAnimation] = useState<string | null>(null);
  const [purchaseMessage, setPurchaseMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories = shopService.getCategories();
  const offers = shopService.getOffersByCategory(selectedCategory);

  useEffect(() => {
    updateCoins();
  }, []);

  const updateCoins = () => {
    const collection = collectionService.getCollection();
    setCoins(collection.coins);
  };

  const handlePurchase = (offer: ShopOffer) => {
    soundService.playClick();
    
    const result = shopService.purchaseOffer(offer.id);
    
    if (result.success) {
      soundService.playSummon();
      setPurchaseAnimation(offer.id);
      setPurchaseMessage({ type: 'success', text: result.message });
      updateCoins();
      
      setTimeout(() => {
        setPurchaseAnimation(null);
      }, 1000);
      
      setTimeout(() => {
        setPurchaseMessage(null);
      }, 3000);
    } else {
      setPurchaseMessage({ type: 'error', text: result.message });
      setTimeout(() => {
        setPurchaseMessage(null);
      }, 3000);
    }
  };

  const formatTimeRemaining = (endDate: string): string => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Expirado';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h restantes`;
    return `${hours}h restantes`;
  };

  const renderOfferCard = (offer: ShopOffer) => {
    const card = shopService.getCard(offer.cardId);
    if (!card) return null;

    const canPurchase = shopService.canPurchase(offer);
    const hasDiscount = offer.discount && offer.discount > 0;
    const isAnimating = purchaseAnimation === offer.id;
    
    // Check if player already owns this card
    const collection = collectionService.getCollection();
    const ownedCard = collection.cards.find(c => c.cardId === card.id);
    const alreadyOwned = ownedCard && ownedCard.quantity > 0;

    return (
      <div
        key={offer.id}
        className={`relative bg-slate-800 rounded-2xl border-4 border-slate-700 p-4 transition-all ${
          isAnimating ? 'scale-110 border-yellow-500 shadow-2xl shadow-yellow-500/50' : 'hover:border-slate-600'
        }`}
      >
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 z-10">
            <div className={`px-3 py-1 rounded-full font-black text-white text-sm shadow-lg border-2 border-white ${
              offer.discount! >= 40 
                ? 'bg-gradient-to-r from-red-600 to-orange-600 animate-pulse'
                : 'bg-gradient-to-r from-orange-600 to-yellow-600'
            }`}>
              -{offer.discount}% OFF
            </div>
          </div>
        )}

        {/* Timer Badge */}
        {offer.endDate && (
          <div className="absolute top-2 left-2 z-10">
            <div className="bg-slate-900/90 px-3 py-1 rounded-full text-xs font-bold text-yellow-400 border-2 border-yellow-500/50">
              ⏰ {formatTimeRemaining(offer.endDate)}
            </div>
          </div>
        )}

        {/* Card Preview */}
        <div className="flex justify-center mb-4 mt-8">
          <div className="transform scale-90 pointer-events-none">
            <CardComponent
              card={{
                ...card,
                uniqueId: `shop-${offer.id}`,
                cardType: CardType.POKEMON,
                sacrificeRequired: card.level,
                hasAttacked: false
              }}
              mode="compact"
              isPlayable={false}
            />
          </div>
        </div>

        {/* Card Name */}
        <h3 className="text-xl font-black text-center mb-2">
          {card.name}
          {alreadyOwned && (
            <span className="ml-2 text-xs bg-green-600 px-2 py-1 rounded-full">✓ Possui x{ownedCard?.quantity}</span>
          )}
        </h3>

        {/* Price Section */}
        <div className="bg-slate-900/50 rounded-xl p-3 mb-3">
          {hasDiscount && (
            <div className="text-center text-slate-500 line-through text-sm mb-1">
              💰 {offer.originalPrice}
            </div>
          )}
          <div className="text-center text-2xl font-black text-yellow-400">
            💰 {offer.price}
          </div>
        </div>

        {/* Purchase Button */}
        <button
          onClick={() => handlePurchase(offer)}
          disabled={!canPurchase.can}
          className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
            canPurchase.can
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 hover:scale-105 text-white'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {canPurchase.can ? '🛒 Comprar' : canPurchase.reason}
        </button>

        {/* Additional Info */}
        {offer.maxPurchasesPerPlayer !== undefined && (
          <div className="text-xs text-center mt-2 text-slate-400">
            Compras: {shopService.getPurchaseCount(offer.id)}/{offer.maxPurchasesPerPlayer}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-b from-slate-900 to-slate-900/95 backdrop-blur-sm border-b-4 border-slate-800 p-4 md:p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 md:mb-0">
            <button
              onClick={() => { soundService.playClick(); onClose(); }}
              className="bg-slate-700 px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold hover:bg-slate-600 transition-colors text-sm md:text-base"
            >
              👈 Voltar
            </button>

            <div className="bg-gradient-to-r from-yellow-600 to-amber-600 px-4 py-2 md:px-8 md:py-3 rounded-xl border-2 md:border-4 border-yellow-500 shadow-lg">
              <div className="text-center">
                <div className="text-xs md:text-sm font-bold text-yellow-200">Seus Coins</div>
                <div className="text-xl md:text-3xl font-black text-white">💰 {coins}</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black text-yellow-500 italic mb-1 md:mb-2">🛒 LOJA POKÉCARD</h1>
            <p className="text-slate-400 text-sm md:text-base">Compre cartas exclusivas com seus coins!</p>
          </div>
        </div>
      </div>

      {/* Purchase Notification */}
      {purchaseMessage && (
        <div className="fixed top-32 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div
            className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl border-4 ${
              purchaseMessage.type === 'success'
                ? 'bg-green-600 border-green-400 text-white'
                : 'bg-red-600 border-red-400 text-white'
            }`}
          >
            {purchaseMessage.type === 'success' ? '✅' : '❌'} {purchaseMessage.text}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;
            const categoryOffers = shopService.getOffersByCategory(category.id);
            const hasOffers = categoryOffers.length > 0;

            return (
              <button
                key={category.id}
                onClick={() => {
                  if (hasOffers) {
                    soundService.playClick();
                    setSelectedCategory(category.id);
                  }
                }}
                disabled={!hasOffers}
                className={`relative p-6 rounded-2xl border-4 transition-all ${
                  isSelected
                    ? `bg-gradient-to-br ${category.color} border-white scale-105 shadow-2xl`
                    : hasOffers
                    ? `bg-slate-800 border-slate-700 hover:border-slate-600 hover:scale-102`
                    : 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="text-lg font-black mb-1">{category.name}</h3>
                <p className="text-xs text-slate-300 mb-2">{category.description}</p>
                <div className="text-xs font-bold text-yellow-400">
                  {hasOffers ? `${categoryOffers.length} ofertas` : 'Em breve'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Offers Grid */}
        {offers.length > 0 ? (
          <>
            {/* Category Info */}
            <div className="bg-slate-800/50 rounded-2xl p-6 mb-8 border-2 border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black mb-2">
                    {categories.find(c => c.id === selectedCategory)?.icon}{' '}
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-slate-400">
                    {categories.find(c => c.id === selectedCategory)?.description}
                  </p>
                </div>
                {(selectedCategory === 'weekly' || selectedCategory === 'featured') && (
                  <div className="bg-slate-900 px-6 py-4 rounded-xl border-2 border-yellow-500/50">
                    <div className="text-sm text-slate-400">Ofertas acabam em:</div>
                    <div className="text-xl font-bold text-yellow-400">
                      ⏰ {offers[0]?.endDate ? formatTimeRemaining(offers[0].endDate) : 'Em breve'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offers.map(offer => renderOfferCard(offer))}
            </div>
          </>
        ) : (
          <div className="bg-slate-800 rounded-2xl p-16 text-center border-4 border-dashed border-slate-700">
            <div className="text-8xl mb-6">🔒</div>
            <h3 className="text-3xl font-black text-slate-400 mb-4">Nenhuma oferta disponível</h3>
            <p className="text-slate-500">Volte mais tarde para ver novas ofertas!</p>
          </div>
        )}
      </div>

      {/* Footer Tips */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-6 border-2 border-blue-500/30">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="text-xl font-bold text-blue-300 mb-2">Dicas da Loja</h3>
              <ul className="text-slate-300 space-y-1 text-sm">
                <li>• As ofertas semanais mudam toda segunda-feira!</li>
                <li>• Cartas em destaque têm os melhores descontos</li>
                <li>• Ganhe coins vencendo batalhas e completando conquistas</li>
                <li>• Cartas lendárias são raras - aproveite quando aparecerem!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

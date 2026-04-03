'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

export default function CartSidebar() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, cartTotal } = useCart();

  const checkoutMessage = () => {
    const itemsText = cart.map(item => `• ${item.quantidade}x ${item.nome} (R$ ${item.preco.toFixed(2).replace('.', ',')})`).join('%0A');
    const text = `Olá, gostaria de finalizar a compra dos seguintes itens:%0A%0A${itemsText}%0A%0A*Total Estimado: R$ ${cartTotal.toFixed(2).replace('.', ',')}*`;
    return `https://wa.me/5511953746027?text=${text}`;
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-[#050505]/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#faf9f7] z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <h2 className="text-xl font-serif text-stone-900 uppercase tracking-widest">Carrinho</h2>
          <button onClick={closeCart} className="text-stone-500 hover:text-stone-900 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 space-y-4">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="uppercase tracking-widest text-sm">Seu carrinho está vazio</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-white border border-stone-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                    {item.imagem ? (
                      <img src={item.imagem} alt={item.nome} className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-300 bg-stone-50">S/ IMG</div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-stone-900 line-clamp-2 leading-snug">{item.nome}</h3>
                      <p className="text-xs text-gold-dark mt-1 uppercase tracking-widest">{item.categoria}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded shrink-0">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                          className="px-2 py-1 text-stone-500 hover:bg-stone-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-1 text-sm text-stone-900 w-6 text-center">{item.quantidade}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                          disabled={item.quantidade >= item.estoque}
                          className="px-2 py-1 text-stone-500 hover:bg-stone-100 transition-colors disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-semibold text-stone-900 whitespace-nowrap text-right ml-2 text-sm">
                        R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-stone-400 hover:text-red-500 transition-colors self-start p-1 -mt-1 -mr-1"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-stone-200 p-6 bg-white shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-6">
              <span className="text-stone-500 uppercase tracking-widest text-xs font-bold">Total Estimado</span>
              <span className="text-2xl font-serif text-stone-900">
                R$ {cartTotal.toFixed(2).replace('.', ',')}
              </span>
            </div>
            
            <a 
              href={checkoutMessage()}
              target="_blank"
              rel="noreferrer"
              onClick={closeCart}
              className="w-full py-4 rounded text-sm uppercase tracking-[0.15em] font-bold transition-all transform flex items-center justify-center gap-3 bg-[#050505] text-[#f8f5ee] hover:bg-[#d4af37] hover:scale-[1.02] shadow-xl"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Finalizar no WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
}

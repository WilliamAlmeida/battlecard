import { GoogleGenAI } from "@google/genai";
import { Card } from "../types";

// Note: In a real production app, never expose keys on client side.
// This assumes the environment variable is injected by the bundler/environment.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

interface GameState {
    playerHand: Card[];
    playerField: Card[];
    opponentField: Card[];
    playerHp: number;
    opponentHp: number;
    turn: number;
}

export const getGeminiAdvice = async (gameState: GameState): Promise<string> => {
    if (!apiKey) return "API Key não configurada. Impossível contatar o Guru.";

    const prompt = `
        Você é o Professor Carvalho, um especialista tático em batalhas Pokémon.
        Analise a situação atual do jogo e dê um conselho curto e estratégico (máx 2 frases) para o jogador.
        Fale em Português do Brasil. Seja encorajador.
        
        Situação:
        Turno: ${gameState.turn}
        HP Jogador: ${gameState.playerHp} | HP Oponente: ${gameState.opponentHp}
        
        Minha Mão: ${gameState.playerHand.map(c => `${c.name} (Atk:${c.attack}, Lvl:${c.level})`).join(', ')}
        Meu Campo: ${gameState.playerField.map(c => `${c.name} (Atk:${c.attack})`).join(', ')}
        Campo Oponente: ${gameState.opponentField.map(c => `${c.name} (Atk:${c.attack})`).join(', ')}
        
        Regras: Nível 1 invoca grátis. Nível 2 precisa de 1 sacrifício. Nível 3 precisa de 2. Ataque maior vence.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "Siga seu instinto, treinador!";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "O sinal do Pokégear está fraco... tome sua própria decisão!";
    }
};
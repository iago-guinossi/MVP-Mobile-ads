import { Alert, Platform } from 'react-native';

const MONTHS = {
  janeiro: 'JAN', fevereiro: 'FEV', marco: 'MAR', abril: 'ABR', maio: 'MAI', junho: 'JUN',
  julho: 'JUL', agosto: 'AGO', setembro: 'SET', outubro: 'OUT', novembro: 'NOV', dezembro: 'DEZ',
};

// A API guarda a data como texto livre ("14 a 16 de Agosto 2025"); extrai dia(s) e mês para o selo
export function parseEventDate(text) {
  if (!text) return null;
  const match = text.match(/(\d{1,2})(?:\s*(?:a|-|–)\s*(\d{1,2}))?\s+de\s+([A-Za-zÀ-ú]+)/i);
  if (!match) return null;
  const monthKey = match[3].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const month = MONTHS[monthKey];
  if (!month) return null;
  return { days: match[2] ? `${match[1]}–${match[2]}` : match[1], month };
}

export const normalizeText = (text) =>
  (text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export const matches = (item, query) => {
  const q = normalizeText(query.trim());
  if (!q) return true;
  return [item.name, item.location, item.summary].some((field) => normalizeText(field).includes(q));
};

export const firstImage = (item) => item.images?.[0]?.src || item.image || null;

// Confirmação/aviso que funciona tanto no celular (Alert) quanto na web (window.confirm)
export function confirmAction(title, message, confirmLabel = 'Excluir') {
  if (Platform.OS === 'web') return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  return new Promise((resolve) =>
    Alert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
      { text: confirmLabel, style: 'destructive', onPress: () => resolve(true) },
    ])
  );
}

export function notify(title, message) {
  if (Platform.OS === 'web') window.alert(message ? `${title}\n\n${message}` : title);
  else Alert.alert(title, message);
}

// Mesma regra da API: aceita o HTML do <iframe> do Google Maps (ou só a URL).
// Retorna null quando vazio e undefined quando o texto não é um mapa do Google.
export function extractMapUrl(text) {
  const value = (text || '').trim();
  if (!value) return null;
  const match = value.match(/src\s*=\s*(["'])(.*?)\1/i);
  const url = (match ? match[2] : value).replace(/&amp;/g, '&').trim();
  const isEmbed = /^https:\/\/(www\.google\.com\/maps\/embed|maps\.google\.com\/maps\?.*output=embed)/.test(url);
  return isEmbed ? url : undefined;
}

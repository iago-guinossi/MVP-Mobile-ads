import { Platform } from 'react-native';

// Endereço da API configurável por ambiente (.env → EXPO_PUBLIC_API_URL)
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export const RESOURCES = {
  trilhas: {
    path: '/trilhas',
    label: 'Trilhas',
    singular: 'Trilha',
    icon: 'trail-sign-outline',
    fields: ['name', 'location', 'distance', 'summary'],
    maxImages: 5,
  },
  cachoeiras: {
    path: '/cachoeiras',
    label: 'Cachoeiras',
    singular: 'Cachoeira',
    icon: 'water-outline',
    fields: ['name', 'location', 'summary'],
    maxImages: 5,
  },
  eventos: {
    path: '/eventos',
    label: 'Eventos',
    singular: 'Evento',
    icon: 'calendar-outline',
    fields: ['name', 'location', 'date', 'summary'],
    maxImages: 1,
  },
  temporada: {
    path: '/temporada',
    label: 'Temporada',
    singular: 'Temporada',
    icon: 'sunny-outline',
  },
};

export const FIELD_LABELS = {
  name: 'Nome',
  location: 'Localização',
  distance: 'Distância',
  date: 'Data',
  summary: 'Descrição',
  text: 'Texto',
};

// Limites de upload definidos pela API (src/config/multer.js do backend)
export const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// O AuthContext registra aqui como ler o token e o que fazer quando ele expira
let getToken = () => null;
let onUnauthorized = () => {};
export function configureAuth(options) {
  getToken = options.getToken;
  onUnauthorized = options.onUnauthorized;
}

export const imageUrl = (src) => {
  if (!src) return null;
  return src.startsWith('http') ? src : `${API_URL}${src}`;
};

// Converte os caminhos relativos (/uploads/...) em URLs completas, guardando o original
const normalize = (item) => {
  const result = { ...item };
  if (Array.isArray(item.images)) {
    result.images = item.images.map((img) => ({ ...img, rawSrc: img.src, src: imageUrl(img.src) }));
  }
  if (typeof item.image === 'string') {
    result.rawImage = item.image;
    result.image = imageUrl(item.image);
  }
  return result;
};

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  if (auth) headers.Authorization = `Bearer ${getToken()}`;
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body, signal: controller.signal });
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.', 0);
  } finally {
    clearTimeout(timer);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401 && auth) {
      onUnauthorized();
      throw new ApiError('Sua sessão expirou. Faça login novamente.', 401);
    }
    throw new ApiError(data?.error || `Erro ${res.status} ao falar com o servidor.`, res.status);
  }
  return data;
}

export const login = (email, password) =>
  request('/login', { method: 'POST', body: { email, password } }).catch((err) => {
    if (err.status === 401) throw new ApiError('E-mail ou senha incorretos.', 401);
    throw err;
  });

export const list = (resource) =>
  request(RESOURCES[resource].path).then((items) => items.map(normalize));

export const getOne = (resource, id) =>
  request(`${RESOURCES[resource].path}/${id}`).then(normalize);

export const save = (resource, id, formData) =>
  request(id ? `${RESOURCES[resource].path}/${id}` : RESOURCES[resource].path, {
    method: id ? 'PUT' : 'POST',
    body: formData,
    auth: true,
  });

export const remove = (resource, id) =>
  request(`${RESOURCES[resource].path}/${id}`, { method: 'DELETE', auth: true });

// Anexa uma foto escolhida no ImagePicker ao FormData (web usa Blob, nativo usa {uri,name,type})
export async function appendImage(formData, field, asset) {
  const type = asset.mimeType || 'image/jpeg';
  const ext = type.split('/')[1] === 'jpg' ? 'jpeg' : type.split('/')[1];
  const hasExt = /\.(jpe?g|png|webp)$/i.test(asset.fileName || '');
  const name = hasExt ? asset.fileName : `foto-${Date.now()}.${ext}`;

  if (Platform.OS === 'web') {
    const blob = await (await fetch(asset.uri)).blob();
    formData.append(field, blob, name);
  } else {
    formData.append(field, { uri: asset.uri, name, type });
  }
}

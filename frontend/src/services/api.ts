const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Types
export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface Location {
  address?: string;
  geo: GeoPoint;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  customerId: string;
  pickup: Location;
  dropoff: Location;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'wallet';
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled';
  driverId?: string;
  declinedBy?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  _id: string;
  name: string;
  phone?: string;
  vehicle?: string;
  isAvailable: boolean;
  location: GeoPoint;
  lastOnlineAt: string;
}

export interface CreateOrderRequest {
  customerId: string;
  pickup: Location;
  dropoff: Location;
  items?: OrderItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'wallet';
}

export interface CreateOrderResponse {
  order: Order;
  nearbyDrivers: Driver[];
}

export interface UpdateDriverLocationRequest {
  driverId?: string;
  name?: string;
  phone?: string;
  vehicle?: string;
  isAvailable?: boolean;
  location: {
    coordinates: [number, number];
  };
}

// API Functions
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Order API
export const orderAPI = {
  create: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    return apiRequest<CreateOrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById: async (orderId: string): Promise<Order> => {
    return apiRequest<Order>(`/orders/${orderId}`);
  },

  getHistory: async (customerId: string): Promise<Order[]> => {
    return apiRequest<Order[]>(`/orders?customerId=${encodeURIComponent(customerId)}`);
  },

  updateStatus: async (
    orderId: string,
    status: 'picked_up' | 'delivered' | 'cancelled'
  ): Promise<Order> => {
    return apiRequest<Order>(`/orders/${orderId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },
};

// Driver API
export const driverAPI = {
  updateLocation: async (
    data: UpdateDriverLocationRequest
  ): Promise<Driver> => {
    return apiRequest<Driver>('/drivers/location', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getNearbyOrders: async (
    driverId: string,
    maxDistance?: number
  ): Promise<Order[]> => {
    const params = new URLSearchParams();
    if (maxDistance) params.set('maxDistance', maxDistance.toString());
    const query = params.toString();
    return apiRequest<Order[]>(
      `/drivers/${driverId}/nearby-orders${query ? `?${query}` : ''}`
    );
  },

  acceptOrder: async (
    driverId: string,
    orderId: string
  ): Promise<Order> => {
    return apiRequest<Order>(
      `/drivers/${driverId}/orders/${orderId}/accept`,
      {
        method: 'POST',
      }
    );
  },

  rejectOrder: async (
    driverId: string,
    orderId: string
  ): Promise<Order> => {
    return apiRequest<Order>(
      `/drivers/${driverId}/orders/${orderId}/reject`,
      {
        method: 'POST',
      }
    );
  },
};


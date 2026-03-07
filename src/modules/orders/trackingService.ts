import api from '../../services/api';

export interface TrackingActivity {
  date: string;
  activity: string;
  location: string;
}

export interface TrackingInfo {
  orderId: number;
  orderStatus: string;
  deliveryStatus: string;
  awbCode: string;
  courierName: string;
  currentStatus: string;
  currentLocation: string;
  estimatedDelivery: string;
  trackingUrl: string;
  trackingActivities: TrackingActivity[];
  success: boolean;
  message?: string;
}

export interface ShipmentInfo {
  shipmentId: string;
  awbCode: string;
  courierName: string;
  trackingStatus: string;
  deliveryStatus: string;
  estimatedDelivery: string;
}

const getErrorMessage = (error: unknown, defaultMsg: string): string => {
  const err = error as { response?: { data?: { message?: string } }; message?: string };
  return err.response?.data?.message || err.message || defaultMsg;
};

export const trackingService = {
  /**
   * Get tracking information for an order
   */
  async getOrderTracking(orderId: string | number): Promise<TrackingInfo> {
    try {
      const response = await api.get<{ data: TrackingInfo }>(`/v1/orders/${orderId}/tracking`);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch tracking information'));
    }
  },

  /**
   * Get order details by ID
   */
  async getOrderById(orderId: string | number): Promise<{
    id: number;
    status: string;
    productName: string;
    productImage: string;
    quantity: number;
    totalPrice: number;
    createdAt: string;
    userName: string;
    userEmail: string;
    shipmentId: string | null;
    awbCode: string | null;
    courierName: string | null;
    trackingStatus: string | null;
    deliveryStatus: string | null;
    estimatedDelivery: string | null;
    adminCommission: number;
    farmerAmount: number;
    farmerId: number;
    farmerName: string;
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingPincode: string;
  }> {
    try {
      const response = await api.get(`/v1/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to fetch order details'));
    }
  },

  /**
   * Create shipment for an order
   */
  async createShipment(orderId: string | number): Promise<ShipmentInfo> {
    try {
      const response = await api.post<{ data: ShipmentInfo }>(`/v1/orders/${orderId}/create-shipment`);
      return response.data.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Failed to create shipment'));
    }
  },
};

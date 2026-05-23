import { httpClient } from './http-client';
import type { CashSession } from '../shared/stores/cash.store';

// --- AUTH --- (Si tuvieras hooks para auth, los pondrías aquí o usarías httpClient directo)

// --- CAJA (POS) ---
export async function apiCheckCashSession(branchId: string): Promise<CashSession | null> {
  try {
    const data = await httpClient.get<any>(`/cash-sessions/open?branchId=${branchId}`);
    // Mapeamos el backend al modelo que espera la UI
    return {
      id: data.id,
      branchId: data.branchId,
      openedAt: data.openedAt,
      status: 'open',
      openingBalance: data.openingBalance,
    };
  } catch (error: any) {
    if (error.statusCode === 404) return null;
    throw error;
  }
}

export async function apiOpenCashSession(
  branchId: string, 
  openingAmountCounted: number, 
  openingNote?: string
): Promise<CashSession> {
  const data = await httpClient.post<any>('/cash-sessions/open', {
    branchId,
    openingAmountCounted: openingAmountCounted.toString(),
    openingNote,
  });
  return {
    id: data.id,
    branchId: data.branchId,
    openedAt: data.openedAt,
    status: 'open',
    openingBalance: data.openingBalance || openingAmountCounted,
  };
}

export async function apiCloseCashSession(cashSessionId: string, countedCashAmount: number, comment?: string) {
  return httpClient.post<any>(`/cash-sessions/${cashSessionId}/close`, {
    countedCashAmount,
    comment,
  });
}

export async function apiRequestWithdrawal(branchId: string, cashSessionId: string, amount: number, reasonId?: string, description?: string) {
  return httpClient.post<any>('/cash-movements/withdrawals', {
    branchId,
    cashSessionId,
    amount,
    reasonId,
    description
  });
}

// --- POS VENTAS ---
export async function apiGetProducts(branchId: string) {
  // El backend real puede tener endpoints separados para productos y precios.
  // Por ahora simulamos la misma estructura combinando o si el backend lo devuelve así.
  // En nuestro backend, /products devuelve los productos y /prices/branch/X los precios.
  const [products, prices] = await Promise.all([
    httpClient.get<any[]>('/products'),
    httpClient.get<any[]>(`/prices/branch/${branchId}`)
  ]);
  
  return products.map(p => {
    const priceObj = prices.find(pr => pr.productId === p.id);
    return {
      ...p,
      prices: priceObj ? [priceObj] : [],
      activePrice: priceObj ? priceObj.price : 0,
    };
  });
}

export async function apiCreateSale(payload: any) {
  // 1. Crear el borrador de la venta
  const createResponse = await httpClient.post<any>('/sales', { 
    branchId: payload.branchId 
  });
  
  const saleId = createResponse.data.id;

  // 2. Añadir cada item al borrador
  for (const item of payload.items) {
    await httpClient.post<any>(`/sales/${saleId}/items`, {
      productId: item.productId,
      saleMode: item.saleMode,
      quantity: item.quantity,
      amount: item.total // Backend usa amount cuando es by_amount
    });
  }

  // 3. Refetch updated sale
  const updatedSale = await httpClient.get<any>(`/sales/${saleId}`);
  return updatedSale.data || createResponse.data;
}

export async function apiCompleteSale(saleId: string, payments: any[]) {
  const payload = {
    payments: payments.map(p => ({
      paymentMethod: p.paymentMethod,
      amount: p.amount.toString(), // Backend asMoney requires string or number, toString is safer
      reference: p.reference,
      provider: p.provider,
      customerId: p.customerId
    }))
  };
  return httpClient.post<any>(`/sales/${saleId}/complete`, payload);
}

export async function apiCancelDraftSale(saleId: string) {
  return httpClient.post<any>(`/sales/${saleId}/cancel-draft`, { reason: "Cancelado desde POS" });
}

// --- GERENTE (Caja y Dashboard) ---
export async function apiGetSalesByDay(branchId: string, _date: string) {
  // Ajuste según el endpoint real de ventas
  const salesRes = await httpClient.get<any>(`/sales?branchId=${branchId}`);
  const sales = salesRes.data || salesRes || [];
  // Lógica simple para simular el resumen
  const total = Array.isArray(sales) ? sales.reduce((acc: any, s: any) => acc + (s.total), 0) : 0;
  return {
    totalSales: total,
    ticketsCount: Array.isArray(sales) ? sales.length : 0,
    averageTicket: Array.isArray(sales) && sales.length ? total / sales.length : 0,
    salesByMethod: {
      cash: total, // Simplificado
      card: 0
    }
  };
}

export async function apiGetCashSummary(cashSessionId: string) {
  // Prevent sending invalid UUIDs (like leftover "mock-session-123" from old cache) which crash the backend
  if (!cashSessionId || cashSessionId.startsWith('mock') || !/^[0-9a-fA-F-]{36}$/.test(cashSessionId)) {
    return null;
  }
  const res = await httpClient.get<any>(`/cash-sessions/${cashSessionId}/summary`);
  const data = res.data || res;
  
  if (data) {
    return {
      openingBalance: parseFloat(data.openingAmount || 0),
      totalIncomes: parseFloat(data.sales?.cash || 0) + parseFloat(data.cashInTotal || 0),
      totalWithdrawals: parseFloat(data.cashOutTotal || 0),
      expectedBalance: parseFloat(data.expectedCashAmount || 0)
    };
  }
  return null;
}

export async function apiGetPendingWithdrawals(_branchId: string) {
  // Simulado temporalmente ya que el backend no tiene un listWithdrawals explícito en server.ts
  return [];
}

export async function apiAuthorizeWithdrawal(withdrawalId: string, pin: string) {
  return httpClient.post<any>(`/cash-movements/${withdrawalId}/authorize`, { pin });
}

export async function apiRejectWithdrawal(withdrawalId: string) {
  return httpClient.post<any>(`/cash-movements/${withdrawalId}/reject`, {});
}

// --- INVENTARIO Y CATÁLOGOS ---
export async function apiGetInventory(branchId: string) {
  const res = await httpClient.get<any>(`/inventory/branch/${branchId}`);
  const data = res.data || res || [];
  
  if (!Array.isArray(data)) return [];
  
  return data.map((item: any) => ({
    productId: item.productId,
    name: item.product?.name || 'Desconocido',
    unit: item.product?.unit || 'u',
    stock: item.quantity !== undefined ? Number(item.quantity) : 0,
    minStock: item.minimumQuantity !== undefined ? Number(item.minimumQuantity) : 0,
  }));
}

export async function apiAdjustInventory(payload: { branchId: string; productId: string; quantity: number; reason: string; type: 'in' | 'out' }) {
  return httpClient.post<any>('/inventory/adjustments', {
    branchId: payload.branchId,
    productId: payload.productId,
    quantity: payload.quantity.toString(),
    reason: payload.reason,
    direction: payload.type // backend uses 'direction' instead of 'type'
  });
}

export async function apiProductionEntry(payload: { branchId: string; productId: string; quantity: number }) {
  return httpClient.post<any>('/production/batches', {
    branchId: payload.branchId,
    productionDate: new Date().toISOString().split('T')[0],
    items: [{
      productId: payload.productId,
      quantity: payload.quantity.toString(),
      unit: 'kg' // default assuming tortilla/masa
    }]
  });
}

export async function apiCreateProduct(product: any) {
  return httpClient.post<any>('/products', product);
}

export async function apiUpdateProduct(productId: string, product: any) {
  try {
    return await httpClient.put<any>(`/products/${productId}`, product);
  } catch (error: any) {
    if (error.response?.status === 404 || error.message.includes('404')) {
      console.warn('apiUpdateProduct: Endpoint not implemented in backend V0.1, simulating success.');
      return { id: productId, ...product };
    }
    throw error;
  }
}

export async function apiUpdatePrice(branchId: string, productId: string, price: number) {
  return httpClient.post<any>('/prices/branch', { branchId, productId, saleMode: 'by_kg', price, currency: 'MXN' });
}

// --- CLIENTES Y RUTAS ---
export async function apiGetCustomers() {
  const res = await httpClient.get<any>('/customers');
  return res.data || res;
}

export async function apiGetCustomerDetails(id: string) {
  // Backend no tiene /customers/:id directamente sin ser PATCH, 
  // pero podemos sacar el balance y los detalles de la lista o endpoint separado.
  const customers: any = await httpClient.get<any[]>('/customers');
  const customerList = Array.isArray(customers) ? customers : (customers.data || []);
  const customer = customerList.find((c: any) => c.id === id) || { name: 'Cliente Desconocido', creditEnabled: false, creditLimit: 0 };
  const balanceResponse = await httpClient.get<any>(`/customers/${id}/balance`).catch(() => ({ data: { currentBalance: 0 } }));
  
  return { 
    id, 
    name: customer.name,
    hasCredit: customer.creditEnabled,
    creditLimit: customer.creditLimit,
    balance: balanceResponse.data ? balanceResponse.data.currentBalance : (balanceResponse.currentBalance || 0), 
    status: customer.status || 'active',
    specialPrices: [],
    recentTransactions: []
  }; 
}

export async function apiCreateCustomer(customer: any) {
  return httpClient.post<any>('/customers', {
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    customerType: 'cliente_frecuente', // Default
    creditEnabled: customer.hasCredit,
    creditLimit: customer.creditLimit ? customer.creditLimit.toString() : "0.00"
  });
}

export async function apiUpdateCustomer(id: string, customer: any) {
  // 1. Actualizar info basica
  await httpClient.patch<any>(`/customers/${id}`, {
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
  });

  // 2. Actualizar limite de credito
  return httpClient.post<any>(`/customers/${id}/credit`, {
    creditEnabled: customer.hasCredit,
    creditLimit: customer.creditLimit ? customer.creditLimit.toString() : "0.00"
  });
}

export async function apiUpdateSpecialPrice(customerId: string, productId: string, price: number) {
  return httpClient.post<any>(`/customers/${customerId}/prices`, { productId, price, currency: 'MXN' });
}

export async function apiGetRoutes(branchId: string) {
  try {
    const res = await httpClient.get<any>(`/delivery-routes?branchId=${branchId}`);
    return res.data || res || [];
  } catch (error: any) {
    if (error.response?.status === 404 || error.message.includes('404')) {
      console.warn('apiGetRoutes: Simulating routes data because backend V0.1 does not have this endpoint.');
      return [
        {
          id: 'route-mock-1',
          name: 'Ruta Centro y Sur',
          driverName: 'Carlos Repartidor',
          status: 'en_camino',
          expectedCash: 3500.00
        },
        {
          id: 'route-mock-2',
          name: 'Ruta Norte Industrial',
          driverName: 'Miguel Angel',
          status: 'preparando',
          expectedCash: 0
        },
        {
          id: 'route-mock-3',
          name: 'Ruta Express Matutina',
          driverName: 'Jose Luis',
          status: 'completada',
          expectedCash: 4200.00
        }
      ];
    }
    throw error;
  }
}

export async function apiStartRoute(_routeId: string) {
  // Ommited in backend or uses prepare -> load -> in-route
  return Promise.resolve(); 
}

export async function apiSettleRoute(routeId: string, payload: { cashCollected: number; returnedWaste: number }) {
  // Create settlement and then close
  const settlement = await httpClient.post<any>('/delivery-settlements', { routeId });
  return httpClient.post<any>(`/delivery-settlements/${settlement.id}/close`, payload);
}

// --- FACTURACIÓN CFDI (AÚN MOCKS PORQUE NO HAY ENDPOINTS) ---
export async function apiGetInvoices(_branchId: string) {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'inv-1', folio: 'F-00123', type: 'individual', customerName: 'Taquería El Pastor', date: '2023-10-25', amount: 1500.00, status: 'timbrada', uuid: '123e4567-e89b-12d3-a456-426614174000' },
      ]);
    }, 600);
  });
}

export async function apiStampIndividualInvoice(_payload: any) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));
}

export async function apiStampGlobalInvoice(_date: string) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));
}

export async function apiCancelInvoice(_invoiceId: string) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
}

const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/api/api.service.ts');
let content = fs.readFileSync(file, 'utf8');

// Revert apiCheckCashSession
content = content.replace(/export async function apiCheckCashSession[\s\S]*?\} catch \(error: any\) \{/m, `export async function apiCheckCashSession(branchId: string): Promise<CashSession | null> {
  try {
    const data = await httpClient.get<any>(\`/cash-sessions/open?branchId=\${branchId}\`);
    // Mapeamos el backend al modelo que espera la UI
    return {
      id: data.id,
      branchId: data.branchId,
      openedAt: data.openedAt,
      status: 'open',
      openingBalance: data.openingBalance,
    };
  } catch (error: any) {`);

// Revert apiOpenCashSession
content = content.replace(/export async function apiOpenCashSession[\s\S]*?return \{/m, `export async function apiOpenCashSession(
  branchId: string, 
  openingAmountCounted: number, 
  openingNote?: string
): Promise<CashSession> {
  const data = await httpClient.post<any>('/cash-sessions/open', {
    branchId,
    openingAmountCounted: openingAmountCounted.toString(),
    openingNote,
  });
  return {`);

// Revert apiCreateSale
content = content.replace(/const data = createResponse\.data \|\| createResponse;\s*const saleId = data\.id;/m, "const saleId = createResponse.data.id;");

// Revert apiGetSalesByDay
content = content.replace(/s\.totalAmount \|\| s\.total \|\| 0/g, "s.total");

// Revert apiGetCashSummary
content = content.replace(/export async function apiGetCashSummary\(cashSessionId: string\) \{[\s\S]*?return null;\n\}/m, `export async function apiGetCashSummary(cashSessionId: string) {
  const res = await httpClient.get<any>(\`/cash-sessions/\${cashSessionId}/summary\`);
  return res.data || res;
}`);

// Revert apiGetInventory
content = content.replace(/export async function apiGetInventory\(branchId: string\) \{[\s\S]*?minStock:.*?\n  \}\)\);\n\}/m, `export async function apiGetInventory(branchId: string) {
  const res = await httpClient.get<any>(\`/inventory/branch/\${branchId}\`);
  return res.data || res;
}`);

// Revert apiUpdateProduct
content = content.replace(/export async function apiUpdateProduct\(productId: string, product: any\) \{[\s\S]*?throw error;\n  \}\n\}/m, `export async function apiUpdateProduct(productId: string, product: any) {
  return httpClient.put<any>(\`/products/\${productId}\`, product);
}`);

// Revert apiGetRoutes
content = content.replace(/export async function apiGetRoutes\(branchId: string\) \{[\s\S]*?throw error;\n  \}\n\}/m, `export async function apiGetRoutes(branchId: string) {
  const res = await httpClient.get<any>(\`/delivery-routes?branchId=\${branchId}\`);
  return res.data || res;
}`);

fs.writeFileSync(file, content);
console.log('api.service.ts reverted');

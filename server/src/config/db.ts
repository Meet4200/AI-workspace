import { PrismaClient } from '@prisma/client';
import MockStore from './mockStore.js';

const realPrisma = new PrismaClient();

function isConnectionError(err: any) {
  const msg = err.message || '';
  return msg.includes("Can't reach database server") || 
         msg.includes("InitializationError") || 
         err.code === 'P1001' || 
         err.code === 'P1003' || 
         err.code === 'P1012';
}

const mockPrisma = new Proxy(realPrisma, {
  get(target, prop: string, receiver) {
    const modelName = prop;
    const isModel = typeof (target as any)[modelName] === 'object' && (target as any)[modelName] !== null;

    if (isModel) {
      return new Proxy((target as any)[modelName], {
        get(modelTarget, method: string) {
          if (typeof (modelTarget as any)[method] !== 'function') {
            return Reflect.get(modelTarget, method);
          }
          return async function (...args: any[]) {
            try {
              return await (modelTarget as any)[method](...args);
            } catch (err: any) {
              if (isConnectionError(err)) {
                console.warn(`[Prisma Offline Mode] Database unreachable. Falling back to MockStore for: ${modelName}.${method}`);
                return handleMockQuery(modelName, method, args[0]);
              }
              throw err;
            }
          };
        }
      });
    }

    return Reflect.get(target, prop, receiver);
  }
});

function handleMockQuery(model: string, method: string, queryOptions: any = {}) {
  let storeName = model;
  
  // Normalization
  if (model === 'coverLetter') storeName = 'coverLetters';
  else if (model === 'pdfDocument' || model === 'document') storeName = 'pdfDocuments';
  else if (model === 'chat') storeName = 'pdfChats';
  else if (model === 'interviewHistory') storeName = 'interviews';
  else if (model === 'payment') storeName = 'payments';
  else if (model === 'user') storeName = 'users';
  else if (model.endsWith('s')) storeName = model;
  else storeName = model + 's';

  const list = (MockStore as any)[storeName] || [];

  if (method === 'findMany') {
    const where = queryOptions.where || {};
    return list.filter((item: any) => matchesWhere(item, where));
  }

  if (method === 'findFirst' || method === 'findUnique') {
    const where = queryOptions.where || {};
    return list.find((item: any) => matchesWhere(item, where)) || null;
  }

  if (method === 'create') {
    const data = queryOptions.data || {};
    const newItem = {
      id: data.id || `mock-${model}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    list.push(newItem);
    return newItem;
  }

  if (method === 'update') {
    const where = queryOptions.where || {};
    const data = queryOptions.data || {};
    const index = list.findIndex((item: any) => matchesWhere(item, where));
    if (index !== -1) {
      list[index] = {
        ...list[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      return list[index];
    }
    return null;
  }

  if (method === 'delete') {
    const where = queryOptions.where || {};
    const index = list.findIndex((item: any) => matchesWhere(item, where));
    if (index !== -1) {
      const removed = list.splice(index, 1);
      return removed[0];
    }
    return null;
  }

  if (method === 'count') {
    const where = queryOptions.where || {};
    return list.filter((item: any) => matchesWhere(item, where)).length;
  }

  if (method === 'groupBy') {
    // Return empty list or basic aggregates for stats
    return [];
  }

  return null;
}

function matchesWhere(item: any, where: any): boolean {
  if (!where) return true;
  for (const key of Object.keys(where)) {
    const val = where[key];
    if (typeof val === 'object' && val !== null) {
      if ('equals' in val && item[key] !== val.equals) return false;
      if ('contains' in val && !String(item[key]).toLowerCase().includes(String(val.contains).toLowerCase())) return false;
    } else {
      if (item[key] !== val) return false;
    }
  }
  return true;
}

export default mockPrisma;
export { realPrisma as prismaClient };

import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

interface Item {
  id: string;
  name: string;
  price: number;
}

const items: Item[] = [
  { id: '1', name: 'TypeScript in Action', price: 29.99 },
  { id: '2', name: 'AWS for Humans', price: 34.99 },
  { id: '3', name: 'React Patterns', price: 24.99 },
];

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const method = event.requestContext.http.method;

  if (method === 'GET') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    };
  }

  if (method === 'POST') {
    let body: { name?: string; price?: number };

    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid JSON in request body' }),
      };
    }

    if (!body.name || typeof body.price !== 'number') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Missing required fields: name (string), price (number)',
        }),
      };
    }

    const newItem: Item = {
      id: crypto.randomUUID(),
      name: body.name,
      price: body.price,
    };

    items.push(newItem);

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    };
  }

  return {
    statusCode: 405,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};

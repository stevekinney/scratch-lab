import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

interface GreetingResponse {
  greeting: string;
  timestamp: string;
}

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const name = event.queryStringParameters?.name ?? 'World';

  const response: GreetingResponse = {
    greeting: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
  };

  console.log('Greeting request:', { name, timestamp: response.timestamp });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response),
  };
};

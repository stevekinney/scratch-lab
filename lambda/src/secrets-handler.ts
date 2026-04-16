import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const ssm = new SSMClient({});

let apiKey: string | undefined;

const loadConfig = async () => {
  if (apiKey) return;

  const response = await ssm.send(
    new GetParameterCommand({
      Name: '/my-frontend-app/production/third-party-api-key',
      WithDecryption: true,
    }),
  );

  apiKey = response.Parameter?.Value;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  await loadConfig();

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to load API key from Parameter Store' }),
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Secret loaded successfully from Parameter Store',
      keyPrefix: apiKey.slice(0, 7),
    }),
  };
};

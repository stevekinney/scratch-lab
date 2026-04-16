import type { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const TABLE_NAME = 'scratch-lab-notes';
const SEARCH_API_KEY_PARAM = '/scratch-lab/production/search-api-key';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ssm = new SSMClient({});

let searchApiKey: string | undefined;

const loadSearchApiKey = async (): Promise<string> => {
  if (searchApiKey) return searchApiKey;
  const response = await ssm.send(
    new GetParameterCommand({ Name: SEARCH_API_KEY_PARAM, WithDecryption: true }),
  );
  const value = response.Parameter?.Value;
  if (!value) throw new Error('search api key is empty');
  console.log('loaded search api key');
  searchApiKey = value;
  return value;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://example.com',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'content-type,x-notepad-user-id',
};

const json = (statusCode: number, body: unknown): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', ...corsHeaders },
  body: JSON.stringify(body),
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  await loadSearchApiKey();

  const userId = event.headers['x-notepad-user-id'];
  if (!userId) return json(401, { error: 'missing x-notepad-user-id header' });

  const method = event.requestContext.http.method;
  const routeKey = event.routeKey;
  const noteId = event.pathParameters?.noteId;

  try {
    if (method === 'GET' && routeKey === 'GET /notes') {
      const result = await ddb.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: 'userId = :u',
          ExpressionAttributeValues: { ':u': userId },
        }),
      );
      return json(200, result.Items ?? []);
    }

    if (method === 'POST' && routeKey === 'POST /notes') {
      const body = event.body ? JSON.parse(event.body) : {};
      const now = new Date().toISOString();
      const note = {
        userId,
        noteId: body.id,
        title: body.title ?? '',
        body: body.body ?? '',
        createdAt: body.createdAt ?? now,
        updatedAt: body.updatedAt ?? now,
      };
      await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: note }));
      return json(201, {
        id: note.noteId,
        title: note.title,
        body: note.body,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      });
    }

    if (method === 'GET' && routeKey === 'GET /notes/{noteId}' && noteId) {
      const result = await ddb.send(
        new GetCommand({ TableName: TABLE_NAME, Key: { userId, noteId } }),
      );
      if (!result.Item) return json(404, { error: 'note not found' });
      const item = result.Item;
      return json(200, {
        id: item.noteId,
        title: item.title,
        body: item.body,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      });
    }

    if (method === 'PUT' && routeKey === 'PUT /notes/{noteId}' && noteId) {
      const body = event.body ? JSON.parse(event.body) : {};
      const now = new Date().toISOString();
      const note = {
        userId,
        noteId,
        title: body.title ?? '',
        body: body.body ?? '',
        createdAt: body.createdAt ?? now,
        updatedAt: now,
      };
      await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: note }));
      return json(200, {
        id: note.noteId,
        title: note.title,
        body: note.body,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      });
    }

    if (method === 'DELETE' && routeKey === 'DELETE /notes/{noteId}' && noteId) {
      await ddb.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { userId, noteId } }));
      return json(204, {});
    }

    return json(404, { error: 'route not found' });
  } catch (error) {
    console.error('handler error', { error, awsRequestId: event.requestContext.requestId });
    return json(500, { error: 'internal server error' });
  }
};

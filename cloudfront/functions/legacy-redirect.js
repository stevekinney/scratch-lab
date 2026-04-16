function handler(event) {
  var request = event.request;

  if (request.uri === '/old-path') {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: { value: '/new-path' },
      },
    };
  }

  return request;
}

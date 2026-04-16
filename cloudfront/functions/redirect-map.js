var redirects = {
  '/old-path': '/new-path',
  '/blog/old-post': '/blog/new-post',
  '/docs/v1': '/docs',
  '/legacy': '/',
};

function handler(event) {
  var request = event.request;
  var target = redirects[request.uri];

  if (target) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: { value: target },
      },
    };
  }

  return request;
}

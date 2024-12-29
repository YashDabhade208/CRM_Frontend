var request = require("request");

var options = { method: 'POST',
  url: 'https://dev-btad0jdv6jenv1st.us.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  body: '{"client_id":"l1DaGIBPzMzSXqjzSaPmPjx7VPCcZaz0","client_secret":"VtRk6gt_WoCnDA32yQWTpDZPYJBOgKM94jBYJPovG7yknKXi5OyELQ9nMvZdROyf","audience":"https://dev-btad0jdv6jenv1st.us.auth0.com/api/v2/","grant_type":"client_credentials"}' };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
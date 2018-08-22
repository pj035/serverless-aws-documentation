'use strict';

let serverless = undefined;

/**
 * Extracts the RestApiId.
 * If a shared API Gateway is defined, then its id should be used.
 * As a fallback the Ref value of the ApiGatewayRestApi is used.
 * 
 * see https://serverless.com/framework/docs/providers/aws/events/apigateway/#share-api-gateway-and-api-resources
 * 
 * @returns {string | { Ref: 'ApiGatewayRestApi' }}
 */
function getRestApiId() {
  if (serverless) {
    const apiGateway = serverless.service.provider.apiGateway;
    if (apiGateway && apiGateway.restApiId) { // shared API Gateway
      return apiGateway.restApiId;
    }
  }

  // fallback: new API Gateway
  return {
    Ref: 'ApiGatewayRestApi'
  };
}

module.exports = {
  setServerless: (_serverless) => serverless = _serverless,
  getRestApiId,
}
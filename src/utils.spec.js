describe('ServerlessAWSDocumentation.Utils', () => {
  const utils = require('./utils');

  beforeEach(function () {
    this.serverlessMock = {
      providers: {
        aws: {
          request: jasmine.createSpy('aws request'),
          naming: jasmine.createSpyObj(['getStackName', 'getMethodLogicalId', 'normalizePath']),
          getCredentials: jasmine.createSpy('aws get credentials'),
        },
      },
      service: {
        _functions: {},
        _functionNames: [],
        provider: {
          compiledCloudFormationTemplate: {
            Resources: {
              ExistingResource: {
                with: 'configuration',
              },
            },
            Outputs: {},
          }
        },
        getFunction: jasmine.createSpy('getFunction').and.callFake((functionName) => {
          return this.serverlessMock.service._functions[functionName];
        }),
        getAllFunctions: jasmine.createSpy('getAllFunctions').and.callFake(() => {
          return this.serverlessMock.service._functionNames;
        }),
      },
      variables: {
        service: {
          custom: {
            documentation: {
              version: '1',
              models: [{
                name: 'TestModel',
                contentType: 'application/json',
                schema: 'some complex schema',
                description: 'the test model schema',
              }, {
                name: 'OtherModel',
                contentType: 'application/json',
                schema: 'some even more complex schema',
                description: 'the other test model schema',
              }],
            },
          }
        }
      },
    };

    this.serverlessMock.providers.aws.naming.getMethodLogicalId.and.callFake((resourcename, method) => {
      return `${resourcename}_${method}`;
    });

    this.serverlessMock.providers.aws.naming.normalizePath.and.callFake((path) => {
      return path.replace(/\//g, '');
    });
  });

  describe('getRestApiId()', function () {
    it('should return the fallback RestApiId if no serverless object is provided', function () {
      const restApiId = utils.getRestApiId();
      expect(restApiId).toEqual({ Ref: 'ApiGatewayRestApi' });
    });

    it('should return the fallback RestApiId if no shared API Gateway is defined', function () {
      utils.setServerless(this.serverlessMock);
      const restApiId = utils.getRestApiId();
      expect(restApiId).toEqual({ Ref: 'ApiGatewayRestApi' });
    });

    it('should return the shared API Gateway reference', function () {
      Object.assign(this.serverlessMock.service.provider, {
        apiGateway: {
          restApiId: 'abcdef1234'
        },
      });
      utils.setServerless(this.serverlessMock);
      const restApiId = utils.getRestApiId();
      expect(restApiId).toEqual('abcdef1234');
    });
  });
});
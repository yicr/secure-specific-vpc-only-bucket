import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { SecureSpecificVpcOnlyBucket } from '../src';

describe('SecureSpecificVpcOnlyBucket Testing', () => {

  const app = new App();
  const stack = new Stack(app, 'TestingStack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });

  const vpcEndpointId = '';

  const bucket = new SecureSpecificVpcOnlyBucket(stack, 'SecureSpecificVpcOnlyBucket', {
    vpcEndpointId,
  });

  it('Is Bucket', () => {
    expect(bucket).toBeInstanceOf(s3.Bucket);
  });

  const template = Template.fromStack(stack);

  it('Should have encrypted by aws kms', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: Match.objectEquals({
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'aws:kms',
            },
          },
        ],
      }),
    });
  });

  it('Should have access to specific VPCE only bucket policy', () => {
    template.hasResourceProperties('AWS::S3::BucketPolicy', {
      Bucket: {
        Ref: Match.stringLikeRegexp('SecureSpecificVpcOnlyBucket'),
      },
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: Match.arrayWith([
          Match.objectEquals({
            Action: 's3:*',
            Effect: 'Deny',
            Principal: {
              AWS: '*',
            },
            Resource: [
              {
                'Fn::GetAtt': [
                  Match.stringLikeRegexp('SecureSpecificVpcOnlyBucket'),
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        Match.stringLikeRegexp('SecureSpecificVpcOnlyBucket'),
                        'Arn',
                      ],
                    },
                    '/*',
                  ],
                ],
              },
            ],
            Condition: {
              StringNotEquals: {
                'aws:SourceVpc': vpcEndpointId,
              },
            },
          }),
        ]),
      },
    });
  });

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot('default-secure-bucket');
  });

});
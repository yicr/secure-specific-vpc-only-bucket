import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.65.0',
  defaultReleaseBranch: 'main',
  name: '@yicr/secure-specific-vpc-only-bucket',
  description: 'Access to specific VPC Endpoint only Bucket',
  keywords: ['aws', 'cdk', 'aws-cdk', 's3', 'bucket', 'vpc', 'endpoint', 'vpce'],
  projenrcTs: true,
  repositoryUrl: 'https://github.com/yicr/secure-specific-vpc-only-bucket.git',
  npmAccess: javascript.NpmAccess.PUBLIC,
  deps: [
    '@yicr/secure-bucket',
  ],
  peerDeps: [
    '@yicr/secure-bucket',
  ],
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['0 18 * * *']),
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
});
project.synth();
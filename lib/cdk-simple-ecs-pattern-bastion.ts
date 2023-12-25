import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2'


export class CdkSimpleEcsPatternBastionStack extends cdk.Stack {
  
  constructor(scope: Construct, id: string, vpc: cdk.aws_ec2.Vpc,  props?: cdk.StackProps) {
    
    super(scope, id, props);

    // Create a Security Group for the bastion host
    const bastionSg = new ec2.SecurityGroup(this, 'BastionSg', {
      vpc,
      description: 'Security group for the bastion host',
      allowAllOutbound: true // Modify as per your outbound rules requirement
    });

    // Allow inbound SSH access on port 22
    bastionSg.addIngressRule(
      ec2.Peer.anyIpv4(), // or restrict to a specific IP range
      ec2.Port.tcp(22),
      'Allow SSH access from anywhere'
    );

    const bastion = new ec2.Instance(this, 'BastionHost', {
      vpc,
      instanceType: new ec2.InstanceType('t2.nano'),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      keyName: 'ec2-test-keypair', // Key pair for SSH access to the bastion
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }, // Deploy in public subnet
      securityGroup: bastionSg
    });




  }
}

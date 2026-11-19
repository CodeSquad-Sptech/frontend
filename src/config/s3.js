const { S3Client } = require("@aws-sdk/client-s3");

// Sem chaves no código: na EC2 o SDK usa as credenciais da role (LabRole).
const s3 = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });

module.exports = s3;

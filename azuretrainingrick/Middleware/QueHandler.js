const { QueueServiceClient, StorageSharedKeyCredential } = require("@azure/storage-queue");
const { BlobServiceClient } = require("@azure/storage-blob");
const pl = require('pinklog');

const account = "trainingstoragerick";
const accountKey = "cUCrL4Bh0/Fahg5bwo62hLudMDM4/Ndf0f/Uq2jw0WJQJcyZFH8uGgQErBgZFNnjg0I5D6fd6ogHE4lMz/npng==";

const queueName = "myqueue"
const containerName = "imagecontainer"
const smallName = "smallimageiontainer"

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
 
const queueServiceClient = new QueueServiceClient(
  `https://${account}.queue.core.windows.net`,
  sharedKeyCredential,
  {
    retryOptions: { maxTries: 4 }, 
    telemetry: { value: "BasicSample/V11.0.0" } 
  }
)
const queueClient = queueServiceClient.getQueueClient(queueName)

const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential,
  {
    retryOptions: { maxTries: 4 }, 
    telemetry: { value: "BasicSample/V11.0.0" } 
  }
)
const containerClient = blobServiceClient.getContainerClient(containerName);
const smallClient = blobServiceClient.getContainerClient(smallName);

async function doCreate() {
  const createQueueResponse = await queueClient.create()
  pl.log('create')
  console.log(
    `Created queue ${queueName} successfully, service assigned request Id: ${createQueueResponse.requestId}`
  )
  await containerClient.create()
  .then((ev) => pl.ok(ev))
  .catch(err => pl.err(err.message))
  //console.log(`Create container ${containerName} successfully`, createContainerResponse.requestId)
  //const createSmallResponse = await smallClient.create();
  //console.log(`Create container ${smallName} successfully`, createSmallResponse.requestId)
}
async function doSend(message) {
  const sendMessageResponse = await queueClient.sendMessage(message);
  pl.log(
    `message Id: ${sendMessageResponse.messageId}, 
    service assigned request Id: ${sendMessageResponse.requestId},
    message: ${sendMessageResponse._response.request.body}`
  )
  //pl.ob(sendMessageResponse)
}
async function doUpload() {
  const contentPath = "/sjon.png";
  const blobName = "newblob" + new Date().getTime();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadFile(contentPath, {
    rangeSize: 4 * 1024 * 1024, // 4MB range size
    parallelism: 20, // 20 concurrency
    onProgress: (ev) => pl.ok(ev)
  }).catch(err => pl.err(err.message))
  pl.log('uploaded')
}
const qh = {}

qh.DO = (req, res, next) => {
  pl.log('do')
  pl.ob(req.body)
  if (req.body.firstname) {
    doCreate()
    doSend(JSON.stringify(req.body))
    //doUpload()
  }

  
  next()
}

module.exports = qh






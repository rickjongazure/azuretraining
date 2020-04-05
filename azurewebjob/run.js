var azure = require("azure-storage");
var pl = require("pinklog");

const queueName = "myqueue";
const storageaccount = "trainingstoragerick";
const storagekey =
  "cUCrL4Bh0/Fahg5bwo62hLudMDM4/Ndf0f/Uq2jw0WJQJcyZFH8uGgQErBgZFNnjg0I5D6fd6ogHE4lMz/npng==";

var queueSvc = azure.createQueueService(storageaccount, storagekey);
queueSvc.createQueueIfNotExists(queueName, function(error, results, response) {
  if (!error) {
    //pl.ok('que created')
  } else {
    pl.err(error);
  }
});

queueSvc.getMessages(
  queueName,
  { numOfMessages: 15},
  function(error, results, getResponse) {
    if (!error) {
      if (results[0]) {
        for (var index in results) {
          var message = results[index];
          pl.ok(`Message received: 
      messageId:  ${message.messageId},
      insertTime: ${message.insertionTime},
      body: ${message.messageText}`);
          queueSvc.deleteMessage(
            queueName,
            message.messageId,
            message.popReceipt,
            function(error, deleteResponse) {
              if (!error) {
                // Message deleted
              }
            }
          );
        }
      }
    }
  }
);

var azure = require('azure-storage');
var pl = require('pinklog');

const formidable = require('formidable');

const storageaccount = "trainingstoragerick"
const storagekey = "cUCrL4Bh0/Fahg5bwo62hLudMDM4/Ndf0f/Uq2jw0WJQJcyZFH8uGgQErBgZFNnjg0I5D6fd6ogHE4lMz/npng=="

const queueName = "myqueue"
const containerName = "imagecontainer"
const smallName = "smallimageiontainer"

const qh = {}

qh.DO = (req, res, next) => {
    pl.log('do')
    pl.ob(req.body)
    pl.log('file')

    var queueSvc = azure.createQueueService(storageaccount, storagekey);
    var blobService = azure.createBlobService(storageaccount, storagekey);

    queueSvc.createQueueIfNotExists(queueName, function (error, results, response) {
        if (!error) {
            pl.ok('que created')
        } else { pl.err(error) }
    })

    blobService.createContainerIfNotExists(containerName, {
        publicAccessLevel: 'blob'
      }, function(error, result, response) {
        if (!error) {
            pl.if(result, containerName)
        }
      });

      blobService.createContainerIfNotExists(smallName, {
        publicAccessLevel: 'blob'
      }, function(error, result, response) {
        if (!error) {
            pl.if(result, smallName)
        }
      });

      var form = new formidable.IncomingForm();
      form.onPart = function(part){
          blobService.createBlockBlobFromStream(containerName, 'sjon.png', part, 11, function(error){
            if(!error){
                
            }
          });
        };
        form.parse(req);
  
        pl.ob(form)





    if (req.body.firstname) {
        queueSvc.createMessage(queueName, JSON.stringify(req.body), function (error, results, response) {
            if (!error) {
                let data = response.body.QueueMessagesList.QueueMessage
                pl.ob(results)
                pl.ok(`Message sent :
            MessageId: ${data.MessageId},
            Pop: ${data.PopReceipt}`)
            }
        });
    }
    next()
}




module.exports = qh






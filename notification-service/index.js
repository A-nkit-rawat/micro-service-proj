var amqp = require('amqplib/callback_api');
var queue = "task-queue";

setTimeout(() => {
    amqp.connect('amqp://rabbitmq-node', function (error0, connection) {
        if (error0) throw error0;

        connection.createChannel(function (error1, channel) {
            if (error1) throw error1;

            channel.assertQueue(queue, { durable: false });

            console.log(" [*] Waiting for messages in %s", queue);

            channel.consume(queue, function (msg) {
                console.log(" [x] Received %s", msg.content.toString());

                // send email to user
                channel.ack(msg);

            }, { noAck: false });  
        });
    });
}, 10000)

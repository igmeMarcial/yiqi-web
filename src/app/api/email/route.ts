import { handleEmailReceived } from '@/lib/email/handlers/handleEmailReceived'
import simplerParser from 'mailparser'
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs'
import { NextResponse } from 'next/server';

const sqsClient = new SQSClient({ region: 'us-east-1' });
const queueUrl = process.env.AWS_SQS_QUEUE_URL;

export async function GET() {
  try {
    // Receive a message from the SQS queue
    const receiveParams = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 10
    };
    const receiveCommand = new ReceiveMessageCommand(receiveParams);
    const response = await sqsClient.send(receiveCommand);
    console.log(response)

    if (!response.Messages || response.Messages.length === 0) {
      return new NextResponse(null, { status: 204 }); // No content
    }

    const message = response.Messages[0];

    console.log(message)

    if(!message.Body){
      throw 'no body in email message';
    }

    const body = JSON.parse(message.Body);

    const email = await simplerParser.simpleParser(body);

    // Access custom headers
    const threadId = email.headers.get('andino-thread-id');

    if (!threadId) {
      throw 'no thread id found';
    }

    const parsedBody = email.html || email.text;
    if (typeof parsedBody !== 'string') {
      throw 'no body';
    }

    await handleEmailReceived({
      threadId: threadId.toString(),
      content: parsedBody
    });

    // Delete the message from the queue after processing
    const deleteParams = {
      QueueUrl: queueUrl,
      ReceiptHandle: message.ReceiptHandle
    };
    const deleteCommand = new DeleteMessageCommand(deleteParams);
    await sqsClient.send(deleteCommand);

  } catch (e) {
    console.error(e);
    return new NextResponse(null, { status: 500 });
  }
  return new NextResponse(null, { status: 200 });
}
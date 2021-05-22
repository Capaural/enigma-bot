exports.triggerMessage = (params) => {
  const message = params.message;
  const msg = 'Je t\'écoute coco.';
  message.author.send(msg);
}
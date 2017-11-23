export default function (stream) {
  return new ReadableStream({
    async start(controller) {
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let buf = '';
      /* eslint-disable no-await-in-loop */
      for (;;) {
        const { done, value } = await reader.read();
        let lines;
        if (done) {
          lines = [buf];
        } else {
          buf += decoder.decode(value, { stream: true });
          lines = buf.split('\n');
          buf = lines.pop();
        }
        for (let i = 0; i < lines.length; i += 1) {
          const l = lines[i].trim();
          if (l !== '') {
            try {
              controller.enqueue(JSON.parse(l));
            } catch (e) {
              controller.error(e);
              return;
            }
          }
        }
        if (done) {
          controller.close();
          return;
        }
      }
    },
  });
}

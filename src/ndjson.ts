export default function(stream: ReadableStream) {
  // @ts-ignore
  return new ReadableStream({
    async start(controller) {
      const reader = stream.getReader();
      // @ts-ignore
      const decoder = new TextDecoder();
      let buf = '';
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
        for (const line of lines) {
          const l = line.trim();
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

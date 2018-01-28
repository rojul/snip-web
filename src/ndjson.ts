export default function(stream: ReadableStream) {
  // @ts-ignore
  return new ReadableStream({
    async start(controller: any) {
      const reader = stream.getReader();
      // @ts-ignore
      const decoder = new TextDecoder();
      let buf = '';
      for (;;) {
        const { done, value } = await reader.read();
        let lines: string[];
        if (done) {
          lines = [buf];
        } else {
          buf += decoder.decode(value, { stream: true });
          lines = buf.split('\n');
          buf = lines.pop()!;
        }
        for (const line of lines) {
          const l = line.trim();
          if (l !== '') {
            controller.enqueue(JSON.parse(l));
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

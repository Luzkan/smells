import { describe, expect, it } from 'vitest';
import { serializeJsonForScriptTag } from '../../../src/lib/json-script';

describe('serializeJsonForScriptTag', () => {
  it('escapes script-breaking payloads while preserving parseable JSON', () => {
    const payload = {
      smells: [
        {
          slug: 'dead-code',
          name: '</script><img src=x onerror=alert(1)>',
        },
      ],
    };

    const serialized = serializeJsonForScriptTag(payload);

    expect(serialized).not.toContain('</script>');
    expect(serialized).not.toContain('<img');
    expect(serialized).toContain(String.raw`\u003C/script\u003E`);
    expect(JSON.parse(serialized)).toEqual(payload);
  });
});

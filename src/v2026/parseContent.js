// Turns your plain text file (secret/content.txt) into the pieces the page shows.
// The file is written by you, locked with your secret word, and only unlocked
// in her browser after she types the word. See content.sample.txt for the format.
//
// Format:
//   First lines, before any heading   -> the short message shown right after unlocking
//   == STORY ==                       -> then entries that start with "# date | title"
//   == LETTERS ==                     -> then entries that start with "# Open when ..."
//   == STARS ==                       -> the message shown when she catches every falling star (optional)
//   A blank line starts a new paragraph.

export function parseContent(raw) {
  const result = { message: '', story: [], letters: [], stars: [] };
  const lines = String(raw || '').replace(/\r\n/g, '\n').split('\n');

  let part = 'message';
  let current = null;
  const messageLines = [];
  const starLines = [];

  const finish = () => {
    if (!current) return;
    current.paragraphs = current.body
      .join('\n')
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);
    delete current.body;
    if (part === 'story') result.story.push(current);
    if (part === 'letters') result.letters.push(current);
    current = null;
  };

  lines.forEach((line) => {
    const heading = /^==\s*(STORY|LETTERS|STARS)\s*==\s*$/i.exec(line.trim());
    if (heading) {
      finish();
      part = heading[1].toLowerCase();
      return;
    }

    if (part === 'message') {
      messageLines.push(line);
      return;
    }

    if (part === 'stars') {
      starLines.push(line);
      return;
    }

    if (/^#\s+/.test(line)) {
      finish();
      const text = line.replace(/^#\s+/, '').trim();
      if (part === 'story') {
        const bar = text.indexOf('|');
        current = {
          date: bar === -1 ? '' : text.slice(0, bar).trim(),
          title: bar === -1 ? text : text.slice(bar + 1).trim(),
          body: []
        };
      } else {
        current = { title: text, body: [] };
      }
      return;
    }

    if (current) current.body.push(line);
  });

  finish();
  result.message = messageLines.join('\n').trim();
  result.stars = starLines
    .join('\n')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return result;
}

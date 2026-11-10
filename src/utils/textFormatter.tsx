import React from 'react';
import { FONT_OPTIONS, getFontClass, getFontSizeClass, getFontSizePx } from '../data/fontOptions';

export interface StyledSegment {
  text: string;
  font?: string;
  color?: string;
  size?: string;
  bg?: string;
  bold?: boolean;
}

/**
 * Strips all style markup/HTML tags and returns clean plain text.
 * Safe for search, toasts, order delivery buttons, and plain text inputs.
 */
export function stripFormatting(text?: string | null): string {
  if (!text) return '';
  return text
    // Remove custom style tags: [style ...], [/style], [style], [/]
    .replace(/\[\/?style[^\]]*\]/gi, '')
    // Remove shorthand tags: [c:...], [/c], [s:...], [/s], [f:...], [/f], [color:...], etc.
    .replace(/\[\/?(c|f|s|color|font|size|bg|b)[^\]]*\]/gi, '')
    .replace(/\[\/\]/g, '')
    // Remove HTML tags: <span ...>, </span>, <font ...>, </font>, <b>, </b>, <strong>, </strong>, <mark>, </mark>
    .replace(/<\/?[a-z0-9_-]+(\s+[^>]*)?>/gi, '')
    // Remove Markdown bold
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    // Remove any leftover tag brackets that might have been malformed
    .replace(/\[style[^\]]*$/gi, '')
    .replace(/<\/?[a-z0-9_-]+[^>]*$/gi, '');
}

/**
 * Parses key="value" or key=value or key:'value' from an attribute string
 */
function parseTagAttributes(attrStr: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!attrStr) return result;

  const regex = /([a-zA-Z0-9_-]+)\s*[:=]\s*(?:"([^"]*)"|'([^']*)'|([^\s"',;]+))/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(attrStr)) !== null) {
    const key = m[1].toLowerCase();
    const val = (m[2] ?? m[3] ?? m[4] ?? '').trim();
    result[key] = val;
  }
  return result;
}

/**
 * Parses HTML style="color: ...; font-size: ...;" attribute
 */
function parseCssStyleString(styleStr: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!styleStr) return result;

  const rules = styleStr.split(';');
  for (const rule of rules) {
    const colonIdx = rule.indexOf(':');
    if (colonIdx === -1) continue;
    const prop = rule.slice(0, colonIdx).trim().toLowerCase();
    const val = rule.slice(colonIdx + 1).trim();
    if (prop && val) {
      result[prop] = val;
    }
  }
  return result;
}

/**
 * Resolves font id from name, class, or font-family
 */
function resolveFontId(val?: string): string | undefined {
  if (!val) return undefined;
  const clean = val.toLowerCase().replace(/['"]/g, '');
  for (const opt of FONT_OPTIONS) {
    if (opt.id === clean || opt.shortName.toLowerCase() === clean) return opt.id;
    if (opt.name.toLowerCase().includes(clean)) return opt.id;
    if (opt.cssClass.toLowerCase().includes(clean)) return opt.id;
  }
  if (clean.includes('song')) return 'song';
  if (clean.includes('black') || clean.includes('han')) return 'black-han';
  if (clean.includes('gowun') && clean.includes('dodum')) return 'gowun-dodum';
  if (clean.includes('gowun') && clean.includes('batang')) return 'gowun-batang';
  if (clean.includes('noto')) return 'noto';
  return undefined;
}

/**
 * Normalizes size string to a valid px or preset
 */
function resolveFontSize(val?: string): string | undefined {
  if (!val) return undefined;
  const clean = val.trim().toLowerCase();
  // If it's already px like "18px"
  if (/^\d+px$/.test(clean)) return clean;
  // If it's pure number like "18"
  if (/^\d+$/.test(clean)) return `${clean}px`;
  // If it's preset id
  const px = getFontSizePx(clean);
  if (px) return px;
  return clean;
}

/**
 * Clean up any leaked tag syntax from text so raw code is NEVER displayed to users.
 */
function sanitizeTextContent(text: string): string {
  if (!text) return '';
  return text
    .replace(/\[\/?style[^\]]*\]/gi, '')
    .replace(/\[\/?(c|f|s|color|font|size|bg|b)[^\]]*\]/gi, '')
    .replace(/\[\/\]/g, '')
    .replace(/<\/?[a-z0-9_-]+(\s+[^>]*)?>/gi, '');
}

/**
 * Robust multi-format parser:
 * Parses text containing [style ...], <span ...>, <font ...>, shorthand tags, etc.
 * Handles nested tags gracefully by flattening them, and guarantees NO raw code is ever rendered.
 */
export function parseFormattedText(rawText?: string | null): StyledSegment[] {
  if (!rawText) return [];

  // If text has no brackets or tag markers, return as single plain segment immediately
  if (!rawText.includes('[') && !rawText.includes('<') && !rawText.includes('**')) {
    return [{ text: rawText }];
  }

  const segments: StyledSegment[] = [];

  // Matcher for all supported tag variants:
  // 1. [style ...]content[/style] or [style ...]content[/]
  // 2. <span ...>content</span>
  // 3. <font ...>content</font>
  // 4. <mark>content</mark>
  // 5. <b>content</b> or <strong>content</strong>
  // 6. [c:color]content[/c] or [color:...]...[/color]
  // 7. [s:size]content[/s] or [size:...]...[/size]
  // 8. [f:font]content[/f] or [font:...]...[/font]
  // 9. **markdown bold**
  const tagRegex =
    /(?:\[style\s+([^\]]+)\]([\s\S]*?)\[\/(?:style)?\])|(?:<span\s+([^>]+)>([\s\S]*?)<\/span>)|(?:<font\s+([^>]+)>([\s\S]*?)<\/font>)|(?:<mark>([\s\S]*?)<\/mark>)|(?:<(?:b|strong)>([\s\S]*?)<\/(?:b|strong)>)|(?:\[(?:c|color)[:=]([^\]]+)\]([\s\S]*?)\[\/(?:c|color)\])|(?:\[(?:s|size)[:=]([^\]]+)\]([\s\S]*?)\[\/(?:s|size)\])|(?:\[(?:f|font)[:=]([^\]]+)\]([\s\S]*?)\[\/(?:f|font)\])|(?:\*\*([^*]+)\*\*)/gi;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(rawText)) !== null) {
    const matchStart = match.index;
    const matchEnd = tagRegex.lastIndex;

    // Plain text before the tag
    if (matchStart > lastIndex) {
      const preceding = sanitizeTextContent(rawText.slice(lastIndex, matchStart));
      if (preceding) {
        segments.push({ text: preceding });
      }
    }

    if (match[1] !== undefined && match[2] !== undefined) {
      // [style attr="val"]...[/style]
      const attrsStr = match[1];
      let innerContent = match[2];
      const parsed = parseTagAttributes(attrsStr);

      // In case innerContent has nested tags, recursively flatten
      if (innerContent.includes('[') || innerContent.includes('<')) {
        const subSegments = parseFormattedText(innerContent);
        for (const sub of subSegments) {
          segments.push({
            text: sanitizeTextContent(sub.text),
            font: resolveFontId(sub.font) || resolveFontId(parsed.font || parsed.f),
            color: sub.color || parsed.color || parsed.c,
            size: resolveFontSize(sub.size) || resolveFontSize(parsed.size || parsed.s),
            bg: sub.bg || parsed.bg,
            bold: sub.bold ?? (parsed.bold === 'true' || parsed.b === 'true'),
          });
        }
      } else {
        segments.push({
          text: sanitizeTextContent(innerContent),
          font: resolveFontId(parsed.font || parsed.f),
          color: parsed.color || parsed.c,
          size: resolveFontSize(parsed.size || parsed.s),
          bg: parsed.bg,
          bold: parsed.bold === 'true' || parsed.b === 'true',
        });
      }
    } else if (match[3] !== undefined && match[4] !== undefined) {
      // <span ...>...</span>
      const attrsStr = match[3];
      const innerContent = match[4];
      const directAttrs = parseTagAttributes(attrsStr);
      const cssStyles = directAttrs.style ? parseCssStyleString(directAttrs.style) : {};

      const fontVal = cssStyles['font-family'] || directAttrs.font || directAttrs['data-font'];
      const colorVal = cssStyles['color'] || directAttrs.color || directAttrs['data-color'];
      const sizeVal = cssStyles['font-size'] || directAttrs.size || directAttrs['data-size'];
      const bgVal = cssStyles['background-color'] || cssStyles['background'] || directAttrs.bg || directAttrs['data-bg'];
      const boldVal = cssStyles['font-weight'] === 'bold' || cssStyles['font-weight'] === '700' || directAttrs.bold === 'true';

      if (innerContent.includes('[') || innerContent.includes('<')) {
        const subSegments = parseFormattedText(innerContent);
        for (const sub of subSegments) {
          segments.push({
            text: sanitizeTextContent(sub.text),
            font: resolveFontId(sub.font) || resolveFontId(fontVal),
            color: sub.color || colorVal,
            size: resolveFontSize(sub.size) || resolveFontSize(sizeVal),
            bg: sub.bg || bgVal,
            bold: sub.bold ?? boldVal,
          });
        }
      } else {
        segments.push({
          text: sanitizeTextContent(innerContent),
          font: resolveFontId(fontVal),
          color: colorVal,
          size: resolveFontSize(sizeVal),
          bg: bgVal,
          bold: boldVal,
        });
      }
    } else if (match[5] !== undefined && match[6] !== undefined) {
      // <font ...>...</span>
      const attrsStr = match[5];
      const innerContent = sanitizeTextContent(match[6]);
      const attrs = parseTagAttributes(attrsStr);
      segments.push({
        text: innerContent,
        color: attrs.color,
        size: resolveFontSize(attrs.size),
        font: resolveFontId(attrs.face),
      });
    } else if (match[7] !== undefined) {
      // <mark>...</mark>
      segments.push({
        text: sanitizeTextContent(match[7]),
        bg: '#FEF08A',
        color: '#854D0E',
        bold: true,
      });
    } else if (match[8] !== undefined) {
      // <b> or <strong>
      segments.push({
        text: sanitizeTextContent(match[8]),
        bold: true,
      });
    } else if (match[9] !== undefined && match[10] !== undefined) {
      // [c:color]...[/c]
      segments.push({
        text: sanitizeTextContent(match[10]),
        color: match[9].trim(),
      });
    } else if (match[11] !== undefined && match[12] !== undefined) {
      // [s:size]...[/s]
      segments.push({
        text: sanitizeTextContent(match[12]),
        size: resolveFontSize(match[11]),
      });
    } else if (match[13] !== undefined && match[14] !== undefined) {
      // [f:font]...[/f]
      segments.push({
        text: sanitizeTextContent(match[14]),
        font: resolveFontId(match[13]),
      });
    } else if (match[15] !== undefined) {
      // **markdown**
      segments.push({
        text: sanitizeTextContent(match[15]),
        bold: true,
      });
    }

    lastIndex = matchEnd;
  }

  // Trailing text after last match
  if (lastIndex < rawText.length) {
    const remaining = sanitizeTextContent(rawText.slice(lastIndex));
    if (remaining) {
      segments.push({ text: remaining });
    }
  }

  // Filter out any empty segments
  const cleanSegments = segments.filter((s) => s.text && s.text.length > 0);

  // If no segments were parsed, fallback to plain text sanitized
  if (cleanSegments.length === 0) {
    const fallback = sanitizeTextContent(rawText);
    return fallback ? [{ text: fallback }] : [];
  }

  return cleanSegments;
}

/**
 * Serializes structured segments into clean, un-nested [style ...] tags.
 */
export function serializeSegments(segments: StyledSegment[]): string {
  if (!segments || segments.length === 0) return '';

  return segments
    .map((seg) => {
      const clean = sanitizeTextContent(seg.text);
      if (!clean) return '';

      const hasStyle = seg.font || seg.color || seg.size || seg.bg || seg.bold;
      if (!hasStyle) return clean;

      const attrs: string[] = [];
      if (seg.font) attrs.push(`font="${seg.font}"`);
      if (seg.color) attrs.push(`color="${seg.color}"`);
      if (seg.size) attrs.push(`size="${seg.size}"`);
      if (seg.bg) attrs.push(`bg="${seg.bg}"`);
      if (seg.bold) attrs.push(`bold="true"`);

      return `[style ${attrs.join(' ')}]${clean}[/style]`;
    })
    .join('');
}

/**
 * Extracts currently styled segments present in the text
 */
export function extractStyledSegments(text?: string | null): StyledSegment[] {
  if (!text) return [];
  const segments = parseFormattedText(text);
  return segments.filter((s) => s.font || s.color || s.size || s.bg || s.bold);
}

/**
 * Apply partial style to a target substring within text.
 * Uses structured segment manipulation to completely prevent nested tags or code corruption.
 */
export function applyPartialStyle(
  fullText: string,
  targetSubstring: string,
  newStyle: {
    font?: string;
    color?: string;
    size?: string;
    bg?: string;
    bold?: boolean;
  }
): string {
  const cleanTarget = stripFormatting(targetSubstring).trim();
  if (!cleanTarget) return fullText;

  // 1. Parse current fullText into segments
  const currentSegments = parseFormattedText(fullText);
  const plainText = currentSegments.map((s) => s.text).join('');

  // 2. Locate target in plainText
  const matchIndex = plainText.indexOf(cleanTarget);
  if (matchIndex === -1) {
    // If exact target not in plainText, fallback
    return fullText;
  }
  const matchEnd = matchIndex + cleanTarget.length;

  // 3. Rebuild segments by slicing at match boundaries
  const newSegments: StyledSegment[] = [];
  let currentOffset = 0;

  for (const seg of currentSegments) {
    const segStart = currentOffset;
    const segEnd = currentOffset + seg.text.length;
    currentOffset = segEnd;

    // Segment is completely before match
    if (segEnd <= matchIndex) {
      newSegments.push(seg);
      continue;
    }

    // Segment is completely after match
    if (segStart >= matchEnd) {
      newSegments.push(seg);
      continue;
    }

    // Overlapping case: split segment into before, matched, after
    const overlapStart = Math.max(segStart, matchIndex);
    const overlapEnd = Math.min(segEnd, matchEnd);

    // Part before match
    if (segStart < overlapStart) {
      newSegments.push({
        ...seg,
        text: seg.text.slice(0, overlapStart - segStart),
      });
    }

    // Matched part with new styles
    newSegments.push({
      text: seg.text.slice(overlapStart - segStart, overlapEnd - segStart),
      font: newStyle.font || seg.font,
      color: newStyle.color || seg.color,
      size: resolveFontSize(newStyle.size) || seg.size,
      bg: newStyle.bg !== undefined ? newStyle.bg : seg.bg,
      bold: newStyle.bold !== undefined ? newStyle.bold : seg.bold,
    });

    // Part after match
    if (segEnd > overlapEnd) {
      newSegments.push({
        ...seg,
        text: seg.text.slice(overlapEnd - segStart),
      });
    }
  }

  // 4. Merge adjacent segments with identical styling
  const mergedSegments: StyledSegment[] = [];
  for (const seg of newSegments) {
    if (!seg.text) continue;
    const prev = mergedSegments[mergedSegments.length - 1];
    if (
      prev &&
      prev.font === seg.font &&
      prev.color === seg.color &&
      prev.size === seg.size &&
      prev.bg === seg.bg &&
      prev.bold === seg.bold
    ) {
      prev.text += seg.text;
    } else {
      mergedSegments.push({ ...seg });
    }
  }

  return serializeSegments(mergedSegments);
}

/**
 * Removes formatting tags around a given target substring or clears all styling for a word
 */
export function removePartialStyle(fullText: string, targetSubstring: string): string {
  const cleanTarget = stripFormatting(targetSubstring).trim();
  if (!cleanTarget) return fullText;

  const currentSegments = parseFormattedText(fullText);
  const plainText = currentSegments.map((s) => s.text).join('');

  const matchIndex = plainText.indexOf(cleanTarget);
  if (matchIndex === -1) return fullText;
  const matchEnd = matchIndex + cleanTarget.length;

  const newSegments: StyledSegment[] = [];
  let currentOffset = 0;

  for (const seg of currentSegments) {
    const segStart = currentOffset;
    const segEnd = currentOffset + seg.text.length;
    currentOffset = segEnd;

    if (segEnd <= matchIndex || segStart >= matchEnd) {
      newSegments.push(seg);
      continue;
    }

    const overlapStart = Math.max(segStart, matchIndex);
    const overlapEnd = Math.min(segEnd, matchEnd);

    if (segStart < overlapStart) {
      newSegments.push({
        ...seg,
        text: seg.text.slice(0, overlapStart - segStart),
      });
    }

    // Matched portion: strip all styles!
    newSegments.push({
      text: seg.text.slice(overlapStart - segStart, overlapEnd - segStart),
    });

    if (segEnd > overlapEnd) {
      newSegments.push({
        ...seg,
        text: seg.text.slice(overlapEnd - segStart),
      });
    }
  }

  // Merge adjacent plain segments
  const merged: StyledSegment[] = [];
  for (const seg of newSegments) {
    if (!seg.text) continue;
    const prev = merged[merged.length - 1];
    const isPrevPlain = prev && !prev.font && !prev.color && !prev.size && !prev.bg && !prev.bold;
    const isSegPlain = !seg.font && !seg.color && !seg.size && !seg.bg && !seg.bold;

    if (isPrevPlain && isSegPlain) {
      prev.text += seg.text;
    } else {
      merged.push({ ...seg });
    }
  }

  return serializeSegments(merged);
}

/**
 * Updates clean text while preserving any partial styles that still match words in the new text.
 * Strictly preserves spaces, trailing spaces, and word boundaries.
 */
export function syncPlainTextWithStyles(originalFormattedText: string, newPlainText: string): string {
  if (!originalFormattedText) return newPlainText;
  const styledSegments = extractStyledSegments(originalFormattedText);
  if (styledSegments.length === 0) return newPlainText;
  if (!newPlainText) return '';

  let result = newPlainText;
  for (const seg of styledSegments) {
    const rawWord = seg.text;
    const cleanWord = seg.text.trim();
    if (!cleanWord) continue;

    // First try matching raw word (preserves exact spacing)
    if (result.includes(rawWord)) {
      result = applyPartialStyle(result, rawWord, {
        font: seg.font,
        color: seg.color,
        size: seg.size,
        bg: seg.bg,
        bold: seg.bold,
      });
    } else if (result.includes(cleanWord)) {
      // If spaces were adjusted around the word, fallback to clean trimmed word
      result = applyPartialStyle(result, cleanWord, {
        font: seg.font,
        color: seg.color,
        size: seg.size,
        bg: seg.bg,
        bold: seg.bold,
      });
    }
  }
  return result;
}

export interface FormattedTextProps {
  text?: string | null;
  defaultFont?: string;
  defaultColor?: string;
  defaultSize?: string;
  isSoldOut?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * FormattedText Component
 * Renders text with partial styled segments (font, color, size, highlight, bold).
 * Guarantees zero code leaks: no raw brackets or tags are ever rendered.
 * Fully preserves spaces and word spacing using whitespace-pre-wrap.
 */
export const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  defaultFont,
  defaultColor,
  defaultSize,
  isSoldOut = false,
  className = '',
  style = {},
}) => {
  if (!text) return null;

  const segments = parseFormattedText(text);

  // If there are no styled segments and just 1 plain text segment
  if (
    segments.length === 1 &&
    !segments[0].font &&
    !segments[0].color &&
    !segments[0].size &&
    !segments[0].bg &&
    !segments[0].bold
  ) {
    return (
      <span
        className={`whitespace-pre-wrap ${getFontClass(defaultFont)} ${getFontSizeClass(defaultSize)} ${className}`}
        style={{
          color: isSoldOut ? '#78716c' : defaultColor || 'inherit',
          fontSize: getFontSizePx(defaultSize),
          ...style,
        }}
      >
        {segments[0].text}
      </span>
    );
  }

  return (
    <span
      className={`inline items-baseline whitespace-pre-wrap ${getFontClass(defaultFont)} ${getFontSizeClass(
        defaultSize
      )} ${className}`}
      style={{
        color: isSoldOut ? '#78716c' : defaultColor || 'inherit',
        ...style,
      }}
    >
      {segments.map((seg, idx) => {
        const segFontClass = seg.font ? getFontClass(seg.font) : getFontClass(defaultFont);
        const segFontSize = seg.size || (defaultSize ? getFontSizePx(defaultSize) : undefined);
        const segColor = isSoldOut ? '#78716c' : seg.color || defaultColor || 'inherit';

        return (
          <span
            key={idx}
            className={`${segFontClass} ${seg.bold ? 'font-black' : ''} whitespace-pre-wrap ${
              seg.bg ? 'px-1 py-0.5 rounded shadow-2xs mx-0.5' : ''
            }`}
            style={{
              color: segColor,
              fontSize: segFontSize,
              backgroundColor: seg.bg || undefined,
            }}
          >
            {seg.text}
          </span>
        );
      })}
    </span>
  );
};

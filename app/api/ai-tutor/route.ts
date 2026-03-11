import Anthropic from '@anthropic-ai/sdk';

const VALID_LEVELS = new Set(['bronze', 'silver', 'gold', 'platinum', 'openclaw']);
const MAX_MESSAGE_LENGTH = 2000;
const HISTORY_LIMIT = 10;

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  lessonTitle: string;
  courseLevel: string;
  history: HistoryMessage[];
}

export async function POST(req: Request): Promise<Response> {
  let body: RequestBody;

  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return Response.json(
      { error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' } },
      { status: 400 },
    );
  }

  const { message, lessonTitle, courseLevel, history } = body;

  if (!message?.trim() || message.trim().length > MAX_MESSAGE_LENGTH) {
    return Response.json(
      { error: { code: 'VALIDATION_FAILED', message: 'message is required and must be under 2000 characters' } },
      { status: 400 },
    );
  }

  if (courseLevel && !VALID_LEVELS.has(courseLevel)) {
    return Response.json(
      { error: { code: 'VALIDATION_FAILED', message: 'Invalid courseLevel' } },
      { status: 400 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: { code: 'CONFIG_ERROR', message: 'AI 導師暫時唔可用，請稍後再試。' } },
      { status: 503 },
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const safeLevel = VALID_LEVELS.has(courseLevel) ? courseLevel : '本課程';
  const safeTitle = (lessonTitle ?? '').slice(0, 100) || '本課程';

  const systemPrompt = `你係 SkillAI.hk 嘅 AI 導師，專門幫助香港學員學習 AI 技術。
而家學員喺度學習：${safeLevel} 課程 - 「${safeTitle}」

你嘅風格：親切、鼓勵、專業，用廣東話口語回答。
- 用詞要自然，例如「你好」「咁樣」「即係話」「舉個例子」
- 回答要具體實用，最好有真實例子
- 控制喺 300 字以內
- 如果係技術名詞可以保留英文，例如 API、LLM、Prompt`;

  const safeHistory: Array<{ role: 'user' | 'assistant'; content: string }> = (
    Array.isArray(history) ? history : []
  )
    .filter((m) => m.role && m.content)
    .slice(-HISTORY_LIMIT);

  const stream = await client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 500,
    system: systemPrompt,
    messages: [
      ...safeHistory,
      { role: 'user', content: message.trim() },
    ],
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.error('[AI tutor] stream error:', err);
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  });
}

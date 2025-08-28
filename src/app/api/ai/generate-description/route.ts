import { NextRequest, NextResponse } from 'next/server';


function normalizeAiHtml(s: string = '') {
  const unfenced = s
    .replace(/^\s*```(?:html?|markdown|md)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  const looksLikeHtml = /<\s*[a-z][\s\S]*>/i.test(unfenced);
  if (!looksLikeHtml) {
    const esc = unfenced
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<p>${esc.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`;
  }
  return unfenced;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Facts bám sát form
    const {
      name = '',
      categoryName = '',
      typeName = '',
      provinceName = '',
      districtName = '',
      wardName = '',
      addressDetail = '',
      isFree = false,
      minPrice = 0,
      maxPrice = 0,
      tone = 'thân thiện, súc tích, hướng dẫn rõ ràng cho du khách',
      // tuỳ chọn
      detailLevel = 'high',
    } = body || {};

    const locationParts = [addressDetail, wardName, districtName, provinceName].filter(Boolean);
    const locationStr = locationParts.join(', ') || '—';

    // Prompt chi tiết theo “template du lịch”
    const systemPrompt = [
      'Bạn là copywriter du lịch chuyên nghiệp.',
      'Luôn bám sát FACTS được cung cấp; KHÔNG bịa tên địa danh/giá/điểm cụ thể ngoài facts.',
      'Viết tiếng Việt tự nhiên, rõ ràng, giàu thông tin; ưu tiên bullet và tiêu đề phụ dễ quét.',
      'Chỉ trả về HTML thuần; KHÔNG dùng Markdown và KHÔNG bao nội dung trong ```.',
      detailLevel === 'high'
        ? 'Độ dài mục tiêu: 350–600 từ.'
        : 'Độ dài mục tiêu: 180–280 từ.',
      'Bố cục HTML bắt buộc (bỏ mục nếu thiếu dữ liệu hợp lý):',
      '  <h3>Giới thiệu</h3><p>... nêu tổng quan, điểm hấp dẫn chính ...</p>',
      '  <h3>Thời điểm lý tưởng</h3><p>... gợi ý mùa/khung giờ an toàn chung, tránh khẳng định cứng ...</p>',
      '  <h3>Điểm tham quan nổi bật</h3><ul><li>... 3–6 gạch đầu dòng an toàn/khái quát ...</li></ul>',
      '  <h3>Trải nghiệm gợi ý</h3><ul><li>... 3–6 gợi ý hoạt động phù hợp ...</li></ul>',
      '  <h3>Ẩm thực & dịch vụ</h3><ul><li>... đặc trưng chung, dịch vụ thường có (tắm nước ngọt, ghế dù, gửi đồ) ...</li></ul>',
      '  <h3>Giá/Phí</h3><p>... nếu isFree=true ghi rõ Miễn phí; nếu có min/max > 0 hiển thị khoảng giá; tuyệt đối không bịa số khác ...</p>',
      '  <h3>Vị trí & di chuyển</h3><p>... mô tả từ location; nếu location = "—" bỏ mục ...</p>',
      '  <h3>Lưu ý</h3><ul><li>... 3–5 lưu ý an toàn, môi trường, thời tiết ...</li></ul>',
      '  <h3>Tóm tắt nhanh</h3><ul><li>Đối tượng phù hợp</li><li>Thời lượng tham khảo</li><li>Mức chi phí: dùng khoảng giá nếu có</li><li>Gợi ý mang theo</li></ul>',
    ].join('\n');

    const facts = {
      name,
      categoryName,
      typeName,
      location: locationStr,
      isFree: Boolean(isFree),
      minPrice: Number(minPrice || 0),
      maxPrice: Number(maxPrice || 0),
      tone,
    };

    const userPrompt = [
      'SỰ THẬT (FACTS) JSON:',
      '```json',
      JSON.stringify(facts, null, 2),
      '```',
      '',
      'Hướng dẫn quan trọng:',
      '- Không phát minh tên địa danh, địa chỉ cụ thể, số liệu không nằm trong facts.',
      '- Nếu thiếu dữ liệu, dùng diễn đạt an toàn/khái quát (ví dụ “tuỳ thời điểm”, “tuỳ dịch vụ”).',
      '- Không nhắc categoryName/typeName nếu trống.',
      '- Ngôn ngữ: ' + tone,
    ].join('\n');

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
      }),
    });

    if (!resp.ok) {
      const raw = await resp.text();
      return NextResponse.json({ error: 'OpenAI error', raw }, { status: 500 });
    }

    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content ?? '';
    const text = normalizeAiHtml(raw);

    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}

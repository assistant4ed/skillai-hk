import type { Metadata } from 'next';

export const metadata: Metadata = { title: '服務條款 — SkillAI.hk', description: 'SkillAI.hk 服務條款' };

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <a href="/" className="font-black text-xl"><span className="text-[#1A1A2E]">Skill</span><span className="text-[#4169E1]">AI</span></a>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-black mb-2">服務條款</h1>
        <p className="text-sm text-gray-400 mb-10">最後更新：2026 年 2 月 27 日</p>

        <div className="prose prose-gray prose-sm max-w-none space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">1. 服務概述</h2>
            <p>SkillAI.hk（由 DeFiner Tech Ltd 營運）提供線上 AI 技能培訓課程。使用我們的服務即表示您同意以下條款。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">2. 帳戶註冊</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>您必須年滿 16 歲方可使用本服務</li>
              <li>註冊資料必須真實準確</li>
              <li>您有責任保管帳戶安全，包括密碼保密</li>
              <li>每人限註冊一個帳戶</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">3. 課程與付款</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>課程價格以報名時顯示的為準</li>
              <li>付款成功後即可開始課程</li>
              <li>課程費用以港幣 (HKD) 計算</li>
              <li>我們接受信用卡、轉數快、PayMe 等付款方式</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">4. 退款政策</h2>
            <p>我們提供 <strong>14 天無理由退款保證</strong>：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>自付款日起 14 天內可申請全額退款</li>
              <li>無需提供任何理由</li>
              <li>退款將在 7 個工作天內處理</li>
              <li>退款以原付款方式退回</li>
              <li>超過 14 天後不接受退款申請</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">5. 知識產權</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>所有課程內容（包括影片、文件、代碼範例）均受版權保護</li>
              <li>購買課程授予個人使用權，不得轉售或分享</li>
              <li>禁止錄製、下載或複製課程內容</li>
              <li>學員的畢業項目知識產權歸學員所有</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">6. 使用規範</h2>
            <p>使用本服務時，您同意不會：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>分享帳戶或讓他人使用您的帳戶</li>
              <li>干擾或破壞網站或服務的正常運作</li>
              <li>在社群中發布不當、侮辱性或違法內容</li>
              <li>利用課程內容從事違法活動</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">7. 結業證書</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>完成所有課程模組和畢業項目後，將獲發 SkillAI 結業證書</li>
              <li>結業證書由 DeFiner Tech Ltd 簽發，證明您已完成相關培訓</li>
              <li>結業證書不代表任何專業資格認證或學位</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">8. 免責聲明</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>課程內容僅供教育參考，不構成專業建議</li>
              <li>我們不保證完成課程後必定獲得就業或加薪</li>
              <li>AI 技術發展迅速，部分內容可能隨時間變化</li>
              <li>我們盡力確保內容準確，但不對任何錯誤或遺漏承擔責任</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">9. 終止服務</h2>
            <p>我們保留在以下情況下終止或暫停您帳戶的權利：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>違反本服務條款</li>
              <li>從事欺詐行為</li>
              <li>長期未活動的帳戶（超過 24 個月）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">10. 條款修改</h2>
            <p>我們可能會不時修改這些條款。重大變更時，我們會在變更生效前至少 14 天通知您。繼續使用服務即視為接受修改後的條款。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">11. 適用法律</h2>
            <p>本條款受香港特別行政區法律管轄。任何爭議應先嘗試以協商解決，協商不成時，由香港法院管轄。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">12. 聯絡方式</h2>
            <div className="bg-[#F8FAFF] rounded-xl p-4 border border-gray-100">
              <p><strong>DeFiner Tech Ltd</strong></p>
              <p>電郵：<a href="mailto:assistant4ed@gmail.com" className="text-[#4169E1]">assistant4ed@gmail.com</a></p>
              <p>WhatsApp：<a href="https://wa.me/85257961104" className="text-[#4169E1]">+852 5796 1104</a></p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <a href="/" className="text-sm text-[#4169E1] font-semibold hover:underline">← 返回首頁</a>
        </div>
      </main>
    </div>
  );
}

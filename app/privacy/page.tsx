import type { Metadata } from 'next';

export const metadata: Metadata = { title: '私隱政策 — SkillAI.hk', description: 'SkillAI.hk 私隱政策' };

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen">
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <a href="/" className="font-black text-xl"><span className="text-[#1A1A2E]">Skill</span><span className="text-[#4169E1]">AI</span></a>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-black mb-2">私隱政策</h1>
        <p className="text-sm text-gray-400 mb-10">最後更新：2026 年 2 月 27 日</p>

        <div className="prose prose-gray prose-sm max-w-none space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">1. 簡介</h2>
            <p>SkillAI.hk（由 DeFiner Tech Ltd 營運，以下簡稱「我們」）重視您的私隱。本政策說明我們如何收集、使用、儲存和保護您的個人資料。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">2. 資料收集</h2>
            <p>我們可能收集以下類型的資料：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>帳戶資料：</strong>姓名、電郵地址、電話號碼</li>
              <li><strong>學習資料：</strong>課程進度、作業提交、考試結果</li>
              <li><strong>付款資料：</strong>付款方式資訊（由第三方支付處理商安全處理）</li>
              <li><strong>使用資料：</strong>瀏覽記錄、設備資訊、IP 地址</li>
              <li><strong>通訊資料：</strong>您與我們之間的電郵和訊息</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">3. 資料用途</h2>
            <p>我們收集的資料用於：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>提供和改善我們的教育服務</li>
              <li>處理報名和付款</li>
              <li>發送課程更新、提醒和相關通知</li>
              <li>提供客戶支援</li>
              <li>分析和改善網站表現</li>
              <li>遵守法律義務</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">4. 資料共享</h2>
            <p>我們不會出售您的個人資料。我們可能在以下情況下共享資料：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>獲得您的明確同意</li>
              <li>與服務提供商（如支付處理商、雲端服務）合作以提供服務</li>
              <li>法律要求或保護我們的合法權益</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">5. 資料安全</h2>
            <p>我們採用業界標準的安全措施保護您的資料，包括 SSL 加密傳輸、安全的資料儲存和定期安全審計。然而，沒有任何互聯網傳輸或電子儲存方法是 100% 安全的。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">6. Cookies</h2>
            <p>我們使用 Cookies 和類似技術來改善您的瀏覽體驗、分析網站流量和提供個人化內容。您可以透過瀏覽器設定管理 Cookies 偏好。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">7. 您的權利</h2>
            <p>根據《個人資料（私隱）條例》，您有權：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>查閱我們持有的您的個人資料</li>
              <li>要求更正不準確的資料</li>
              <li>要求刪除您的資料（在合理範圍內）</li>
              <li>退出行銷通訊</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">8. 資料保留</h2>
            <p>我們會在提供服務所需的期間內保留您的資料，或根據法律要求保留。帳戶刪除後，我們會在 30 天內刪除或匿名化您的個人資料。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">9. 兒童私隱</h2>
            <p>我們的服務面向 16 歲及以上人士。我們不會故意收集 16 歲以下兒童的個人資料。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">10. 政策更新</h2>
            <p>我們可能會不時更新本政策。重大變更時，我們會透過電郵或網站通知您。建議您定期查閱本頁面。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1A1A2E]">11. 聯絡方式</h2>
            <p>如有任何關於私隱的查詢，請聯絡：</p>
            <div className="bg-[#F8FAFF] rounded-xl p-4 border border-gray-100 mt-2">
              <p><strong>DeFiner Tech Ltd</strong></p>
              <p>電郵：<a href="mailto:assistant4ed@gmail.com" className="text-[#4169E1]">assistant4ed@gmail.com</a></p>
              <p>WhatsApp：<a href="https://wa.me/85267552667" className="text-[#4169E1]">+852 6755 2667</a></p>
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

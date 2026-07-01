const DOMAINS = [
  { id: 1, title: 'Genel Güvenlik Kavramları', weight: 12, color: 'bg-blue-500', bar: 'w-[12%]' },
  { id: 2, title: 'Tehditler, Zafiyetler ve Önlemler', weight: 22, color: 'bg-rose-500', bar: 'w-[22%]' },
  { id: 3, title: 'Güvenlik Mimarisi', weight: 18, color: 'bg-amber-500', bar: 'w-[18%]' },
  { id: 4, title: 'Güvenlik Operasyonları', weight: 28, color: 'bg-emerald-500', bar: 'w-[28%]' },
  { id: 5, title: 'Güvenlik Programı Yönetimi', weight: 20, color: 'bg-violet-500', bar: 'w-[20%]' },
]

const QTYPES = [
  {
    type: 'Çoktan Seçmeli (Tek Cevap)',
    en: 'Multiple Choice — Single Answer',
    desc: 'Dört şıktan en doğru birini seç. En yaygın format.',
    tip: '"En iyi", "önce", "ilk" gibi kelimeler kritik — mutlak doğruyu değil en uygun cevabı ara.',
    pct: '~60%',
    color: 'border-blue-500/40 bg-blue-500/5',
    label: 'text-blue-300',
  },
  {
    type: 'Çoktan Seçmeli (Çoklu Cevap)',
    en: 'Multiple Choice — Multiple Answer',
    desc: 'Kaç şık seçmen gerektiği belirtilir (örn. "İki tanesini seç").',
    tip: 'Soru kaç tane söylüyorsa o kadar seç — ne eksik ne fazla. Tahmin etme.',
    pct: '~15%',
    color: 'border-amber-500/40 bg-amber-500/5',
    label: 'text-amber-300',
  },
  {
    type: 'Performans Bazlı (PBQ)',
    en: 'Performance-Based Question',
    desc: 'Eşleştirme, sıralama, simülasyon. Sınav başında 3-5 adet çıkar.',
    tip: 'PBQ\'ya 5-8 dk harca, bitiremiyorsan işaretle geç — normal sorular daha hızlı puan.',
    pct: '~15%',
    color: 'border-purple-500/40 bg-purple-500/5',
    label: 'text-purple-300',
  },
  {
    type: 'Sürükle-Bırak / Sıralama',
    en: 'Drag-and-Drop / Ordering',
    desc: 'Adımları doğru sıraya diz veya etiketleri doğru yere yerleştir.',
    tip: 'Şüphe varsa eleme yöntemi: kesin yanlışları önce çıkar.',
    pct: '~10%',
    color: 'border-cyan-500/40 bg-cyan-500/5',
    label: 'text-cyan-300',
  },
]

export default function ExamInfoPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Sınav Yapısı</h1>
        <p className="text-slate-400 text-sm mt-1">CompTIA Security+ SY0-701 — resmi sınav formatı</p>
      </div>

      {/* Key numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Soru Sayısı', value: '≤ 90', sub: 'maksimum' },
          { label: 'Süre', value: '90 dk', sub: '~1 dk/soru' },
          { label: 'Geçme Puanı', value: '750', sub: '900 üzerinden' },
          { label: 'Geçme Oranı', value: '%83', sub: 'yaklaşık eşik' },
          { label: 'Min. Doğru Soru', value: '~75', sub: '90 sorudan' },
          { label: 'Max. Yanlış', value: '~15', sub: 'yapabilirsin' },
          { label: 'PBQ Sayısı', value: '3–5', sub: 'sınav başında' },
          { label: 'Soru Tipleri', value: '4', sub: 'format' },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            <div className="text-xs text-slate-600 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Score note */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200 leading-relaxed">
        <b className="text-amber-300">Puanlama:</b> Sorular 100–900 arası ölçeklenir (linear değil). 750 puan almak için yaklaşık %83 doğruluk şart.
        Yanlış cevap puan düşürmez — boş bırakma, her soruyu cevapla.
      </div>

      {/* Domain weights */}
      <div className="card p-5 space-y-4">
        <div className="text-sm font-semibold text-white">Domain Ağırlıkları</div>
        {DOMAINS.map((d) => (
          <div key={d.id} className="space-y-1.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${d.color}`} />
                <span className="text-sm text-slate-200">D{d.id} · {d.title}</span>
              </div>
              <span className="text-sm font-bold text-white">%{d.weight}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${d.color} ${d.bar}`} />
            </div>
            <p className="text-xs text-slate-500">
              90 soruda yaklaşık <b className="text-slate-400">{Math.round(90 * d.weight / 100)}</b> soru
            </p>
          </div>
        ))}
      </div>

      {/* Question types */}
      <div>
        <div className="text-sm font-semibold text-white mb-3">Soru Tipleri</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {QTYPES.map((q) => (
            <div key={q.type} className={`rounded-xl border p-4 space-y-2 ${q.color}`}>
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className={`text-sm font-semibold ${q.label}`}>{q.type}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{q.en}</div>
                </div>
                <span className={`text-xs font-mono font-bold flex-shrink-0 ${q.label}`}>{q.pct}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{q.desc}</p>
              <div className="border-t border-white/5 pt-2">
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="text-slate-300 font-semibold">Taktik: </span>{q.tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy */}
      <div className="card p-5 space-y-2">
        <div className="text-sm font-semibold text-white mb-1">Sınav Stratejisi</div>
        {[
          'PBQ soruları genellikle en başta çıkar. 5-8 dk harca, bitmiyorsa işaretle geç.',
          '"Always", "never", "only", "best" gibi mutlak ifadeler çeldiricilerde sıkça kullanılır.',
          'İki şık arasında kaldıysan; daha geniş kapsamlı olan genellikle doğrudur.',
          'İlk sezgini değiştirme — ikinci değiştirme çoğunlukla yanlış çıkar.',
          'Tüm soruları cevapla. Yanlış cevap, boş bırakmaktan kötü değil.',
          'Sınav bilgisayar adaptif değil — tüm sorular sabit, sıra önemli değil.',
        ].map((tip, i) => (
          <div key={i} className="flex gap-2 text-sm text-slate-300">
            <span className="text-slate-600 font-mono flex-shrink-0">{i + 1}.</span>
            <span className="leading-relaxed">{tip}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

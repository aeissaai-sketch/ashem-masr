const stocksData = [
  {
    "name": "زهراء المعادي للاستثمار والتعمير",
    "symbol": "ZMID",
    "isin": "ZMID",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "اية كابيتال القابضة",
    "symbol": "ACAP",
    "isin": "ACAP",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "طاقة عربية",
    "symbol": "TAQA",
    "isin": "TAQA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الوطنية للطباعة",
    "symbol": "NAPR",
    "isin": "NAPR",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "اكت فاينانشال للاستشارات",
    "symbol": "ACTF",
    "isin": "ACTF",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "أم بي للهندسةM.B",
    "symbol": "MBEG",
    "isin": "MBEG",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "لوتس للتنمية والاستثمار الزراعى",
    "symbol": "LUTS",
    "isin": "LUTS",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "المصرف المتحد",
    "symbol": "UBEE",
    "isin": "UBEE",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "ارابيا للاستثمار والتنمية",
    "symbol": "AIDC",
    "isin": "AIDC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "بريميم هيلثكير جروب",
    "symbol": "PHGC",
    "isin": "PHGC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "بنيان للتنمية والتجارة",
    "symbol": "BONY",
    "isin": "BONY",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الدولية للأسمدة والكيماويات",
    "symbol": "ICFC",
    "isin": "ICFC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "جورميه ايجيبت دوت كوم للاغذية",
    "symbol": "GOUR",
    "isin": "GOUR",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العالمية للاستثمار والتنمية",
    "symbol": "ICID",
    "isin": "ICID",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "ام.ام جروب للصناعة والتجارة العالمية",
    "symbol": "MTIE",
    "isin": "MTIE",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "ديجيتايز للاستثمار والتقنية",
    "symbol": "DGTZ",
    "isin": "DGTZ",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "فيركيم مصر للاسمدة والكيماويات",
    "symbol": "FACT",
    "isin": "FACT",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "يو للتمويل الاستهلاكى",
    "symbol": "VALU",
    "isin": "VALU",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "جو جرين للاستثمار الزراعى والتنمية",
    "symbol": "GGRN",
    "isin": "GGRN",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "اي فاينانس للاستثمارات المالية والرقمية",
    "symbol": "EFIH",
    "isin": "EFIH",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مرسيليا المصرية الخليجية للاستثمار العقارى",
    "symbol": "MAAL",
    "isin": "EGS739Z1C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS739Z1C016"
  },
  {
    "name": "شارم دريمز للاستثمار السياحى",
    "symbol": "SDTI",
    "isin": "SDTI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الاسماعيلية الوطنية للصناعات الغذائية (فوديكو)",
    "symbol": "INFI",
    "isin": "INFI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "القاهرة للدواجن",
    "symbol": "POUL",
    "isin": "POUL",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الجيزةالعامة للمقاولات والاستثمارالعقارى",
    "symbol": "GGCC",
    "isin": "EGS21541C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS21541C015"
  },
  {
    "name": "شركة النصر للأعمال المدنية",
    "symbol": "NCCW",
    "isin": "NCCW",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "المصرية للدواجن",
    "symbol": "EPCO",
    "isin": "EPCO",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مجموعة النعيم العقارية القابضة",
    "symbol": "NARE",
    "isin": "NARE",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "جى بى اى للنمو العمرانى",
    "symbol": "GPED",
    "isin": "GPED",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "قناة السويس لتوطين التكنولوجيا",
    "symbol": "SCTS",
    "isin": "SCTS",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "راية القابضة للأستثمارات المالية",
    "symbol": "RAYA",
    "isin": "RAYA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العامة لصناعة الورق - راكتا",
    "symbol": "RAKT",
    "isin": "RAKT",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "ابوقير للاسمدة والصناعات الكيماوية",
    "symbol": "ABUK",
    "isin": "ABUK",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الزيوت المستخلصة ومنتجاتها",
    "symbol": "ZEOT",
    "isin": "ZEOT",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الصناعات الكيماوية المصرية - كيما",
    "symbol": "EGCH",
    "isin": "EGCH",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مطاحن ومخابز شمال القاهرة",
    "symbol": "MILS",
    "isin": "MILS",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مطاحن ومخابز الاسكندرية",
    "symbol": "AFMC",
    "isin": "AFMC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مطاحن وسط وغرب الدلتا",
    "symbol": "WCDF",
    "isin": "WCDF",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مطاحن مصر الوسطي",
    "symbol": "CEFM",
    "isin": "CEFM",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العربية لحليج الأقطان",
    "symbol": "ACGC",
    "isin": "ACGC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "النساجون الشرقيون للسجاد",
    "symbol": "ORWE",
    "isin": "ORWE",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العربية للادوية والصناعات الكيماوية",
    "symbol": "ADCI",
    "isin": "ADCI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "القاهرة للادوية والصناعات الكيماوية",
    "symbol": "CPCI",
    "isin": "CPCI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "غاز مصر",
    "symbol": "EGAS",
    "isin": "EGS39011C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS39011C019"
  },
  {
    "name": "روبكس العالميه لتصنيع البلاستيك والاكريلك",
    "symbol": "RUBX",
    "isin": "RUBX",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "ليسيكو مصر",
    "symbol": "LCSW",
    "isin": "LCSW",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مصر للاسمنت - قنا",
    "symbol": "MCQE",
    "isin": "MCQE",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "اجواء للصناعات الغذائية - مصر",
    "symbol": "AJWA",
    "isin": "AJWA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "البنك المصري لتنمية الصادرات",
    "symbol": "EXPA",
    "isin": "EXPA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "المهندس للتأمين",
    "symbol": "MOIN",
    "isin": "MOIN",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مجموعة اي اف جي القابضة",
    "symbol": "HRHO",
    "isin": "HRHO",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الشمس للاسكان والتعمير",
    "symbol": "ELSH",
    "isin": "ELSH",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "المجموعه المصريه العقاريه",
    "symbol": "AREH",
    "isin": "AREH",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "رمكو لانشاء القرى السياحيه",
    "symbol": "RTVC",
    "isin": "RTVC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "اوراسكوم للتنمية مصر",
    "symbol": "ORHD",
    "isin": "ORHD",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الغربية الاسلامية للتنمية العمرانية",
    "symbol": "GIHD",
    "isin": "GIHD",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مدينة مصر للاسكان والتعمير",
    "symbol": "MASR",
    "isin": "MASR",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "السادس من اكتوبر للتنميه والاستثمار- سوديك",
    "symbol": "OCDI",
    "isin": "OCDI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "اصول E.S.B. للوساطة في الاوراق المالية",
    "symbol": "EBSC",
    "isin": "EBSC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مصر للفنادق",
    "symbol": "MHOT",
    "isin": "EGS70081C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS70081C012"
  },
  {
    "name": "العربية لمنتجات الألبان\" آراب ديرى - باندا\"",
    "symbol": "ADPC",
    "isin": "ADPC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "المصريه لمدينة الانتاج الاعلامى",
    "symbol": "MPRC",
    "isin": "MPRC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "سماد مصر (ايجيفرت)",
    "symbol": "SMFR",
    "isin": "SMFR",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "بنك قطر الوطني",
    "symbol": "QNBE",
    "isin": "QNBE",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العربية للصناعات الهندسية",
    "symbol": "EEII",
    "isin": "EEII",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "المصرية لخدمات النقل (ايجيترانس)",
    "symbol": "ETRS",
    "isin": "ETRS",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الاسكندرية لتداول الحاويات والبضائع",
    "symbol": "ALCN",
    "isin": "ALCN",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "اوراسكوم كونستراكشون بي ال سي",
    "symbol": "ORAS",
    "isin": "ORAS",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "بى انفستمنتس القابضه",
    "symbol": "BINV",
    "isin": "BINV",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الوادى العالمية للاستثمار و التنمية",
    "symbol": "ELWA",
    "isin": "ELWA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "جهينة للصناعات الغذائية",
    "symbol": "JUFO",
    "isin": "EGS30901C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30901C010"
  },
  {
    "name": "ايديتا للصناعات الغذائية",
    "symbol": "EFID",
    "isin": "EFID",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العربية للاسمنت",
    "symbol": "ARCC",
    "isin": "EGS3C0O1C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3C0O1C016"
  },
  {
    "name": "كونتكت المالية القابضة",
    "symbol": "CNFN",
    "isin": "CNFN",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "ماكرو جروب للمستحضرات الطبية-ماكرو كابيتال",
    "symbol": "MCRO",
    "isin": "MCRO",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "ابن سينا فارما",
    "symbol": "ISPH",
    "isin": "ISPH",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "جلاكسو سميثكلاين",
    "symbol": "BIOC",
    "isin": "BIOC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "المالية و الصناعية المصرية",
    "symbol": "EFIC",
    "isin": "EFIC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العربية لاستصلاح الاراضي",
    "symbol": "EALR",
    "isin": "EALR",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الكابلات الكهربائية المصرية",
    "symbol": "ELEC",
    "isin": "ELEC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "نهر الخير للتنمية والأستثمار الزراعى والخدمات البيئية",
    "symbol": "KRDI",
    "isin": "KRDI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "بايونيرز بروبرتيز للتنمية العمرانية بي ار اي جروب",
    "symbol": "PRDC",
    "isin": "PRDC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "جدوى للتنمية الصناعية",
    "symbol": "GDWA",
    "isin": "GDWA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "المصرية لنظم التعليم الحديثة",
    "symbol": "MOED",
    "isin": "EGS729F1C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS729F1C012"
  },
  {
    "name": "العامة لاستصلاح الاراضي و التنمية و التعمير",
    "symbol": "AALR",
    "isin": "AALR",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "وادي كوم امبو لاستصلاح الاراضي",
    "symbol": "WKOL",
    "isin": "WKOL",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الاسماعيلية مصر للدواجن",
    "symbol": "ISMA",
    "isin": "ISMA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "المنصورة للدواجن",
    "symbol": "MPCO",
    "isin": "MPCO",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الدوليه للمحاصيل الزراعيه",
    "symbol": "IFAP",
    "isin": "IFAP",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الخليجية الكندية للاستثمار العقاري العربي",
    "symbol": "CCRS",
    "isin": "CCRS",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العربيه وبولفارا للغزل والنسيج - يونيراب",
    "symbol": "APSW",
    "isin": "APSW",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الصعيد العامة للمقاولات والاستثمار العقاري SCCD",
    "symbol": "UEGC",
    "isin": "UEGC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "المشروعات الصناعية والهندسية",
    "symbol": "IEEC",
    "isin": "IEEC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "كرستمارك للمقاولات والتطوير العقاري",
    "symbol": "CRST",
    "isin": "CRST",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "بنك قناة السويس شركة مساهمة مصرية",
    "symbol": "CANA",
    "isin": "CANA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "بنك التعمير والاسكان",
    "symbol": "HDBK",
    "isin": "HDBK",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "(مجموعة عامر القابضة (عامر جروب",
    "symbol": "AMER",
    "isin": "AMER",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مصر الوطنية للصلب - عتاقة",
    "symbol": "ATQA",
    "isin": "ATQA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "بالم هيلز للتعمير",
    "symbol": "PHDC",
    "isin": "PHDC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الاهرام للطباعة و التغليف",
    "symbol": "EPPK",
    "isin": "EPPK",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "اسيك للتعدين - اسكوم",
    "symbol": "ASCM",
    "isin": "ASCM",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مينا فارم للأدوية و الصناعات الكيماوية",
    "symbol": "MIPH",
    "isin": "MIPH",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "سيدى كرير للبتروكيماويات - سيدبك",
    "symbol": "SKPC",
    "isin": "SKPC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مجموعة جى . أم . سى للاستثمارات الصناعية و التجارية المالية",
    "symbol": "GMCI",
    "isin": "GMCI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "السويدى اليكتريك",
    "symbol": "SWDY",
    "isin": "SWDY",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الشرقية - ايسترن كومباني",
    "symbol": "EAST",
    "isin": "EGS37091C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS37091C013"
  },
  {
    "name": "المصرية الدولية للصناعات الدوائية - ايبيكو",
    "symbol": "PHAR",
    "isin": "PHAR",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "يونيفرسال لصناعة مواد التعبئة و التغليف و الورق - يونيباك",
    "symbol": "UNIP",
    "isin": "UNIP",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مصر لصناعة الكيماويات",
    "symbol": "MICH",
    "isin": "EGS38211C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38211C016"
  },
  {
    "name": "ممفيس للادوية والصناعات الكيماوية",
    "symbol": "MPCI",
    "isin": "MPCI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الاسكندرية للادوية والصناعات الكيماوية",
    "symbol": "AXPH",
    "isin": "AXPH",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "النيل للادوية والصناعات الكيماوية - النيل",
    "symbol": "NIPH",
    "isin": "NIPH",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "EAC المصرية العربية (ثمار) لتداول الاوراق المالية والسندات",
    "symbol": "EASB",
    "isin": "EASB",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "النصر لتصنيع الحاصلات الزراعية",
    "symbol": "ELNA",
    "isin": "ELNA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العربية للمحابس",
    "symbol": "ARVA",
    "isin": "ARVA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "جى بى كوربوريشن",
    "symbol": "GBCO",
    "isin": "GBCO",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "سى اى كابيتال القابضة للاستثمارات المالية",
    "symbol": "CICH",
    "isin": "CICH",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مجموعة طلعت مصطفى القابضة",
    "symbol": "TMGH",
    "isin": "EGS691S1C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS691S1C011"
  },
  {
    "name": "بلتون القابضة",
    "symbol": "BTFH",
    "isin": "BTFH",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "برايم القابضة للاستثمارات المالية",
    "symbol": "PRMH",
    "isin": "PRMH",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "دلتا للطباعة والتغليف",
    "symbol": "DTPP",
    "isin": "DTPP",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "اسباير كابيتال القابضة للاستثمارات المالية",
    "symbol": "ASPI",
    "isin": "ASPI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "دايس للملابس الجاهزة",
    "symbol": "DSCW",
    "isin": "DSCW",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الاسكندرية للزيوت المعدنية",
    "symbol": "AMOC",
    "isin": "AMOC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "اكتوبر فارما",
    "symbol": "OCPH",
    "isin": "OCPH",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مطاحن شرق الدلتا",
    "symbol": "EDFM",
    "isin": "EDFM",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مطاحن مصر العليا",
    "symbol": "UEFM",
    "isin": "UEFM",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العامة للصوامع والتخزين",
    "symbol": "GSSC",
    "isin": "GSSC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مطاحن ومخابز جنوب القاهرة والجيزة",
    "symbol": "SCFM",
    "isin": "SCFM",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "القاهرة للزيوت والصابون",
    "symbol": "COSG",
    "isin": "COSG",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الاسكندرية للغزل والنسيج (سبينالكس)",
    "symbol": "SPIN",
    "isin": "SPIN",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "جولدن تكس للاصواف",
    "symbol": "GTWL",
    "isin": "GTWL",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "النصر للملابس والمنسوجات - كابو",
    "symbol": "KABO",
    "isin": "KABO",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "المصريين للاسكان والتنمية والتعمير",
    "symbol": "EHDR",
    "isin": "EHDR",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مينا للاستثمار السياحي والعقاري",
    "symbol": "MENA",
    "isin": "MENA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مصر للزيوت و الصابون",
    "symbol": "MOSC",
    "isin": "EGS38421C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38421C011"
  },
  {
    "name": "كفر الزيات للمبيدات والكيماويات",
    "symbol": "KZPC",
    "isin": "KZPC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العامة لمنتجات الخزف والصيني",
    "symbol": "PRCL",
    "isin": "PRCL",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العز للسيراميك و البورسلين - الجوهره",
    "symbol": "ECAP",
    "isin": "ECAP",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العربية للخزف - سيراميكا ريماس",
    "symbol": "CERA",
    "isin": "CERA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "اسمنت سيناء",
    "symbol": "SCEM",
    "isin": "EGS3C401C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3C401C014"
  },
  {
    "name": "مصر بنى سويف للاسمنت",
    "symbol": "MBSC",
    "isin": "MBSC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "جنوب الوادى للاسمنت",
    "symbol": "SVCE",
    "isin": "SVCE",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الدلتا للسكر",
    "symbol": "SUGR",
    "isin": "SUGR",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الشرقية الوطنية للامن الغذائي",
    "symbol": "SNFC",
    "isin": "SNFC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "بنك فيصل الاسلامي المصرية بالجنية",
    "symbol": "FAIT",
    "isin": "EGS60321C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS60321C014"
  },
  {
    "name": "الاستثمار العقاري العربي - اليكو",
    "symbol": "RREI",
    "isin": "RREI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الاهلي للتنمية والاستثمار",
    "symbol": "AFDI",
    "isin": "AFDI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "القاهرة الوطنية للاستثمار والاوراق المالية",
    "symbol": "KWIN",
    "isin": "KWIN",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الوطنية للاسكان للنقابات المهنية",
    "symbol": "NHPS",
    "isin": "NHPS",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "التعمير والاستشارات الهندسية",
    "symbol": "DAPH",
    "isin": "EGS65081C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65081C019"
  },
  {
    "name": "القاهرة للاسكان والتعمير",
    "symbol": "ELKA",
    "isin": "ELKA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "المتحدة للاسكان والتعمير",
    "symbol": "UNIT",
    "isin": "UNIT",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "رواد السياحة - الرواد",
    "symbol": "ROTO",
    "isin": "ROTO",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "بيراميزا للفنادق والقرى السياحية - بيراميزا",
    "symbol": "PHTV",
    "isin": "PHTV",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "المصرية للمنتجعات السياحية",
    "symbol": "EGTS",
    "isin": "EGTS",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مستشفى النزهه الدولي",
    "symbol": "NINH",
    "isin": "NINH",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "كوبر للاستثمار التجارى و التطوير العقارى",
    "symbol": "COPR",
    "isin": "COPR",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مصر الجديدة للاسكان والتعمير",
    "symbol": "HELI",
    "isin": "HELI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العبور للاستثمار العقارى",
    "symbol": "OBRI",
    "isin": "OBRI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "القاهره للإستثمار و التنمية العقاريه سيرا للتعليم",
    "symbol": "CIRA",
    "isin": "CIRA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "السعودية المصرية للاستثمار والتمويل",
    "symbol": "SEIG",
    "isin": "SEIG",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الملتقي العربي للاستثمارات",
    "symbol": "AMIA",
    "isin": "AMIA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الاسكندريه الوطنيه للاستثمارات الماليه",
    "symbol": "ANFI",
    "isin": "ANFI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الحديد والصلب المصرية",
    "symbol": "IRON",
    "isin": "IRON",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الالومنيوم العربية",
    "symbol": "ALUM",
    "isin": "ALUM",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الصناعات الغذائية العربية-دومتى",
    "symbol": "DOMT",
    "isin": "DOMT",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الاسكندرية للخدمات الطبية - المركز الطبى الجديد - الاسكندرية",
    "symbol": "AMES",
    "isin": "AMES",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "القاهرة للخدمات التعليمية",
    "symbol": "CAED",
    "isin": "CAED",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "شمال الصعيد للتنمية والانتاج الزراعى (نيوداب)",
    "symbol": "NEDA",
    "isin": "NEDA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مصر للاسواق الحرة",
    "symbol": "MFSC",
    "isin": "MFSC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "بنك كريدي اجريكول مصر",
    "symbol": "CIEB",
    "isin": "CIEB",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الصناعات الهندسية المعمارية للانشاء والتعمير - ايكون",
    "symbol": "ENGC",
    "isin": "ENGC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "القناة للتوكيلات الملاحية",
    "symbol": "CSAG",
    "isin": "EGS44031C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS44031C010"
  },
  {
    "name": "المصرية للاتصالات",
    "symbol": "ETEL",
    "isin": "EGS48031C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS48031C016"
  },
  {
    "name": "راية لخدمات مراكز الاتصالات",
    "symbol": "RACC",
    "isin": "RACC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "A.T.LEASEالتوفيق للتأجير التمويلي -أية.تي.ليس",
    "symbol": "ATLC",
    "isin": "EGS676N1C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS676N1C015"
  },
  {
    "name": "إعمار مصر للتنمية",
    "symbol": "EMFD",
    "isin": "EMFD",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مصر لإنتاج الأسمدة - موبكو",
    "symbol": "MFPC",
    "isin": "MFPC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "المطورون العرب القابضة",
    "symbol": "ARAB",
    "isin": "EGS694A1C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS694A1C018"
  },
  {
    "name": "البنك التجاري الدولي -مصر (سى اى بى )",
    "symbol": "COMI",
    "isin": "EGS60121C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS60121C018"
  },
  {
    "name": "مصرف أبو ظبي الأسلامي- مصر",
    "symbol": "ADIB",
    "isin": "ADIB",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "بنك البركة مصر",
    "symbol": "SAUD",
    "isin": "SAUD",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "مصر للالومنيوم",
    "symbol": "EGAL",
    "isin": "EGAL",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "جراند انفستمنت القابضة للاستثمارات المالية",
    "symbol": "GRCA",
    "isin": "GRCA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الاسماعيلية الجديدة للتطوير والتنمية العمرانية-شركة منقسمة",
    "symbol": "IDRE",
    "isin": "IDRE",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "القلعة للاستثمارات المالية",
    "symbol": "CCAP",
    "isin": "CCAP",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العبوات الطبية",
    "symbol": "MEPA",
    "isin": "MEPA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "اوراسكوم للاستثمار القابضه",
    "symbol": "OIH",
    "isin": "EGS693V1C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS693V1C014"
  },
  {
    "name": "اطلس للاستثمار والصناعات الغذائية",
    "symbol": "AIFI",
    "isin": "AIFI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "سبأ الدولية للأدوية والصناعات الكيماوية",
    "symbol": "SIPC",
    "isin": "SIPC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "عبور لاند للصناعات الغذائية",
    "symbol": "OLFI",
    "isin": "OLFI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "شركة مستشفي كليوباترا",
    "symbol": "CLHO",
    "isin": "CLHO",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "او بي المالية القابضة",
    "symbol": "OFH",
    "isin": "OFH",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الشركة العربية لادارة وتطوير الاصول",
    "symbol": "ACAMD",
    "isin": "ACAMD",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الحديد والصلب للمناجم والمحاجر",
    "symbol": "ISMQ",
    "isin": "ISMQ",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "فالمور القابضة للاستثماربالجنية",
    "symbol": "VLMRA",
    "isin": "VLMRA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العاشر من رمضان للصناعات الدوائية والمستحضرات تشخيصية-راميدا",
    "symbol": "RMDA",
    "isin": "RMDA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "تنمية للاستثمار العقاري",
    "symbol": "TANM",
    "isin": "TANM",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "فوري لتكنولوجيا البنوك والمدفوعات الالكترونية",
    "symbol": "FWRY",
    "isin": "FWRY",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "سبيد ميديكال",
    "symbol": "SPMD",
    "isin": "SPMD",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "Taaleem Management Services تعليم لخدمات الإدارة",
    "symbol": "TALM",
    "isin": "TALM",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "انترناشيونال بزنيس كوربوريشن للتجارة والتوكيلات التجارية",
    "symbol": "IBCT",
    "isin": "IBCT",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "AIHC",
    "symbol": "AIHC",
    "isin": "AIHC",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الاتحاد الصيدلي للخدمات الطبية والاستثمار",
    "symbol": "UPMS",
    "isin": "UPMS",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "العروبة للسمسرة فى الأوراق المالية",
    "symbol": "EOSB",
    "isin": "EOSB",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "صندوق بلتون وفرة شريعة",
    "symbol": "BWA",
    "isin": "BWA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "هيبكو للاستثمارات التجارية والتنمية العقارية",
    "symbol": "HBCO",
    "isin": "HBCO",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "بي اي دي- البدر للاستثمار والتنمية",
    "symbol": "BIDI",
    "isin": "BIDI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "ركاز القابضة للاستثمارات المالية",
    "symbol": "RKAZ",
    "isin": "RKAZ",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "المصرية الكويتية للأستثمار والتجارة",
    "symbol": "MKIT",
    "isin": "MKIT",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "بى اى جى للتجارة والاستثمار",
    "symbol": "BIGP",
    "isin": "BIGP",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "يوتوبيا للاستثمار العقارى والسياحى",
    "symbol": "UTOP",
    "isin": "UTOP",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "نوفيدا للإستثمار والتكنولوجيا",
    "symbol": "AMPI",
    "isin": "AMPI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الدولية للصناعات الطبية ايكمي",
    "symbol": "ICMI",
    "isin": "ICMI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الفنار للمقاولات العمومية والإنشاءات والتجارة والاستيراد",
    "symbol": "FNAR",
    "isin": "FNAR",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "الاولي للاستثمار والتنمية العقارية",
    "symbol": "FIRE",
    "isin": "FIRE",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "المجموعة المتكاملة للأعمال الهندسية",
    "symbol": "INEG",
    "isin": "INEG",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "فرتيكا للصناعة و التجارة",
    "symbol": "VERT",
    "isin": "VERT",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "اراب للتنمية والاستثمار العقاري",
    "symbol": "ADRI",
    "isin": "ADRI",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "فتنس برايم للاندية الصحية",
    "symbol": "FTNS",
    "isin": "FTNS",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "حق اكتتاب شركة توسع للتخصيم -1",
    "symbol": "TWSA",
    "isin": "TWSA",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  },
  {
    "name": "ارابيا انفستمنتس هولدنج",
    "symbol": "AIH",
    "isin": "AIH",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx"
  }
];
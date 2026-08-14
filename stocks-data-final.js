const stocksData = [
  {
    "name": "مرسيليا المصرية الخليجية للاستثمار العقارى",
    "symbol": "MAAL",
    "isin": "EGS739Z1C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS739Z1C016"
  },
  {
    "name": "المصرية لنظم التعليم الحديثة",
    "symbol": "MOED",
    "isin": "EGS729F1C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS729F1C012"
  },
  {
    "name": "الجيزةالعامة للمقاولات والاستثمارالعقارى",
    "symbol": "GGCC",
    "isin": "EGS21541C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS21541C015"
  },
  {
    "name": "مصر لصناعة الكيماويات",
    "symbol": "MICH",
    "isin": "EGS38211C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38211C016"
  },
  {
    "name": "التعمير والاستشارات الهندسية",
    "symbol": "DAPH",
    "isin": "EGS65081C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65081C019"
  },
  {
    "name": "القناة للتوكيلات الملاحية",
    "symbol": "CSAG",
    "isin": "EGS44031C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS44031C010"
  },
  {
    "name": "جهينة للصناعات الغذائية",
    "symbol": "JUFO",
    "isin": "EGS30901C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30901C010"
  },
  {
    "name": "بنك فيصل الاسلامي المصرية بالجنية",
    "symbol": "FAIT",
    "isin": "EGS60321C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS60321C014"
  },
  {
    "name": "المصرية للأقمار الصناعية (نايل سات)",
    "symbol": "EGSA",
    "isin": "EGS48022C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS48022C015"
  },
  {
    "name": "جيتكس للاستثمارات التجارية والصناعية",
    "symbol": "GTEX",
    "isin": "EGS59U92C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS59U92C011"
  },
  {
    "name": "حق اكتتاب شركة التوفيق للتأجير التمويلى - اية.تي.ليس 3",
    "symbol": "ATLC_r3",
    "isin": "EGS923X1C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS923X1C014"
  },
  {
    "name": "لوتس للتنمية والاستثمار الزراعى",
    "symbol": "LUTS",
    "isin": "EGS07661C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS07661C019"
  },
  {
    "name": "يو للتمويل الاستهلاكى",
    "symbol": "VALU",
    "isin": "EGS505Z1C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS505Z1C018"
  },
  {
    "name": "بنيان للتنمية والتجارة",
    "symbol": "BONY",
    "isin": "EGS656M1C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS656M1C010"
  },
  {
    "name": "وادي كوم امبو لاستصلاح الاراضي",
    "symbol": "WKOL",
    "isin": "EGS01071C017",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS01071C017"
  },
  {
    "name": "ارابيا انفستمنتس هولدنج",
    "symbol": "AIH",
    "isin": "EGS21351C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS21351C019"
  },
  {
    "name": "الدوليه للمحاصيل الزراعيه",
    "symbol": "IFAP",
    "isin": "EGS07061C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS07061C012"
  },
  {
    "name": "العربيه وبولفارا للغزل والنسيج - يونيراب",
    "symbol": "APSW",
    "isin": "EGS32331C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS32331C018"
  },
  {
    "name": "الصعيد العامة للمقاولات والاستثمار العقاري SCCD",
    "symbol": "UEGC",
    "isin": "EGS21531C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS21531C016"
  },
  {
    "name": "بنك قناة السويس شركة مساهمة مصرية",
    "symbol": "CANA",
    "isin": "EGS60231C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS60231C015"
  },
  {
    "name": "مصر الوطنية للصلب - عتاقة",
    "symbol": "ATQA",
    "isin": "EGS3D0C1C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3D0C1C018"
  },
  {
    "name": "النعيم القابضة للاستثمارات",
    "symbol": "NAHO",
    "isin": "EGS69182C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS69182C011"
  },
  {
    "name": "بالم هيلز للتعمير",
    "symbol": "PHDC",
    "isin": "EGS655L1C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS655L1C012"
  },
  {
    "name": "اسيك للتعدين - اسكوم",
    "symbol": "ASCM",
    "isin": "EGS10001C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS10001C013"
  },
  {
    "name": "قناة السويس لتوطين التكنولوجيا",
    "symbol": "SCTS",
    "isin": "EGS740C1C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS740C1C010"
  },
  {
    "name": "السويدى اليكتريك",
    "symbol": "SWDY",
    "isin": "EGS3G0Z1C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3G0Z1C014"
  },
  {
    "name": "الشرقية - ايسترن كومباني",
    "symbol": "EAST",
    "isin": "EGS37091C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS37091C013"
  },
  {
    "name": "ابوقير للاسمدة والصناعات الكيماوية",
    "symbol": "ABUK",
    "isin": "EGS38191C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38191C010"
  },
  {
    "name": "الزيوت المستخلصة ومنتجاتها",
    "symbol": "ZEOT",
    "isin": "EGS38251C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38251C012"
  },
  {
    "name": "ممفيس للادوية والصناعات الكيماوية",
    "symbol": "MPCI",
    "isin": "EGS38351C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38351C010"
  },
  {
    "name": "EAC المصرية العربية (ثمار) لتداول الاوراق المالية والسندات",
    "symbol": "EASB",
    "isin": "EGS681D1C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS681D1C010"
  },
  {
    "name": "سى اى كابيتال القابضة للاستثمارات المالية",
    "symbol": "CICH",
    "isin": "EGS691D1C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS691D1C018"
  },
  {
    "name": "بلتون القابضة",
    "symbol": "BTFH",
    "isin": "EGS691G1C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS691G1C015"
  },
  {
    "name": "العروبة للسمسرة فى الأوراق المالية",
    "symbol": "EOSB",
    "isin": "EGS681I1C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS681I1C015"
  },
  {
    "name": "دايس للملابس الجاهزة",
    "symbol": "DSCW",
    "isin": "EGS33321C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS33321C018"
  },
  {
    "name": "اكتوبر فارما",
    "symbol": "OCPH",
    "isin": "EGS380R1C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS380R1C018"
  },
  {
    "name": "مطاحن شرق الدلتا",
    "symbol": "EDFM",
    "isin": "EGS30361C017",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30361C017"
  },
  {
    "name": "العامة للصوامع والتخزين",
    "symbol": "GSSC",
    "isin": "EGS30441C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30441C016"
  },
  {
    "name": "مطاحن ومخابز جنوب القاهرة والجيزة",
    "symbol": "SCFM",
    "isin": "EGS30411C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30411C010"
  },
  {
    "name": "الاسكندرية للغزل والنسيج (سبينالكس)",
    "symbol": "SPIN",
    "isin": "EGS32041C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS32041C013"
  },
  {
    "name": "النصر للملابس والمنسوجات - كابو",
    "symbol": "KABO",
    "isin": "EGS33061C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS33061C010"
  },
  {
    "name": "مينا للاستثمار السياحي والعقاري",
    "symbol": "MENA",
    "isin": "EGS65441C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65441C015"
  },
  {
    "name": "كفر الزيات للمبيدات والكيماويات",
    "symbol": "KZPC",
    "isin": "EGS38411C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38411C012"
  },
  {
    "name": "روبكس العالميه لتصنيع البلاستيك والاكريلك",
    "symbol": "RUBX",
    "isin": "EGS3A221C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3A221C018"
  },
  {
    "name": "ليسيكو مصر",
    "symbol": "LCSW",
    "isin": "EGS3C161C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3C161C014"
  },
  {
    "name": "مصر للاسمنت - قنا",
    "symbol": "MCQE",
    "isin": "EGS3C371C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3C371C019"
  },
  {
    "name": "اجواء للصناعات الغذائية - مصر",
    "symbol": "AJWA",
    "isin": "EGS30211C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30211C014"
  },
  {
    "name": "البنك المصري لتنمية الصادرات",
    "symbol": "EXPA",
    "isin": "EGS60241C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS60241C014"
  },
  {
    "name": "الاهلي للتنمية والاستثمار",
    "symbol": "AFDI",
    "isin": "EGS69021C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS69021C011"
  },
  {
    "name": "القابضة المصرية الكويتية",
    "symbol": "EKHO",
    "isin": "EGS69082C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS69082C013"
  },
  {
    "name": "الشمس للاسكان والتعمير",
    "symbol": "ELSH",
    "isin": "EGS65091C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65091C018"
  },
  {
    "name": "المتحدة للاسكان والتعمير",
    "symbol": "UNIT",
    "isin": "EGS65061C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65061C011"
  },
  {
    "name": "رمكاز لانشاء القرى السياحيه",
    "symbol": "RTVC",
    "isin": "EGS70281C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS70281C018"
  },
  {
    "name": "اوراسكوم للتنمية مصر",
    "symbol": "ORHD",
    "isin": "EGS70321C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS70321C012"
  },
  {
    "name": "كوبر للاستثمار التجارى و التطوير العقارى",
    "symbol": "COPR",
    "isin": "EGS65511C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65511C015"
  },
  {
    "name": "العبور للاستثمار العقارى",
    "symbol": "OBRI",
    "isin": "EGS65551C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65551C011"
  },
  {
    "name": "السادس من اكتوبر للتنميه والاستثمار- سوديك",
    "symbol": "OCDI",
    "isin": "EGS65571C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65571C019"
  },
  {
    "name": "الملتقي العربي للاستثمارات",
    "symbol": "AMIA",
    "isin": "EGS67221C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS67221C019"
  },
  {
    "name": "الاسكندريه الوطنيه للاستثمارات الماليه",
    "symbol": "ANFI",
    "isin": "EGS67331C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS67331C016"
  },
  {
    "name": "مصر للفنادق",
    "symbol": "MHOT",
    "isin": "EGS70081C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS70081C012"
  },
  {
    "name": "العربية لمنتجات الألبان \"آراب ديرى - باندا\"",
    "symbol": "ADPC",
    "isin": "EGS30221C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30221C013"
  },
  {
    "name": "ام.ام جروب للصناعة والتجارة العالمية",
    "symbol": "MTIE",
    "isin": "EGS75011C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS75011C014"
  },
  {
    "name": "سماد مصر (ايجيفرت)",
    "symbol": "SMFR",
    "isin": "EGS51191C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS51191C012"
  },
  {
    "name": "بنك قطر الوطني",
    "symbol": "QNBE",
    "isin": "EGS60081C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS60081C014"
  },
  {
    "name": "العربية للصناعات الهندسية",
    "symbol": "EEII",
    "isin": "EGS3G231C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3G231C011"
  },
  {
    "name": "المصرية لخدمات النقل (ايجيترانس)",
    "symbol": "ETRS",
    "isin": "EGS42051C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS42051C010"
  },
  {
    "name": "دمياط لتداول الحاويات والبضائع",
    "symbol": "DCCC",
    "isin": "EGS42101C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS42101C013"
  },
  {
    "name": "راية لخدمات مراكز الاتصالات",
    "symbol": "RACC",
    "isin": "EGS74191C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS74191C015"
  },
  {
    "name": "اوراسكوم كونستراكشون بي ال سي",
    "symbol": "ORAS",
    "isin": "EGS95001C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS95001C011"
  },
  {
    "name": "بى انفستمنتس القابضه",
    "symbol": "BINV",
    "isin": "EGS691T1C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS691T1C010"
  },
  {
    "name": "بنك الشركة المصرفية العربية الدولية- شركة مساهمة مصرية",
    "symbol": "SAIB",
    "isin": "EGS60142C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS60142C014"
  },
  {
    "name": "بنك البركة مصر",
    "symbol": "SAUD",
    "isin": "EGS60101C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS60101C010"
  },
  {
    "name": "مصر للالومنيوم",
    "symbol": "EGAL",
    "isin": "EGS3D061C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3D061C015"
  },
  {
    "name": "الاسماعيلية الجديدة للتطوير والتنمية العمرانية-شركة منقسمة",
    "symbol": "IDRE",
    "isin": "EGS214Q1C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS214Q1C011"
  },
  {
    "name": "القلعة للاستثمارات المالية - اسهم ممتازة",
    "symbol": "CCAPP",
    "isin": "EGS73541P048",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS73541P048"
  },
  {
    "name": "اطلس للاستثمار والصناعات الغذائية",
    "symbol": "AIFI",
    "isin": "EGS071L1C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS071L1C018"
  },
  {
    "name": "ايديتا للصناعات الغذائية",
    "symbol": "EFID",
    "isin": "EGS305I1C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS305I1C011"
  },
  {
    "name": "العربية للاسمنت",
    "symbol": "ARCC",
    "isin": "EGS3C0O1C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3C0O1C016"
  },
  {
    "name": "اوراسكوم المالية القابضة",
    "symbol": "OFH",
    "isin": "EGS696S1C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS696S1C016"
  },
  {
    "name": "القابضة المصرية الكويتية بالجنية",
    "symbol": "EKHOA",
    "isin": "EGS69081C023",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS69081C023"
  },
  {
    "name": "تنمية للاستثمار العقاري",
    "symbol": "TANM",
    "isin": "EGS21EB1C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS21EB1C011"
  },
  {
    "name": "اية كابيتال القابضة",
    "symbol": "ACAP",
    "isin": "EGS697S1C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS697S1C015"
  },
  {
    "name": "طاقة عربية",
    "symbol": "TAQA",
    "isin": "EGS490S1C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS490S1C014"
  },
  {
    "name": "الوطنية للطباعة",
    "symbol": "NAPR",
    "isin": "EGS370O1C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS370O1C013"
  },
  {
    "name": "اكت فاينانشال للاستشارات",
    "symbol": "ACTF",
    "isin": "EGS7D5P1C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS7D5P1C019"
  },
  {
    "name": "ديجيتايز للاستثمار والتقنية",
    "symbol": "DGTZ",
    "isin": "EGS745L1C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS745L1C014"
  },
  {
    "name": "ام بي للهندسةM.B",
    "symbol": "MBEG",
    "isin": "EGS221V1C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS221V1C015"
  },
  {
    "name": "حق اكتتاب شركة اسمنت سيناء -2",
    "symbol": "SCEM_r2",
    "isin": "EGS923M1C017",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS923M1C017"
  },
  {
    "name": "حق اكتتاب شركة المطورون العرب القابضة-1",
    "symbol": "ARAB_r1",
    "isin": "EGS923V1C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS923V1C016"
  },
  {
    "name": "حق اكتتاب شركة النصر للملابس والمنسوجات-كابو-3",
    "symbol": "KABO_r3",
    "isin": "EGS923W1C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS923W1C015"
  },
  {
    "name": "مجموعة الأهلى للزراعات الحديثة",
    "symbol": "AAGR",
    "isin": "EGS07331C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS07331C019"
  },
  {
    "name": "المصرف المتحد",
    "symbol": "UBEE",
    "isin": "EGS600M1C017",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS600M1C017"
  },
  {
    "name": "جو جرين للاستثمار الزراعى والتنمية",
    "symbol": "GGRN",
    "isin": "EGS07GV1C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS07GV1C012"
  },
  {
    "name": "قرة لمشروعات الطاقة والاستثمار",
    "symbol": "KORA",
    "isin": "EGS07911C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS07911C018"
  },
  {
    "name": "الدولية للأسمدة والكيماويات",
    "symbol": "ICFC",
    "isin": "EGS520D1C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS520D1C015"
  },
  {
    "name": "كاتليست بارتنرز ميديل ايست",
    "symbol": "CPME",
    "isin": "EGS698X1C017",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS698X1C017"
  },
  {
    "name": "شارع دريمز للاستثمار السياحى",
    "symbol": "SDTI",
    "isin": "EGS70571C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS70571C012"
  },
  {
    "name": "العامة لاستصلاح الاراضي و التنمية و التعمير",
    "symbol": "AALR",
    "isin": "EGS01081C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS01081C016"
  },
  {
    "name": "الاسماعيلية الوطنية للصناعات الغذائية (فوديكو)",
    "symbol": "INFI",
    "isin": "EGS01041C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS01041C010"
  },
  {
    "name": "الاسماعيلية مصر للدواجن",
    "symbol": "ISMA",
    "isin": "EGS02021C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS02021C011"
  },
  {
    "name": "المنصورة للدواجن",
    "symbol": "MPCO",
    "isin": "EGS02091C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS02091C014"
  },
  {
    "name": "القاهرة للدواجن",
    "symbol": "POUL",
    "isin": "EGS02051C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS02051C018"
  },
  {
    "name": "زهراء المعادي للاستثمار والتعمير",
    "symbol": "ZMID",
    "isin": "EGS21171C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS21171C011"
  },
  {
    "name": "الخليجية الكندية للاستثمار العقاري العربي",
    "symbol": "CCRS",
    "isin": "EGS651B1C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS651B1C018"
  },
  {
    "name": "الدولية للتأجير التمويلي (إنكوليس)",
    "symbol": "ICLE",
    "isin": "EGS67001C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS67001C015"
  },
  {
    "name": "المشروعات الصناعية والهندسية",
    "symbol": "IEEC",
    "isin": "EGS22171C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS22171C010"
  },
  {
    "name": "شركة النصر للأعمال المدنية",
    "symbol": "NCCW",
    "isin": "EGS23111C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS23111C015"
  },
  {
    "name": "كريستمار للمقاولات والتطوير العقاري",
    "symbol": "CRST",
    "isin": "EGS23141C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS23141C012"
  },
  {
    "name": "بنك فيصل الاسلامي المصري - بالدولار",
    "symbol": "FAITA",
    "isin": "EGS60322C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS60322C012"
  },
  {
    "name": "بنك التعمير والاسكان",
    "symbol": "HDBK",
    "isin": "EGS60301C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS60301C016"
  },
  {
    "name": "المصرية للدواجن",
    "symbol": "EPCO",
    "isin": "EGS02211C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS02211C018"
  },
  {
    "name": "(مجموعة عامر القابضة (عامر جروب",
    "symbol": "AMER",
    "isin": "EGS675S1C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS675S1C011"
  },
  {
    "name": "ريكاب للاستثمارات المالية",
    "symbol": "REAC",
    "isin": "EGS69191C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS69191C012"
  },
  {
    "name": "كونكريت فاشن جروب للاستثمارات التجارية والصناعية",
    "symbol": "CFGH",
    "isin": "EGS672I2C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS672I2C014"
  },
  {
    "name": "المصريين للاستثمار والتنمية العمرانية",
    "symbol": "EIUD",
    "isin": "EGS213S1C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS213S1C010"
  },
  {
    "name": "الشرق الأوسط لصناعة الزجاج",
    "symbol": "MEGM",
    "isin": "EGS3C061C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3C061C015"
  },
  {
    "name": "الاهرام للطباعة و التغليف",
    "symbol": "EPPK",
    "isin": "EGS360A1C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS360A1C011"
  },
  {
    "name": "مينا فارما للأدوية و الصناعات الكيماوية",
    "symbol": "MIPH",
    "isin": "EGS380G1C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS380G1C011"
  },
  {
    "name": "سيدى كرير للبتروكيماويات - سيدبك",
    "symbol": "SKPC",
    "isin": "EGS380S1C017",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS380S1C017"
  },
  {
    "name": "راية القابضة للأستثمارات المالية",
    "symbol": "RAYA",
    "isin": "EGS690C1C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS690C1C010"
  },
  {
    "name": "مجموعة جى. أم. سى للاستثمارات الصناعية والتجارية المالية",
    "symbol": "GMCI",
    "isin": "EGS46051C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS46051C016"
  },
  {
    "name": "الورق للشرق الاوسط - سيمو",
    "symbol": "SIMO",
    "isin": "EGS36091C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS36091C014"
  },
  {
    "name": "العامة لصناعة الورق - راكتا",
    "symbol": "RAKT",
    "isin": "EGS36021C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS36021C011"
  },
  {
    "name": "المصرية الدولية للصناعات الدوائية - ايبيكو",
    "symbol": "PHAR",
    "isin": "EGS38081C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38081C013"
  },
  {
    "name": "جولدن سميث كلاين",
    "symbol": "BIOC",
    "isin": "EGS38171C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38171C012"
  },
  {
    "name": "يونيفرسال لصناعة مواد التعبئة و التغليف والورق - يونيباك",
    "symbol": "UNIP",
    "isin": "EGS38161C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38161C013"
  },
  {
    "name": "الصناعات الكيماوية المصرية - كيما",
    "symbol": "EGCH",
    "isin": "EGS38201C017",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38201C017"
  },
  {
    "name": "الاسكندرية للادوية والصناعات الكيماوية",
    "symbol": "AXPH",
    "isin": "EGS38341C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38341C011"
  },
  {
    "name": "النيل للادوية والصناعات الكيماوية - النيل",
    "symbol": "NIPH",
    "isin": "EGS38331C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38331C012"
  },
  {
    "name": "النصر لتصنيع الحاصلات الزراعية",
    "symbol": "ELNA",
    "isin": "EGS300L1C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS300L1C011"
  },
  {
    "name": "العربية للمحابس",
    "symbol": "ARVA",
    "isin": "EGS3E1E1C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3E1E1C013"
  },
  {
    "name": "جى بى كوربوريشن",
    "symbol": "GBCO",
    "isin": "EGS673T1C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS673T1C012"
  },
  {
    "name": "مجموعة طلعت مصطفى القابضة",
    "symbol": "TMGH",
    "isin": "EGS691S1C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS691S1C011"
  },
  {
    "name": "برايم القابضة للاستثمارات المالية",
    "symbol": "PRMH",
    "isin": "EGS691A1C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS691A1C011"
  },
  {
    "name": "الحفر الوطنية",
    "symbol": "NDRL.",
    "isin": "EGS735N2C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS735N2C012"
  },
  {
    "name": "دلتا للطباعة والتغليف",
    "symbol": "DTPP",
    "isin": "EGS370W1C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS370W1C013"
  },
  {
    "name": "اسباير كابيتال القابضة للاستثمارات المالية",
    "symbol": "ASPI",
    "isin": "EGS691L1C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS691L1C018"
  },
  {
    "name": "الشمس بيراميدز للفنادق والمنشأت السياحية",
    "symbol": "SPHT",
    "isin": "EGS70H02C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS70H02C014"
  },
  {
    "name": "الاسكندرية للزيوت المعدنية",
    "symbol": "AMOC",
    "isin": "EGS380P1C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS380P1C010"
  },
  {
    "name": "مطاحن ومخابز شمال القاهرة",
    "symbol": "MILS",
    "isin": "EGS30361C017",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30361C017"
  },
  {
    "name": "مطاحن ومخابز الاسكندرية",
    "symbol": "AFMC",
    "isin": "EGS30471C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30471C014"
  },
  {
    "name": "مطاحن مصر العليا",
    "symbol": "UEFM",
    "isin": "EGS30451C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30451C016"
  },
  {
    "name": "مطاحن وسط وغرب الدلتا",
    "symbol": "WCDF",
    "isin": "EGS30421C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30421C019"
  },
  {
    "name": "مطاحن مصر الوسطي",
    "symbol": "CEFM",
    "isin": "EGS30401C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30401C011"
  },
  {
    "name": "القاهرة للزيوت والصابون",
    "symbol": "COSG",
    "isin": "EGS30581C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30581C010"
  },
  {
    "name": "جولدن تكس للاصواف",
    "symbol": "GTWL",
    "isin": "EGS32161C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS32161C019"
  },
  {
    "name": "العربية لحليب الأقطار",
    "symbol": "ACGC",
    "isin": "EGS32221C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS32221C011"
  },
  {
    "name": "النساجون الشرقيون للسجاد",
    "symbol": "ORWE",
    "isin": "EGS33041C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS33041C012"
  },
  {
    "name": "المصريين للاسكان والتنمية والتعمير",
    "symbol": "EHDR",
    "isin": "EGS65341C017",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65341C017"
  },
  {
    "name": "العربية للادوية والصناعات الكيماوية",
    "symbol": "ADCI",
    "isin": "EGS38321C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38321C013"
  },
  {
    "name": "مصر للزيوت والصابون",
    "symbol": "MOSC",
    "isin": "EGS38421C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38421C011"
  },
  {
    "name": "القاهرة للادوية والصناعات الكيماوية",
    "symbol": "CPCI",
    "isin": "EGS38391C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38391C016"
  },
  {
    "name": "المالية والصناعية المصرية",
    "symbol": "EFIC",
    "isin": "EGS38381C017",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS38381C017"
  },
  {
    "name": "غاز مصر",
    "symbol": "EGAS",
    "isin": "EGS39011C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS39011C019"
  },
  {
    "name": "العامة لمنتجات الخزف والصيني",
    "symbol": "PRCL",
    "isin": "EGS3C111C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3C111C019"
  },
  {
    "name": "العز للسيراميك والبورسلين - الجوهره",
    "symbol": "ECAP",
    "isin": "EGS3C071C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3C071C015"
  },
  {
    "name": "العربية للخزف - سيراميكا ريماس",
    "symbol": "CERA",
    "isin": "EGS3C151C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3C151C015"
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
    "isin": "EGS3C371C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3C371C019"
  },
  {
    "name": "جنوب الوادى للاسمنت",
    "symbol": "SVCE",
    "isin": "EGS3C351C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3C351C011"
  },
  {
    "name": "الدلتا للسكر",
    "symbol": "SUGR",
    "isin": "EGS30201C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30201C015"
  },
  {
    "name": "الشرقية الوطنية للامن الغذائي",
    "symbol": "SNFC",
    "isin": "EGS30291C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30291C016"
  },
  {
    "name": "الاستثمار العقاري العربي - اليكو",
    "symbol": "RREI",
    "isin": "EGS65011C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65011C016"
  },
  {
    "name": "المهندس للتأمين",
    "symbol": "MOIN",
    "isin": "EGS63041C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS63041C015"
  },
  {
    "name": "القاهرة الوطنية للاستثمار والاوراق المالية",
    "symbol": "KWIN",
    "isin": "EGS69011C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS69011C012"
  },
  {
    "name": "مجموعة اي اف جي القابضة",
    "symbol": "HRHO",
    "isin": "EGS69101C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS69101C011"
  },
  {
    "name": "الدلتا للتأمين",
    "symbol": "DEIN",
    "isin": "EGS63031C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS63031C016"
  },
  {
    "name": "الوطنية للاسكان للنقابات المهنية",
    "symbol": "NHPS",
    "isin": "EGS65131C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65131C012"
  },
  {
    "name": "القاهرة للاسكان والتعمير",
    "symbol": "ELKA",
    "isin": "EGS65071C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65071C010"
  },
  {
    "name": "المجموعة المصريه العقاريه",
    "symbol": "AREH",
    "isin": "EGS65211C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65211C012"
  },
  {
    "name": "رواد السياحة - الرواد",
    "symbol": "ROTO",
    "isin": "EGS70281C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS70281C018"
  },
  {
    "name": "جولدن بيراميدز بلازا",
    "symbol": "GPPL",
    "isin": "EGS70342C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS70342C018"
  },
  {
    "name": "بيراميزا للفنادق والقرى السياحية - بيراميزا",
    "symbol": "PHTV",
    "isin": "EGS70331C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS70331C011"
  },
  {
    "name": "المصرية للمنتجعات السياحية",
    "symbol": "EGTS",
    "isin": "EGS70431C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS70431C019"
  },
  {
    "name": "مستشفى النزهة الدولي",
    "symbol": "NINH",
    "isin": "EGS72011C017",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS72011C017"
  },
  {
    "name": "الغربية الاسلامية للتنمية العمرانية",
    "symbol": "GIHD",
    "isin": "EGS65461C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65461C013"
  },
  {
    "name": "مصر الجديدة للاسكان والتعمير",
    "symbol": "HELI",
    "isin": "EGS65591C017",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65591C017"
  },
  {
    "name": "مدينة مصر للاسكان والتعمير",
    "symbol": "MASR",
    "isin": "EGS65571C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65571C019"
  },
  {
    "name": "القاهره للإستثمار والتنمية العقارية سيرا للتعليم",
    "symbol": "CIRA",
    "isin": "EGS65541C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65541C012"
  },
  {
    "name": "العربية لاستصلاح الاراضي",
    "symbol": "EALR",
    "isin": "EGS65771C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS65771C015"
  },
  {
    "name": "السعودية المصرية للاستثمار والتمويل",
    "symbol": "SEIG",
    "isin": "EGS67031C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS67031C012"
  },
  {
    "name": "السعودية المصرية للاستثمار والتمويل $",
    "symbol": "SEIGA",
    "isin": "EGS67032C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS67032C010"
  },
  {
    "name": "العالمية للاستثمار والتنمية",
    "symbol": "ICID",
    "isin": "EGS67191C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS67191C014"
  },
  {
    "name": "اودن للاستثمارات المالية",
    "symbol": "ODIN",
    "isin": "EGS67181C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS67181C015"
  },
  {
    "name": "اصول E.S.B للوساطة في الاوراق المالية",
    "symbol": "EBSC",
    "isin": "EGS68181C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS68181C014"
  },
  {
    "name": "الحديد والصلب المصرية",
    "symbol": "IRON",
    "isin": "EGS3D061C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3D061C015"
  },
  {
    "name": "الالومنيوم العربية",
    "symbol": "ALUM",
    "isin": "EGS3D031C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3D031C018"
  },
  {
    "name": "الصناعات الغذائية العربية-دومتى",
    "symbol": "DOMT",
    "isin": "EGS30031C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30031C016"
  },
  {
    "name": "الاسكندرية للخدمات الطبية - المركز الطبى الجديد - الاسكندرية",
    "symbol": "AMES",
    "isin": "EGS72081C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS72081C010"
  },
  {
    "name": "القاهرة للخدمات التعليمية",
    "symbol": "CAED",
    "isin": "EGS72201C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS72201C014"
  },
  {
    "name": "المصريه لمدينة الانتاج الاعلاميه",
    "symbol": "MPRC",
    "isin": "EGS78021C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS78021C010"
  },
  {
    "name": "عبر المحيطات للسياحه",
    "symbol": "TRTO",
    "isin": "EGS79072C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS79072C012"
  },
  {
    "name": "شمال الصعيد للتنمية والانتاج الزراعى (نيوداب)",
    "symbol": "NEDA",
    "isin": "EGS52041C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS52041C018"
  },
  {
    "name": "مصر للاسواق الحرة",
    "symbol": "MFSC",
    "isin": "EGS53051C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS53051C016"
  },
  {
    "name": "بنك كريدي اجريكول مصر",
    "symbol": "CIEB",
    "isin": "EGS60041C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS60041C018"
  },
  {
    "name": "الصناعات الهندسية المعمارية للانشاء والتعمير - ايكون",
    "symbol": "ENGC",
    "isin": "EGS3F021C017",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3F021C017"
  },
  {
    "name": "الكابلات الكهربائية المصرية",
    "symbol": "ELEC",
    "isin": "EGS3G231C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3G231C011"
  },
  {
    "name": "بورسعيد لتداول الحاويات والبضائع",
    "symbol": "POCO",
    "isin": "EGS42101C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS42101C013"
  },
  {
    "name": "الخدمات الملاحية والبترولية - ماريديف",
    "symbol": "MOIL",
    "isin": "EGS44012C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS44012C010"
  },
  {
    "name": "الاسكندرية لتداول الحاويات والبضائع",
    "symbol": "ALCN",
    "isin": "EGS42111C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS42111C012"
  },
  {
    "name": "المصرية للاتصالات",
    "symbol": "ETEL",
    "isin": "EGS48031C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS48031C016"
  },
  {
    "name": "A.T.LEASEالتوفيق للتأجير التمويلي - اية.تي.ليس",
    "symbol": "ATLC",
    "isin": "EGS676N1C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS676N1C015"
  },
  {
    "name": "إعمار مصر للتنمية",
    "symbol": "EMFD",
    "isin": "EGS673Y1C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS673Y1C015"
  },
  {
    "name": "مصر لإنتاج الأسمدة - موبكو",
    "symbol": "MFPC",
    "isin": "EGS39061C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS39061C014"
  },
  {
    "name": "المطورون العرب القابضة",
    "symbol": "ARAB",
    "isin": "EGS694A1C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS694A1C018"
  },
  {
    "name": "البنك التجاري الدولي - مصر (سى اى بى)",
    "symbol": "COMI",
    "isin": "EGS60121C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS60121C018"
  },
  {
    "name": "مصرف أبو ظبي الأسلامي- مصر",
    "symbol": "ADIB",
    "isin": "EGS60111C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS60111C019"
  },
  {
    "name": "البنك المصري الخليجي",
    "symbol": "EGBE",
    "isin": "EGS60182C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS60182C010"
  },
  {
    "name": "اكرم مصر للشدات والسقالات المعدنية",
    "symbol": "ACRO",
    "isin": "EGS3E071C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3E071C013"
  },
  {
    "name": "جراند انفستمنت القابضة للاستثمارات المالية",
    "symbol": "GRCA",
    "isin": "EGS69261C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS69261C013"
  },
  {
    "name": "الوادى العالمية للاستثمار والتنمية",
    "symbol": "ELWA",
    "isin": "EGS70GV1C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS70GV1C016"
  },
  {
    "name": "مرسى مرسى علم للتنمية السياحية",
    "symbol": "MMAT",
    "isin": "EGS70P91C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS70P91C010"
  },
  {
    "name": "القلعة للاستثمارات المالية",
    "symbol": "CCAP",
    "isin": "EGS73541C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS73541C012"
  },
  {
    "name": "العبوات الطبية",
    "symbol": "MEPA",
    "isin": "EGS3C4L1C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3C4L1C015"
  },
  {
    "name": "اوراسكوم للاستثمار القابضه",
    "symbol": "OIH",
    "isin": "EGS693V1C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS693V1C014"
  },
  {
    "name": "جولدن كوست السخنة للاستثمار السياحى",
    "symbol": "GOCO",
    "isin": "EGS70GV1C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS70GV1C015"
  },
  {
    "name": "سبأ الدولية للأدوية والصناعات الكيماوية",
    "symbol": "SIPC",
    "isin": "EGS382M1C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS382M1C011"
  },
  {
    "name": "EGX 30 INDEX ETF-وثائق استثمار شركة صناديق المؤشرات",
    "symbol": "EGX30ETF",
    "isin": "EGS69491M015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS69491M015"
  },
  {
    "name": "عبور لاند للصناعات الغذائية",
    "symbol": "OLFI",
    "isin": "EGS30GV1C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS30GV1C012"
  },
  {
    "name": "شركة مستشفي كليوباترا",
    "symbol": "CLHO",
    "isin": "EGS729J1C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS729J1C018"
  },
  {
    "name": "كونتكت المالية القابضة",
    "symbol": "CNFN",
    "isin": "EGS738I1C018",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS738I1C018"
  },
  {
    "name": "بنك القاهرة",
    "symbol": "BQDC",
    "isin": "EGS600K1C019",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS600K1C019"
  },
  {
    "name": "الشركة العربية لادارة وتطوير الأصول",
    "symbol": "ACAMD",
    "isin": "EGS72GV1C016",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS72GV1C016"
  },
  {
    "name": "ماكرو جروب للمستحضرات الطبية-ماكرو كابيتال",
    "symbol": "MCRO",
    "isin": "EGS7D971C011",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS7D971C011"
  },
  {
    "name": "الحديد والصلب للمناجم والمحاجر",
    "symbol": "ISMQ",
    "isin": "EGS102S1C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS102S1C014"
  },
  {
    "name": "ابن سينا فارما",
    "symbol": "ISPH",
    "isin": "EGS512S1C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS512S1C012"
  },
  {
    "name": "العاشر من رمضان للصناعات الدوائية والمستحضرات تشخيصية-راميدا",
    "symbol": "RMDA",
    "isin": "EGS381B1C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS381B1C015"
  },
  {
    "name": "فوري لتكنولوجيا البنوك والمدفوعات الالكترونية",
    "symbol": "FWRY",
    "isin": "EGS745L1C014",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS745L1C014"
  },
  {
    "name": "سبيد ميديكال",
    "symbol": "SPMD",
    "isin": "EGS73BR1C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS73BR1C013"
  },
  {
    "name": "وثائق صندوق استثمار أودن للاستثمار في الاسهم المصرية -كسب",
    "symbol": "KASABF",
    "isin": "EGS696Z1C017",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS696Z1C017"
  },
  {
    "name": "وثائق شركة صندوق استثمار المصريين للاستثمار العقارى",
    "symbol": "EGREF",
    "isin": "EGS694B1C017",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS694B1C017"
  },
  {
    "name": "Taaleem Management Services تعليم لخدمات الإدارة",
    "symbol": "TALM",
    "isin": "EGS597R1C017",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS597R1C017"
  },
  {
    "name": "اي فاينانس للاستثمارات المالية والرقمية",
    "symbol": "EFIH",
    "isin": "EGS743O1C013",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS743O1C013"
  },
  {
    "name": "نهر الخير للتنمية والاستثمار الزراعى والخدمات البيئية",
    "symbol": "KRDI",
    "isin": "EGS02291C010",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS02291C010"
  },
  {
    "name": "بايونيرز بروبرتيز للتنمية العمرانية",
    "symbol": "PRDC",
    "isin": "EGS21FW1C015",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS21FW1C015"
  },
  {
    "name": "جدوية للتنمية الصناعية",
    "symbol": "GDWA",
    "isin": "EGS3GV11C012",
    "egxLink": "https://www.egx.com.eg/ar/NewsList.aspx?ISIN=EGS3GV11C012"
  }
];
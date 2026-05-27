export const DEFAULT_TOPICS = [
  {
    id: 'vorstellung',
    title: 'Self-Introduction',
    titleDe: 'Sich vorstellen',
    description: 'Học cách giới thiệu bản thân, sở thích và công việc hàng ngày bằng tiếng Đức.',
    icon: 'User',
    gradient: ['#6366F1', '#4F46E5'],
    cards: [
      {
        id: 'v1',
        question: 'Wie heißen Sie und woher kommen Sie?',
        translation: 'Tên của bạn là gì và bạn đến từ đâu?',
        hint: 'Heißen (tên là), kommen aus (đến từ). Nhớ chia động từ ở ngôi "ich" (tôi).',
        suggestedStructure: 'Ich heiße... und ich komme aus Vietnam.',
        difficulty: 'A1',
      },
      {
        id: 'v2',
        question: 'Was machen Sie beruflich?',
        translation: 'Bạn làm nghề gì?',
        hint: 'Beruf (nghề nghiệp). Có thể dùng "Ich bin [nghề nghiệp]" hoặc "Ich arbeite als [nghề nghiệp]".',
        suggestedStructure: 'Ich bin Student / Ich arbeite als Softwareentwickler.',
        difficulty: 'A1',
      },
      {
        id: 'v3',
        question: 'Was sind Ihre Hobbys und was machen Sie in Ihrer Freizeit?',
        translation: 'Sở thích của bạn là gì và bạn làm gì vào thời gian rảnh?',
        hint: 'Hobbys (sở thích), Freizeit (thời gian rảnh). Dùng động từ thích làm: "Ich spiele gerne...", "Mein Hobby ist...".',
        suggestedStructure: 'Meine Hobbys sind Lesen und Reisen. In meiner Freizeit spiele ich gerne Fußball.',
        difficulty: 'A2',
      },
      {
        id: 'v4',
        question: 'Warum lernen Sie Deutsch?',
        translation: 'Tại sao bạn lại học tiếng Đức?',
        hint: 'Weil (bởi vì) -> động từ đứng cuối câu! Hoặc dùng "Ich lerne Deutsch, um... zu...".',
        suggestedStructure: 'Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.',
        difficulty: 'A2',
      },
      {
        id: 'v5',
        question: 'Wie sieht ein typischer Tag bei Ihnen aus?',
        translation: 'Một ngày điển hình của bạn diễn ra như thế nào?',
        hint: 'Aussehen (trông như thế nào), tagesablauf (lịch trình ngày). Dùng các trạng từ chỉ thời gian: "Zuerst", "Danach", "Später".',
        suggestedStructure: 'Morgens stehe ich um 7 Uhr auf, dann trinke ich Kaffee und fange an zu arbeiten.',
        difficulty: 'B1',
      }
    ]
  },
  {
    id: 'einkaufen',
    title: 'Shopping',
    titleDe: 'Einkaufen gehen',
    description: 'Hỏi giá cả, mua sắm quần áo, tìm kiếm món đồ ưa thích tại cửa hàng.',
    icon: 'ShoppingBag',
    gradient: ['#EC4899', '#DB2777'],
    cards: [
      {
        id: 'e1',
        question: 'Kann ich Ihnen helfen, oder schauen Sie nur?',
        translation: 'Tôi có thể giúp gì cho bạn không, hay bạn chỉ đang xem thôi?',
        hint: 'Cần phản hồi lịch sự của khách hàng khi nhân viên hỏi. "schauen" (xem), "suchen" (tìm kiếm).',
        suggestedStructure: 'Ich suche ein blaues Hemd. / Danke, ich schaue nur.',
        difficulty: 'A1',
      },
      {
        id: 'e2',
        question: 'Wie viel kostet dieses Buch und kann ich mit Karte bezahlen?',
        translation: 'Cuốn sách này giá bao nhiêu và tôi có thể thanh toán bằng thẻ được không?',
        hint: 'Kosten (giá cả), bezahlen (thanh toán), mit Karte (bằng thẻ).',
        suggestedStructure: 'Das Buch kostet... Kann ich bitte mit Karte bezahlen?',
        difficulty: 'A1',
      },
      {
        id: 'e3',
        question: 'Gibt es diese Jacke auch in einer anderen Größe oder Farbe?',
        translation: 'Chiếc áo khoác này có cỡ khác hoặc màu khác không?',
        hint: 'Größe (cỡ), Farbe (màu), andere (khác).',
        suggestedStructure: 'Haben Sie diese Jacke auch in Größe M / in Schwarz?',
        difficulty: 'A2',
      },
      {
        id: 'e4',
        question: 'Wo kann ich diese Hose anprobieren?',
        translation: 'Tôi có thể thử chiếc quần này ở đâu?',
        hint: 'Anprobieren (thử đồ), Umkleidekabine (phòng thử đồ).',
        suggestedStructure: 'Wo ist die Umkleidekabine? Ich möchte diese Hose anprobieren.',
        difficulty: 'A2',
      },
      {
        id: 'e5',
        question: 'Ich möchte diesen Pullover umtauschen. Geht das?',
        translation: 'Tôi muốn đổi chiếc áo len này. Có được không?',
        hint: 'Umtauschen (đổi hàng), Kassenbon (hóa đơn), Kaputt (bị hỏng/lỗi).',
        suggestedStructure: 'Ich möchte diesen Pullover umtauschen, weil er zu klein ist. Hier ist der Kassenbon.',
        difficulty: 'B1',
      }
    ]
  },
  {
    id: 'restaurant',
    title: 'At the Restaurant',
    titleDe: 'Im Restaurant',
    description: 'Gọi món, đặt bàn, hỏi món ăn và thanh toán hóa đơn ăn uống.',
    icon: 'Utensils',
    gradient: ['#10B981', '#059669'],
    cards: [
      {
        id: 'r1',
        question: 'Haben Sie einen Tisch für zwei Personen frei?',
        translation: 'Bạn còn bàn trống cho 2 người không?',
        hint: 'Einen Tisch reservieren (đặt bàn). Trả lời lịch sự.',
        suggestedStructure: 'Guten Tag, wir hätten gerne einen Tisch für zwei Personen.',
        difficulty: 'A1',
      },
      {
        id: 'r2',
        question: 'Was möchten Sie bestellen?',
        translation: 'Bạn muốn gọi món gì?',
        hint: 'Bestellen (gọi món). Dùng mẫu câu lịch sự "Ich hätte gerne..." hoặc "Ich nehme...".',
        suggestedStructure: 'Ich hätte gerne eine Suppe als Vorspeise und das Schnitzel als Hauptgericht.',
        difficulty: 'A1',
      },
      {
        id: 'r3',
        question: 'Guten Appetit! Schmeckt es Ihnen?',
        translation: 'Chúc ngon miệng! Bạn ăn có ngon không?',
        hint: 'Schmecken (ngon/hợp khẩu vị). Trả lời khen món ăn hoặc phản hồi lịch sự.',
        suggestedStructure: 'Danke! Es schmeckt ausgezeichnet. Das Fleisch ist sehr zart.',
        difficulty: 'A2',
      },
      {
        id: 'r4',
        question: 'Zahlen Sie zusammen oder getrennt?',
        translation: 'Quý khách thanh toán chung hay riêng?',
        hint: 'Zusammen (chung), getrennt (riêng), Die Rechnung (hóa đơn). Mẫu câu gọi thanh toán.',
        suggestedStructure: 'Wir zahlen bitte getrennt. / Zusammen bitte, die Rechnung bitte!',
        difficulty: 'A2',
      },
      {
        id: 'r5',
        question: 'Entschuldigung, aber die Suppe ist leider kalt. Könnten Sie das bitte korrigieren?',
        translation: 'Xin lỗi, nhưng món súp này bị nguội rồi. Bạn có thể sửa giúp tôi được không?',
        hint: 'Phàn nàn lịch sự (Höfliche Reklamation). Dùng "Könnten Sie bitte...".',
        suggestedStructure: 'Entschuldigung, meine Suppe ist leider kalt. Könnten Sie sie bitte aufwärmen?',
        difficulty: 'B1',
      }
    ]
  },
  {
    id: 'reise',
    title: 'Travel & Location',
    titleDe: 'Auf Reisen',
    description: 'Hỏi đường, mua vé tàu, đặt phòng khách sạn và hỏi thông tin chuyến đi.',
    icon: 'MapPin',
    gradient: ['#F59E0B', '#D97706'],
    cards: [
      {
        id: 'rs1',
        question: 'Entschuldigung, wie komme ich zum Hauptbahnhof?',
        translation: 'Xin hỏi, đường đi đến ga trung tâm như thế nào?',
        hint: 'Hỏi đường (Wegbeschreibung). Hauptbahnhof (ga chính), geradeaus (đi thẳng), links (rẽ trái), rechts (rẽ phải).',
        suggestedStructure: 'Entschuldigung, können Sie mir bitte den Weg zum Hauptbahnhof erklären?',
        difficulty: 'A2',
      },
      {
        id: 'rs2',
        question: 'Ich möchte eine Fahrkarte nach Berlin kaufen. Wann fährt der nächste Zug?',
        translation: 'Tôi muốn mua một vé đi Berlin. Khi nào thì chuyến tàu tiếp theo khởi hành?',
        hint: 'Eine Fahrkarte kaufen (mua vé xe/tàu), abfahren (khởi hành), das Gleis (đường ray/sân ga).',
        suggestedStructure: 'Ich brauche eine Fahrkarte nach Berlin. Fährt der Zug direkt oder muss ich umsteigen?',
        difficulty: 'A2',
      },
      {
        id: 'rs3',
        question: 'Guten Tag, ich habe ein Zimmer auf den Namen Nguyen reserviert.',
        translation: 'Xin chào, tôi đã đặt một phòng dưới tên Nguyễn.',
        hint: 'Check-in khách sạn. Übernachtung (ngủ qua đêm), das Frühstück (bữa sáng).',
        suggestedStructure: 'Guten Tag, mein Name ist Nguyen. Ich habe ein Doppelzimmer für drei Nächte gebucht.',
        difficulty: 'B1',
      }
    ]
  }
];

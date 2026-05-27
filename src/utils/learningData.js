/** Dữ liệu mẫu theo trình độ Goethe (A1–B2) */

export const LEARNING_TOPICS = [
  'Gia đình và mối quan hệ',
  'Công việc và phỏng vấn',
  'Mua sắm và dịch vụ',
  'Sức khỏe và bệnh viện',
  'Du lịch và giao thông',
  'Nhà ở và sinh hoạt',
];

const v = (id, term, meaning, example, usage, article = '') => ({
  id,
  term,
  article,
  meaning,
  example,
  usage,
});

/** Cấu hình theo level: số từ mục tiêu, thời gian làm bài */
export const LEVEL_CONFIG = {
  A1: {
    label: 'A1 – Sơ cấp',
    vocabPerType: 4,
    writingDurationSeconds: 10 * 60,
    targetWords: 50,
    minWords: 35,
  },
  A2: {
    label: 'A2 – Giao tiếp cơ bản',
    vocabPerType: 6,
    writingDurationSeconds: 15 * 60,
    targetWords: 100,
    minWords: 70,
  },
  B1: {
    label: 'B1 – Trung cấp',
    vocabPerType: 8,
    writingDurationSeconds: 20 * 60,
    targetWords: 150,
    minWords: 110,
  },
  B2: {
    label: 'B2 – Trung cao',
    vocabPerType: 10,
    writingDurationSeconds: 25 * 60,
    targetWords: 200,
    minWords: 150,
  },
};

const FAMILY = 'Gia đình và mối quan hệ';
const WORK = 'Công việc và phỏng vấn';
const SHOP = 'Mua sắm và dịch vụ';
const HEALTH = 'Sức khỏe và bệnh viện';
const TRAVEL = 'Du lịch và giao thông';
const HOME = 'Nhà ở và sinh hoạt';

// —— A1: từ đơn giản, câu ngắn, ~4 mục / nhóm ——
const A1 = {
  [FAMILY]: {
    verb: [
      v('a1_f_v1', 'heißen', 'tên là', 'Ich heiße Lan.', 'Động từ cơ bản khi giới thiệu tên.'),
      v('a1_f_v2', 'wohnen', 'sống', 'Ich wohne in Hanoi.', 'Wohnen + Dativ (ở đâu).'),
      v('a1_f_v3', 'haben', 'có', 'Ich habe eine Schwester.', 'Haben + Akkusativ.'),
      v('a1_f_v4', 'lieben', 'yêu', 'Ich liebe meine Familie.', 'Động từ thường gặp trong chủ đề gia đình.'),
    ],
    adjective: [
      v('a1_f_a1', 'gut', 'tốt', 'Meine Mutter ist gut.', 'Tính từ cơ bản, đứng sau động từ sein.'),
      v('a1_f_a2', 'groß', 'to, lớn', 'Mein Vater ist groß.', 'Mô tả ngoại hình.'),
      v('a1_f_a3', 'klein', 'nhỏ', 'Meine Schwester ist klein.', 'Ngược với groß.'),
      v('a1_f_a4', 'nett', 'dễ thương, tốt bụng', 'Mein Bruder ist nett.', 'Hay dùng khi nói về người.'),
    ],
    noun: [
      v('a1_f_n1', 'Familie', 'gia đình', 'Das ist meine Familie.', 'die Familie – danh từ giống die.', 'die'),
      v('a1_f_n2', 'Vater', 'bố', 'Mein Vater arbeitet.', 'der Vater.', 'der'),
      v('a1_f_n3', 'Mutter', 'mẹ', 'Meine Mutter kocht.', 'die Mutter.', 'die'),
      v('a1_f_n4', 'Kind', 'con', 'Das Kind spielt.', 'das Kind.', 'das'),
    ],
  },
  [WORK]: {
    verb: [
      v('a1_w_v1', 'arbeiten', 'làm việc', 'Ich arbeite in einem Büro.', 'Arbeiten + Ort (in + Dativ).'),
      v('a1_w_v2', 'lernen', 'học', 'Ich lerne Deutsch.', 'Lernen + Akkusativ.'),
      v('a1_w_v3', 'machen', 'làm', 'Was machst du?', 'Động từ đa năng A1.'),
      v('a1_w_v4', 'helfen', 'giúp', 'Kannst du mir helfen?', 'Helfen + Dativ (mir).'),
    ],
    adjective: [
      v('a1_w_a1', 'neu', 'mới', 'Das ist ein neuer Job.', 'Neu + Endung theo giống.'),
      v('a1_w_a2', 'schwer', 'khó', 'Deutsch ist schwer.', 'Sau sein.'),
      v('a1_w_a3', 'leicht', 'dễ', 'Das ist leicht.', 'Ngược schwer.'),
      v('a1_w_a4', 'wichtig', 'quan trọng', 'Deutsch ist wichtig.', 'Hay trong thi A1.'),
    ],
    noun: [
      v('a1_w_n1', 'Beruf', 'nghề nghiệp', 'Was ist dein Beruf?', 'der Beruf.', 'der'),
      v('a1_w_n2', 'Arbeit', 'công việc', 'Die Arbeit ist gut.', 'die Arbeit.', 'die'),
      v('a1_w_n3', 'Schule', 'trường', 'Ich gehe in die Schule.', 'die Schule + Akkusativ sau in.', 'die'),
      v('a1_w_n4', 'Chef', 'sếp', 'Mein Chef ist nett.', 'der Chef.', 'der'),
    ],
  },
  [SHOP]: {
    verb: [
      v('a1_s_v1', 'kaufen', 'mua', 'Ich kaufe Brot.', 'Kaufen + Akkusativ.'),
      v('a1_s_v2', 'bezahlen', 'trả tiền', 'Ich bezahle bar.', 'Bar = tiền mặt.'),
      v('a1_s_v3', 'kosten', 'giá (bao nhiêu)', 'Wie viel kostet das?', 'Kosten không chia theo ngôi trong câu hỏi giá.'),
      v('a1_s_v4', 'brauchen', 'cần', 'Ich brauche Milch.', 'Brauchen + Akkusativ.'),
    ],
    adjective: [
      v('a1_s_a1', 'billig', 'rẻ', 'Das ist billig.', 'Mua sắm A1.'),
      v('a1_s_a2', 'teuer', 'đắt', 'Das ist zu teuer.', 'Zu + tính từ = quá...'),
      v('a1_s_a3', 'groß', 'to (cửa hàng)', 'Der Supermarkt ist groß.', ''),
      v('a1_s_a4', 'klein', 'nhỏ', 'Die Bäckerei ist klein.', ''),
    ],
    noun: [
      v('a1_s_n1', 'Preis', 'giá', 'Der Preis ist gut.', 'der Preis.', 'der'),
      v('a1_s_n2', 'Geld', 'tiền', 'Ich habe kein Geld.', 'das Geld.', 'das'),
      v('a1_s_n3', 'Laden', 'cửa hàng', 'Der Laden ist offen.', 'der Laden.', 'der'),
      v('a1_s_n4', 'Kasse', 'quầy thu ngân', 'Wo ist die Kasse?', 'die Kasse.', 'die'),
    ],
  },
  [HEALTH]: {
    verb: [
      v('a1_h_v1', 'sein', 'là, ở trạng thái', 'Ich bin krank.', 'Sein + tính từ.'),
      v('a1_h_v2', 'haben', 'có (đau)', 'Ich habe Kopfschmerzen.', 'Haben + Akkusativ.'),
      v('a1_h_v3', 'gehen', 'đi', 'Ich gehe zum Arzt.', 'Zum = zu + dem.'),
      v('a1_h_v4', 'brauchen', 'cần', 'Ich brauche Medizin.', ''),
    ],
    adjective: [
      v('a1_h_a1', 'krank', 'ốm', 'Ich bin krank.', 'Goethe A1 Schreiben/Sprechen.'),
      v('a1_h_a2', 'gesund', 'khỏe', 'Ich bin gesund.', ''),
      v('a1_h_a3', 'müde', 'mệt', 'Ich bin müde.', ''),
      v('a1_h_a4', 'schlecht', 'tệ, không khỏe', 'Mir geht es schlecht.', 'Es geht mir...'),
    ],
    noun: [
      v('a1_h_n1', 'Arzt', 'bác sĩ', 'Ich gehe zum Arzt.', 'der Arzt, zum Arzt.', 'der'),
      v('a1_h_n2', 'Kopfschmerzen', 'đau đầu', 'Ich habe Kopfschmerzen.', 'số nhiều.', 'die'),
      v('a1_h_n3', 'Apotheke', 'nhà thuốc', 'Die Apotheke ist da.', 'die Apotheke.', 'die'),
      v('a1_h_n4', 'Termin', 'lịch hẹn', 'Ich habe einen Termin.', 'der Termin + Akkusativ.', 'der'),
    ],
  },
  [TRAVEL]: {
    verb: [
      v('a1_t_v1', 'fahren', 'đi (phương tiện)', 'Ich fahre mit dem Bus.', 'Fahren + mit + Dativ.'),
      v('a1_t_v2', 'kommen', 'đến', 'Ich komme aus Vietnam.', 'Kommen aus + Dativ.'),
      v('a1_t_v3', 'fliegen', 'bay', 'Ich fliege nach Berlin.', 'Fliegen nach + Dativ.'),
      v('a1_t_v4', 'suchen', 'tìm', 'Ich suche den Bahnhof.', 'Suchen + Akkusativ.'),
    ],
    adjective: [
      v('a1_t_a1', 'weit', 'xa', 'Berlin ist weit.', ''),
      v('a1_t_a2', 'nah', 'gần', 'Der Bahnhof ist nah.', ''),
      v('a1_t_a3', 'schnell', 'nhanh', 'Der Zug ist schnell.', ''),
      v('a1_t_a4', 'langsam', 'chậm', 'Der Bus ist langsam.', ''),
    ],
    noun: [
      v('a1_t_n1', 'Bahnhof', 'ga tàu', 'Wo ist der Bahnhof?', 'der Bahnhof.', 'der'),
      v('a1_t_n2', 'Ticket', 'vé', 'Ich kaufe ein Ticket.', 'das Ticket.', 'das'),
      v('a1_t_n3', 'Zug', 'tàu', 'Der Zug kommt.', 'der Zug.', 'der'),
      v('a1_t_n4', 'Flughafen', 'sân bay', 'Der Flughafen ist groß.', 'der Flughafen.', 'der'),
    ],
  },
  [HOME]: {
    verb: [
      v('a1_ho_v1', 'wohnen', 'sống', 'Ich wohne in einer Wohnung.', ''),
      v('a1_ho_v2', 'kochen', 'nấu', 'Ich koche Abendessen.', ''),
      v('a1_ho_v3', 'putzen', 'dọn dẹp', 'Ich putze die Küche.', 'Putzen + Akkusativ.'),
      v('a1_ho_v4', 'schlafen', 'ngủ', 'Ich schlafe im Schlafzimmer.', ''),
    ],
    adjective: [
      v('a1_ho_a1', 'hell', 'sáng', 'Die Wohnung ist hell.', ''),
      v('a1_ho_a2', 'dunkel', 'tối', 'Das Zimmer ist dunkel.', ''),
      v('a1_ho_a3', 'sauber', 'sạch', 'Die Küche ist sauber.', ''),
      v('a1_ho_a4', 'schmutzig', 'bẩn', 'Das Bad ist schmutzig.', ''),
    ],
    noun: [
      v('a1_ho_n1', 'Wohnung', 'căn hộ', 'Meine Wohnung ist klein.', 'die Wohnung.', 'die'),
      v('a1_ho_n2', 'Zimmer', 'phòng', 'Das Zimmer ist groß.', 'das Zimmer.', 'das'),
      v('a1_ho_n3', 'Küche', 'bếp', 'Die Küche ist neu.', 'die Küche.', 'die'),
      v('a1_ho_n4', 'Miete', 'tiền thuê', 'Die Miete ist hoch.', 'die Miete.', 'die'),
    ],
  },
};

// —— A2: cụm từ hàng ngày, ~6 mục ——
const A2 = {
  [FAMILY]: {
    verb: [
      v('a2_f_v1', 'sich vorstellen', 'giới thiệu bản thân', 'Darf ich mich vorstellen?', 'Phản thân sich – Goethe A2.'),
      v('a2_f_v2', 'sich verstehen', 'hiểu nhau', 'Wir verstehen uns gut.', 'Cụm gia đình/bạn bè.'),
      v('a2_f_v3', 'besuchen', 'thăm', 'Ich besuche meine Großeltern.', ''),
      v('a2_f_v4', 'sich freuen auf', 'mong chờ', 'Ich freue mich auf das Treffen.', 'Freuen auf + Akkusativ.'),
      v('a2_f_v5', 'sich streiten', 'cãi nhau', 'Die Kinder streiten sich.', 'Phản thân.'),
      v('a2_f_v6', 'umziehen', 'chuyển nhà', 'Wir ziehen nächsten Monat um.', 'Trennbare Verben.'),
    ],
    adjective: [
      v('a2_f_a1', 'verheiratet', 'đã kết hôn', 'Meine Schwester ist verheiratet.', ''),
      v('a2_f_a2', 'geschieden', 'ly hôn', 'Er ist geschieden.', ''),
      v('a2_f_a3', 'allein', 'một mình', 'Sie lebt allein.', ''),
      v('a2_f_a4', 'eng', 'thân thiết', 'Wir sind eng befreundet.', 'Befreundet = là bạn.'),
      v('a2_f_a5', 'stolz', 'tự hào', 'Meine Eltern sind stolz auf mich.', 'Stolz auf + Akkusativ.'),
      v('a2_f_a6', 'verwandt', 'họ hàng', 'Wir sind nicht verwandt.', ''),
    ],
    noun: [
      v('a2_f_n1', 'Verwandte', 'người thân', 'Ich besuche meine Verwandten.', 'der/die Verwandte.', 'die'),
      v('a2_f_n2', 'Ehemann', 'chồng', 'Ihr Ehemann arbeitet in Berlin.', 'der Ehemann.', 'der'),
      v('a2_f_n3', 'Ehefrau', 'vợ', 'Seine Ehefrau ist Ärztin.', 'die Ehefrau.', 'die'),
      v('a2_f_n4', 'Beziehung', 'mối quan hệ', 'Unsere Beziehung ist gut.', 'die Beziehung.', 'die'),
      v('a2_f_n5', 'Hochzeit', 'đám cưới', 'Die Hochzeit war schön.', 'die Hochzeit.', 'die'),
      v('a2_f_n6', 'Geburtstag', 'sinh nhật', 'Herzlichen Glückwunsch zum Geburtstag!', 'der Geburtstag.', 'der'),
    ],
  },
  [WORK]: {
    verb: [
      v('a2_w_v1', 'sich bewerben', 'ứng tuyển', 'Ich bewerbe mich um die Stelle.', 'Bewerben um + Akkusativ.'),
      v('a2_w_v2', 'vorstellen', 'giới thiệu, trình bày', 'Darf ich mich vorstellen?', ''),
      v('a2_w_v3', 'verdienen', 'kiếm (tiền)', 'Ich verdiene 2000 Euro.', ''),
      v('a2_w_v4', 'kündigen', 'nghỉ việc / sa thải', 'Er hat gekündigt.', 'Hay trong CV/phỏng vấn.'),
      v('a2_w_v5', 'sich qualifizieren', 'đủ trình độ', 'Ich qualifiziere mich für den Job.', ''),
      v('a2_w_v6', 'einen Termin vereinbaren', 'đặt lịch hẹn', 'Können wir einen Termin vereinbaren?', 'Goethe email A2.'),
    ],
    adjective: [
      v('a2_w_a1', 'selbstständig', 'tự làm chủ', 'Ich bin selbstständig.', ''),
      v('a2_w_a2', 'motiviert', 'có động lực', 'Ich bin sehr motiviert.', ''),
      v('a2_w_a3', 'zuverlässig', 'đáng tin cậy', 'Er ist zuverlässig.', 'CV/Phỏng vấn.'),
      v('a2_w_a4', 'flexibel', 'linh hoạt', 'Ich bin flexibel.', ''),
      v('a2_w_a5', 'erfahren', 'có kinh nghiệm', 'Sie ist erfahren.', ''),
      v('a2_w_a6', 'verantwortlich', 'có trách nhiệm', 'Ich bin verantwortlich für das Projekt.', 'Für + Akkusativ.'),
    ],
    noun: [
      v('a2_w_n1', 'Bewerbung', 'đơn ứng tuyển', 'Ich schicke meine Bewerbung.', 'die Bewerbung.', 'die'),
      v('a2_w_n2', 'Vorstellungsgespräch', 'phỏng vấn', 'Das Vorstellungsgespräch ist morgen.', 'das Gespräch.', 'das'),
      v('a2_w_n3', 'Gehalt', 'lương', 'Das Gehalt ist gut.', 'das Gehalt.', 'das'),
      v('a2_w_n4', 'Kollege', 'đồng nghiệp', 'Mein Kollege hilft mir.', 'der Kollege.', 'der'),
      v('a2_w_n5', 'Erfahrung', 'kinh nghiệm', 'Ich habe viel Erfahrung.', 'die Erfahrung.', 'die'),
      v('a2_w_n6', 'Arbeitsvertrag', 'hợp đồng lao động', 'Ich unterschreibe den Arbeitsvertrag.', 'der Vertrag.', 'der'),
    ],
  },
  [SHOP]: {
    verb: [
      v('a2_s_v1', 'sich anprobieren', 'thử đồ', 'Ich probiere die Jacke an.', 'Trennbar.'),
      v('a2_s_v2', 'umtauschen', 'đổi hàng', 'Ich möchte das umtauschen.', ''),
      v('a2_s_v3', 'reklamieren', 'khiếu nại', 'Ich möchte reklamieren.', 'Goethe Beschwerde A2.'),
      v('a2_s_v4', 'sich leisten', 'đủ khả năng mua', 'Ich kann mir das nicht leisten.', ''),
      v('a2_s_v5', 'vergleichen', 'so sánh', 'Ich vergleiche die Preise.', ''),
      v('a2_s_v6', 'bestellen', 'đặt hàng', 'Ich bestelle online.', ''),
    ],
    adjective: [
      v('a2_s_a1', 'günstig', 'giá tốt', 'Das Angebot ist günstig.', ''),
      v('a2_s_a2', 'reduziert', 'giảm giá', 'Die Jacke ist reduziert.', ''),
      v('a2_s_a3', 'kaputt', 'hỏng', 'Die Hose ist kaputt.', ''),
      v('a2_s_a4', 'passend', 'vừa', 'Die Größe ist passend.', ''),
      v('a2_s_a5', 'zufrieden', 'hài lòng', 'Ich bin zufrieden.', ''),
      v('a2_s_a6', 'unzufrieden', 'không hài lòng', 'Ich bin unzufrieden mit dem Service.', ''),
    ],
    noun: [
      v('a2_s_n1', 'Umtausch', 'đổi trả', 'Der Umtausch ist möglich.', 'der Umtausch.', 'der'),
      v('a2_s_n2', 'Quittung', 'biên lai', 'Haben Sie die Quittung?', 'die Quittung.', 'die'),
      v('a2_s_n3', 'Größe', 'cỡ', 'Haben Sie eine andere Größe?', 'die Größe.', 'die'),
      v('a2_s_n4', 'Rabatt', 'giảm giá', 'Gibt es einen Rabatt?', 'der Rabatt.', 'der'),
      v('a2_s_n5', 'Kundenservice', 'dịch vụ khách hàng', 'Der Kundenservice ist freundlich.', 'der Service.', 'der'),
      v('a2_s_n6', 'Lieferung', 'giao hàng', 'Die Lieferung ist kostenlos.', 'die Lieferung.', 'die'),
    ],
  },
  [HEALTH]: {
    verb: [
      v('a2_h_v1', 'sich fühlen', 'cảm thấy', 'Ich fühle mich nicht gut.', ''),
      v('a2_h_v2', 'verschreiben', 'kê đơn', 'Der Arzt verschreibt Medikamente.', ''),
      v('a2_h_v3', 'sich erholen', 'hồi phục', 'Ich erhole mich zu Hause.', ''),
      v('a2_h_v4', 'untersuchen', 'khám', 'Der Arzt untersucht mich.', ''),
      v('a2_h_v5', 'sich verletzen', 'bị thương', 'Ich habe mich verletzt.', ''),
      v('a2_h_v6', 'Termin absagen', 'hủy lịch', 'Ich muss den Termin absagen.', ''),
    ],
    adjective: [
      v('a2_h_a1', 'verschreibungspflichtig', 'cần đơn thuốc', 'Das Medikament ist verschreibungspflichtig.', 'B2 từ nhưng có thể gặp A2 đơn giản hóa'),
      v('a2_h_a2', 'chronisch', 'mãn tính', 'Er hat eine chronische Krankheit.', ''),
      v('a2_h_a3', 'ansteckend', 'lây', 'Die Krankheit ist ansteckend.', ''),
      v('a2_h_a4', 'schwanger', 'mang thai', 'Sie ist schwanger.', ''),
      v('a2_h_a5', 'empfindlich', 'nhạy cảm', 'Meine Haut ist empfindlich.', ''),
      v('a2_h_a6', 'verstopft', 'nghẹt mũi', 'Ich bin verstopft.', 'Cảm cúm.'),
    ],
    noun: [
      v('a2_h_n1', 'Versicherungskarte', 'thẻ bảo hiểm', 'Haben Sie Ihre Versicherungskarte?', 'die Karte.', 'die'),
      v('a2_h_n2', 'Rezept', 'đơn thuốc', 'Ich brauche ein Rezept.', 'das Rezept.', 'das'),
      v('a2_h_n3', 'Nebenwirkung', 'tác dụng phụ', 'Gibt es Nebenwirkungen?', 'die Nebenwirkung.', 'die'),
      v('a2_h_n4', 'Vorsorgeuntersuchung', 'khám sàng lọc', 'Ich mache eine Vorsorgeuntersuchung.', 'die Untersuchung.', 'die'),
      v('a2_h_n5', 'Notaufnahme', 'cấp cứu', 'Er ist in der Notaufnahme.', 'die Notaufnahme.', 'die'),
      v('a2_h_n6', 'Überweisung', 'giấy chuyển viện', 'Ich brauche eine Überweisung.', 'die Überweisung.', 'die'),
    ],
  },
  [TRAVEL]: {
    verb: [
      v('a2_t_v1', 'umsteigen', 'đổi tàu/xe', 'Ich muss in München umsteigen.', ''),
      v('a2_t_v2', 'sich verirren', 'lạc đường', 'Ich habe mich verirrt.', ''),
      v('a2_t_v3', 'buchen', 'đặt (vé/phòng)', 'Ich buche ein Hotel online.', ''),
      v('a2_t_v4', 'stornieren', 'hủy đặt', 'Ich muss die Buchung stornieren.', ''),
      v('a2_t_v5', 'einchecken', 'check-in', 'Wir checken um 14 Uhr ein.', ''),
      v('a2_t_v6', 'verspäten', 'trễ', 'Der Zug verspätet sich.', 'Reflexiv sich verspäten.'),
    ],
    adjective: [
      v('a2_t_a1', 'pünktlich', 'đúng giờ', 'Der Zug ist pünktlich.', 'Goethe thường gặp.'),
      v('a2_t_a2', 'verspätet', 'trễ', 'Der Flug ist verspätet.', ''),
      v('a2_t_a3', 'direkt', 'thẳng', 'Gibt es eine direkte Verbindung?', ''),
      v('a2_t_a4', 'ausgebucht', 'hết chỗ', 'Das Hotel ist ausgebucht.', ''),
      v('a2_t_a5', 'gepäckfrei', 'không hành lý ký gửi', 'Ich reise nur mit Handgepäck.', ''),
      v('a2_t_a6', 'barrierefrei', 'không rào cản', 'Ist der Bahnhof barrierefrei?', ''),
    ],
    noun: [
      v('a2_t_n1', 'Fahrkarte', 'vé', 'Ich kaufe eine Fahrkarte.', 'die Fahrkarte.', 'die'),
      v('a2_t_n2', 'Gleis', 'đường ray/sân ga', 'Der Zug fährt von Gleis 3.', 'das Gleis.', 'das'),
      v('a2_t_n3', 'Anschluss', 'chuyến nối', 'Ich verpasse den Anschluss.', 'der Anschluss.', 'der'),
      v('a2_t_n4', 'Verspätung', 'sự trễ', 'Es gibt eine Verspätung.', 'die Verspätung.', 'die'),
      v('a2_t_n5', 'Reisepass', 'hộ chiếu', 'Ich brauche meinen Reisepass.', 'der Reisepass.', 'der'),
      v('a2_t_n6', 'Gepäckaufgabe', 'ký gửi hành lý', 'Wo ist die Gepäckaufgabe?', 'die Aufgabe.', 'die'),
    ],
  },
  [HOME]: {
    verb: [
      v('a2_ho_v1', 'mieten', 'thuê', 'Ich miete eine Wohnung.', ''),
      v('a2_ho_v2', 'renovieren', 'cải tạo', 'Wir renovieren die Küche.', ''),
      v('a2_ho_v3', 'sich beschweren', 'phàn nàn', 'Ich beschwere mich beim Vermieter.', 'Goethe Beschwerde.'),
      v('a2_ho_v4', 'reparieren', 'sửa', 'Der Techniker repariert die Heizung.', ''),
      v('a2_ho_v5', 'kündigen (Mietvertrag)', 'chấm dứt thuê', 'Ich kündige die Wohnung.', ''),
      v('a2_ho_v6', 'einziehen', 'dọn vào', 'Wir ziehen nächste Woche ein.', 'Trennbar.'),
    ],
    adjective: [
      v('a2_ho_a1', 'möbliert', 'có nội thất', 'Die Wohnung ist möbliert.', ''),
      v('a2_ho_a2', 'unmöbliert', 'không nội thất', 'Ich suche etwas Unmöbliertes.', ''),
      v('a2_ho_a3', 'zentral', 'trung tâm', 'Die Lage ist zentral.', ''),
      v('a2_ho_a4', 'ruhig', 'yên tĩnh', 'Die Straße ist ruhig.', ''),
      v('a2_ho_a5', 'geräumig', 'rộng rãi', 'Das Wohnzimmer ist geräumig.', ''),
      v('a2_ho_a6', 'energiesparend', 'tiết kiệm năng lượng', 'Die Lampe ist energiesparend.', ''),
    ],
    noun: [
      v('a2_ho_n1', 'Nebenkosten', 'chi phí phụ', 'Die Nebenkosten sind hoch.', 'die Nebenkosten (pl.).', 'die'),
      v('a2_ho_n2', 'Kaution', 'tiền cọc', 'Ich zahle drei Monatsmieten Kaution.', 'die Kaution.', 'die'),
      v('a2_ho_n3', 'Vermieter', 'chủ nhà', 'Der Vermieter ist freundlich.', 'der Vermieter.', 'der'),
      v('a2_ho_n4', 'Heizung', 'sưởi', 'Die Heizung funktioniert nicht.', 'die Heizung.', 'die'),
      v('a2_ho_n5', 'Hausordnung', 'nội quy nhà', 'Bitte beachten Sie die Hausordnung.', 'die Ordnung.', 'die'),
      v('a2_ho_n6', 'Wohnungsbesichtigung', 'xem nhà', 'Ich habe eine Wohnungsbesichtigung.', 'die Besichtigung.', 'die'),
    ],
  },
};

// —— B1: ~8 mục, cấu trúc phức tạp hơn ——
const mkB1Topic = (prefix, topicKey, verbs, adjs, nouns) => ({
  verb: verbs.map((x, i) => v(`${prefix}_v${i + 1}`, ...x)),
  adjective: adjs.map((x, i) => v(`${prefix}_a${i + 1}`, ...x)),
  noun: nouns.map((x, i) => v(`${prefix}_n${i + 1}`, x[0], x[1], x[2], x[3], x[4] || '')),
});

const B1 = {
  [FAMILY]: mkB1Topic(
    'b1_f',
    'family',
    [
      ['sich auseinandersetzen', 'đối diện/vượt qua xung đột', 'Wir müssen uns mit dem Problem auseinandersetzen.', 'Auseinandersetzen mit + Dativ.'],
      ['vermitteln', 'hòa giải', 'Die Tante vermittelt im Streit.', ''],
      ['pflegen', 'chăm sóc', 'Sie pflegt ihre kranke Mutter.', ''],
      ['sich distanzieren', 'xa cách', 'Er distanziert sich von der Entscheidung.', ''],
      ['Generationenkonflikt bewältigen', 'vượt qua xung đột thế hệ', 'Viele Familien bewältigen Generationenkonflikte.', 'Goethe B1 Meinung.'],
      ['sich einigen', 'thỏa thuận', 'Wir haben uns geeinigt.', ''],
      ['unterstützen', 'hỗ trợ', 'Meine Eltern unterstützen mich finanziell.', ''],
      ['sich verständigen', 'thống nhất ý', 'Wir müssen uns besser verständigen.', ''],
    ],
    [
      ['generationenübergreifend', 'liên thế hệ', 'Das ist ein generationenübergreifendes Projekt.', ''],
      ['verantwortungsvoll', 'có trách nhiệm', 'Er ist ein verantwortungsvoller Vater.', ''],
      ['konfliktbeladen', 'đầy xung đột', 'Die Situation ist konfliktbeladen.', ''],
      ['harmonisch', 'hài hòa', 'Wir leben harmonisch zusammen.', ''],
      ['belastet', 'căng thẳng', 'Die Beziehung ist belastet.', ''],
      ['unterstützend', 'hỗ trợ', 'Sie ist sehr unterstützend.', ''],
      ['unabhängig', 'độc lập', 'Mein Sohn ist jetzt unabhängig.', ''],
      ['loyal', 'trung thành', 'Die Familie ist mir loyal.', ''],
    ],
    [
      ['Patchworkfamilie', 'gia đình tái hợp', 'Patchworkfamilien sind heute normal.', 'die Familie.', 'die'],
      ['Erziehung', 'giáo dục', 'Die Erziehung ist wichtig.', 'die Erziehung.', 'die'],
      ['Bindung', 'gắn kết', 'Die emotionale Bindung ist stark.', 'die Bindung.', 'die'],
      ['Trennung', 'ly thân', 'Nach der Trennung...', 'die Trennung.', 'die'],
      ['Sorgerecht', 'quyền nuôi con', 'Wer hat das Sorgerecht?', 'das Recht.', 'das'],
      ['Familienplanung', 'kế hoạch hóa gia đình', 'Wir sprechen über Familienplanung.', 'die Planung.', 'die'],
      ['Angehörige', 'người thân', 'Die Angehörigen wurden informiert.', 'der Angehörige.', 'die'],
      ['Vertrauensbruch', 'phản bội niềm tin', 'Das war ein Vertrauensbruch.', 'der Bruch.', 'der'],
    ]
  ),
  [WORK]: mkB1Topic(
    'b1_w',
    'work',
    [
      ['sich weiterbilden', 'học thêm', 'Ich bilde mich beruflich weiter.', ''],
      ['verhandeln', 'đàm phán', 'Wir verhandeln über das Gehalt.', 'Verhandeln über + Akkusativ.'],
      ['kündigen', 'sa thải/nghỉ', 'Das Unternehmen kündigt Mitarbeiter.', ''],
      ['sich spezialisieren', 'chuyên sâu', 'Ich spezialisiere mich auf Marketing.', 'Spezialisieren auf.'],
      ['eine Führungsrolle übernehmen', 'đảm nhận vai trò lãnh đạo', 'Sie übernimmt eine Führungsrolle.', ''],
      ['Homeoffice machen', 'làm việc tại nhà', 'Ich mache zweimal pro Woche Homeoffice.', 'Đời sống + Goethe.'],
      ['sich bewerben um', 'ứng tuyển', 'Er bewirbt sich um die Leitungsposition.', ''],
      ['eine Kündigung einreichen', 'nộp đơn nghỉ', 'Ich reiche meine Kündigung ein.', ''],
    ],
    [
      ['überlastet', 'quá tải', 'Viele Mitarbeiter sind überlastet.', ''],
      ['motiviert', 'có động lực', 'Das Team ist motiviert.', ''],
      ['qualifiziert', 'đủ trình độ', 'Sie ist gut qualifiziert.', ''],
      ['arbeitsmarktrelevant', 'liên quan thị trường lao động', 'Der Kurs ist arbeitsmarktrelevant.', ''],
      ['unbefristet', 'không thời hạn', 'Ich habe einen unbefristeten Vertrag.', ''],
      ['befristet', 'có thời hạn', 'Es ist nur befristet.', ''],
      ['teamfähig', 'làm việc nhóm tốt', 'Teamfähigkeit ist wichtig.', ''],
      ['belastbar', 'chịu áp lực tốt', 'Er ist sehr belastbar.', ''],
    ],
    [
      ['Arbeitsbedingungen', 'điều kiện làm việc', 'Die Arbeitsbedingungen verbessern sich.', 'die Bedingungen.', 'die'],
      ['Weiterbildung', 'đào tạo thêm', 'Die Firma bietet Weiterbildung.', 'die Bildung.', 'die'],
      ['Kündigungsfrist', 'thời hạn báo trước', 'Die Kündigungsfrist beträgt 3 Monate.', 'die Frist.', 'die'],
      ['Probezeit', 'thử việc', 'Die Probezeit dauert 6 Monate.', 'die Zeit.', 'die'],
      ['Work-Life-Balance', 'cân bằng công–việc', 'Work-Life-Balance ist mir wichtig.', 'die Balance.', 'die'],
      ['Überstunden', 'làm thêm giờ', 'Ich mache viele Überstunden.', 'die Stunde (pl.).', 'die'],
      ['Betriebsrat', 'hội đồng nhân viên', 'Der Betriebsrat hilft.', 'der Rat.', 'der'],
      ['Gehaltsverhandlung', 'đàm phán lương', 'Die Gehaltsverhandlung war schwierig.', 'die Verhandlung.', 'die'],
    ]
  ),
};

// Fill remaining B1 topics by cloning structure with topic-specific tweaks from A2 + extra items
const cloneTopicWithExtras = (source, prefix, extraVerb, extraAdj, extraNoun) => {
  const out = {};
  for (const type of ['verb', 'adjective', 'noun']) {
    const base = [...(source[type] || [])];
    if (type === 'verb' && extraVerb) base.push(extraVerb);
    if (type === 'adjective' && extraAdj) base.push(extraAdj);
    if (type === 'noun' && extraNoun) base.push(extraNoun);
    out[type] = base.map((item, i) => ({ ...item, id: `${prefix}_${type[0]}_${i + 1}` }));
  }
  return out;
};

B1[SHOP] = cloneTopicWithExtras(
  A2[SHOP],
  'b1_s',
  v('b1_s_v9', 'sich beschweren', 'phàn nàn', 'Ich beschwere mich über die Lieferung.', 'Goethe Beschwerde B1.'),
  v('b1_s_a9', 'irreführend', 'gây hiểu nhầm', 'Die Werbung war irreführend.', ''),
  v('b1_s_n9', 'Gewährleistung', 'bảo hành', 'Die Gewährleistung gilt 2 Jahre.', 'die Gewährleistung.', 'die')
);
B1[HEALTH] = cloneTopicWithExtras(
  A2[HEALTH],
  'b1_h',
  v('b1_h_v9', 'sich erholen von', 'hồi phục sau', 'Er erholt sich von der Operation.', 'Erholen von.'),
  v('b1_h_a9', 'verschlimmert', 'trầm trọng hơn', 'Der Zustand hat sich verschlimmert.', ''),
  v('b1_h_n9', 'Gesundheitssystem', 'hệ thống y tế', 'Das Gesundheitssystem ist überlastet.', 'das System.', 'das')
);
B1[TRAVEL] = cloneTopicWithExtras(
  A2[TRAVEL],
  'b1_t',
  v('b1_t_v9', 'sich erkundigen nach', 'hỏi thăm', 'Ich erkundige mich nach dem Anschluss.', 'Erkundigen nach.'),
  v('b1_t_a9', 'nachhaltig', 'bền vững', 'Wir reisen nachhaltig.', ''),
  v('b1_t_n9', 'Reiseversicherung', 'bảo hiểm du lịch', 'Die Reiseversicherung ist wichtig.', 'die Versicherung.', 'die')
);
B1[HOME] = cloneTopicWithExtras(
  A2[HOME],
  'b1_ho',
  v('b1_ho_v9', 'den Mietvertrag kündigen', 'chấm dứt hợp đồng thuê', 'Wir kündigen den Mietvertrag.', ''),
  v('b1_ho_a9', 'schimmelig', 'ẩm mốc', 'Das Bad ist schimmelig.', ''),
  v('b1_ho_n9', 'Mietpreisbremse', 'trần giá thuê', 'Die Mietpreisbremse gilt in Berlin.', 'die Bremse.', 'die')
);

// —— B2: ~10 mục, học thuật / Goethe cao ——
const mkB2Topic = (prefix, verbs, adjs, nouns) => ({
  verb: verbs.map((x, i) => v(`${prefix}_v${i + 1}`, ...x)),
  adjective: adjs.map((x, i) => v(`${prefix}_a${i + 1}`, ...x)),
  noun: nouns.map((x, i) => v(`${prefix}_n${i + 1}`, x[0], x[1], x[2], x[3], x[4] || '')),
});

const B2 = {
  [FAMILY]: mkB2Topic(
    'b2_f',
    [
      ['die familiäre Dynamik analysieren', 'phân tích động lực gia đình', 'In meinem Essay analysiere ich die familiäre Dynamik.', 'B2 Schreiben.'],
      ['intergenerationell vermitteln', 'hòa giải liên thế hệ', 'Sie vermittelt intergenerationell.', ''],
      ['sich distanzieren von', 'xa lánh', 'Er distanziert sich von traditionellen Rollenbildern.', ''],
      ['emotional belasten', 'gây căng thẳng cảm xúc', 'Der Konflikt belastet die ganze Familie.', ''],
      ['Verantwortung übernehmen', 'nhận trách nhiệm', 'Als Elternteil übernehme ich Verantwortung.', ''],
      ['sich versöhnen', 'hòa giải', 'Nach Jahren haben sie sich versöhnt.', 'Versöhnen mit + Dativ.'],
      ['pflegen', 'duy trì (quan hệ)', 'Man muss Freundschaften pflegen.', ''],
      ['institutionalisierte Betreuung in Anspruch nehmen', 'dùng dịch vụ chăm sóc', 'Viele nehmen Betreuung in Anspruch.', 'Nominalstil B2.'],
      ['sich auseinandersetzen mit', 'đào sâu vấn đề', 'Wir setzen uns mit dem Thema auseinander.', ''],
      ['Prioritäten setzen', 'đặt ưu tiên', 'In der Familie muss man Prioritäten setzen.', ''],
    ],
    [
      ['intergenerationell', 'liên thế hệ', 'intergenerationelle Projekte', ''],
      ['konfliktbeladen', 'đầy mâu thuẫn', 'eine konfliktbeladene Situation', ''],
      ['vorurteilsfrei', 'không định kiến', 'vorurteilsfrei erziehen', ''],
      ['resilient', 'kiên cường', 'resiliente Familienstrukturen', ''],
      ['ambivalent', 'lưỡng lự', 'ambivalente Gefühle', ''],
      ['traditionsbewusst', 'ý thức truyền thống', 'traditionsbewusst leben', ''],
      ['emanzipiert', 'giải phóng', 'emanzipierte Rollenverteilung', ''],
      ['marginalisiert', 'bị gạt ra lề', 'marginalisierte Gruppen', ''],
      ['nachhaltig', 'bền vững', 'nachhaltige Familienplanung', ''],
      ['integrativ', 'hòa nhập', 'integrative Erziehung', ''],
    ],
    [
      ['Rollenbild', 'hình mẫu vai trò', 'traditionelle Rollenbilder', 'das Bild.', 'das'],
      ['Erziehungsstil', 'phong cách giáo dục', 'autoritärer Erziehungsstil', 'der Stil.', 'der'],
      ['Generationenvertrag', 'khế ước thế hệ', 'der Generationenvertrag', 'der Vertrag.', 'der'],
      ['Patchworkkonstellation', 'cấu trúc gia đình tái hợp', 'komplexe Patchworkkonstellation', 'die Konstellation.', 'die'],
      ['Bindungsforschung', 'nghiên cứu gắn bó', 'laut Bindungsforschung...', 'die Forschung.', 'die'],
      ['Care-Arbeit', 'công việc chăm sóc', 'Care-Arbeit wird oft unsichtbar.', 'die Arbeit.', 'die'],
      ['Familienpolitik', 'chính sách gia đình', 'die Familienpolitik reformieren', 'die Politik.', 'die'],
      ['Vermittlungsgespräch', 'buổi hòa giải', 'ein Vermittlungsgespräch führen', 'das Gespräch.', 'das'],
      ['Vertrauensbasis', 'nền tảng tin cậy', 'eine stabile Vertrauensbasis', 'die Basis.', 'die'],
      ['Sozialisation', 'quá trình xã hội hóa', 'frühkindliche Sozialisation', 'die Sozialisation.', 'die'],
    ]
  ),
};

B2[WORK] = cloneTopicWithExtras(
  B1[WORK],
  'b2_w',
  ['die Arbeitsmarktintegration fördern', 'thúc đẩy hòa nhập thị trường lao động', 'Die Politik fördert Arbeitsmarktintegration.', 'Nominalstil.'],
  ['arbeitsrechtlich', 'thuộc luật lao động', 'arbeitsrechtliche Fragen klären', ''],
  ['Arbeitsplatzsicherheit', 'an toàn nơi làm việc', 'Arbeitsplatzsicherheit gewährleisten', 'die Sicherheit.', 'die']
);
B2[SHOP] = cloneTopicWithExtras(B1[SHOP], 'b2_s',
  ['Reklamation geltend machen', 'đòi quyền khiếu nại', 'Ich mache meine Reklamation geltend.', ''],
  ['verbraucherschutzrechtlich', 'thuộc bảo vệ người tiêu dùng', 'verbraucherschutzrechtliche Aspekte', ''],
  ['Kaufvertrag', 'hợp đồng mua bán', 'der Kaufvertrag wurde angefochten', 'der Vertrag.', 'der']
);
B2[HEALTH] = cloneTopicWithExtras(B1[HEALTH], 'b2_h',
  ['präventiv handeln', 'hành động phòng ngừa', 'Man sollte präventiv handeln.', ''],
  ['gesundheitspolitisch', 'thuộc chính sách y tế', 'gesundheitspolitische Debatten', ''],
  ['Versorgungsqualität', 'chất lượng chăm sóc', 'die Versorgungsqualität verbessern', 'die Qualität.', 'die']
);
B2[TRAVEL] = cloneTopicWithExtras(B1[TRAVEL], 'b2_t',
  ['Mobilität nachhaltig gestalten', 'tổ chức di chuyển bền vững', 'Städte gestalten Mobilität nachhaltig.', ''],
  ['infrastrukturell', 'thuộc hạ tầng', 'infrastrukturelle Engpässe', ''],
  ['Personenverkehr', 'vận tải hành khách', 'der öffentliche Personenverkehr', 'der Verkehr.', 'der']
);
B2[HOME] = cloneTopicWithExtras(B1[HOME], 'b2_ho',
  ['Wohnraumversorgung sicherstellen', 'đảm bảo nhà ở', 'Kommunen sichern Wohnraumversorgung.', ''],
  ['mietpreisgebunden', 'giá thuê bị ràng buộc', 'mietpreisgebundene Wohnungen', ''],
  ['Wohnungsnot', 'thiếu nhà ở', 'in Ballungsräumen herrscht Wohnungsnot', 'die Not.', 'die']
);

const VOCABULARY_BY_LEVEL = { A1, A2, B1, B2 };

/** Đề Schreiben theo level + dạng bài */
const WRITING_PROMPTS = {
  A1: {
    Email: {
      title: 'E-Mail: Kurze Nachricht',
      instruction: 'Viết email ngắn (tiếng Đức) cho bạn bè, mời họ đến sinh nhật của bạn. Nêu ngày, giờ, địa điểm.',
      requirements: ['Chào hỏi', 'Lời mời', 'Thời gian và địa điểm', 'Kết thúc lịch sự'],
      suggestedLength: '35–50 từ',
    },
    Beschwerde: {
      title: 'Beschwerde: Im Café',
      instruction: 'Viết vài câu phàn nàn lịch sự vì đồ uống sai hoặc quá lạnh.',
      requirements: ['Nêu vấn đề', 'Yêu cầu sửa', 'Lịch sự'],
      suggestedLength: '35–50 từ',
    },
    Meinung: {
      title: 'Meinung: Mein Hobby',
      instruction: 'Viết đoạn ngắn về sở thích của bạn và tại sao bạn thích nó.',
      requirements: ['Giới thiệu sở thích', 'Lý do', '1–2 câu kết'],
      suggestedLength: '35–50 từ',
    },
  },
  A2: {
    Email: {
      title: 'E-Mail: Termin beim Arzt',
      instruction:
        'Viết email cho phòng khám: xin đặt lịch, nêu triệu chứng ngắn gọn, hỏi giờ mở cửa và xin xác nhận.',
      requirements: ['Lý do viết', 'Triệu chứng', 'Thời gian rảnh', 'Kết thúc lịch sự'],
      suggestedLength: '70–100 từ',
    },
    Beschwerde: {
      title: 'Beschwerde: Online-Bestellung',
      instruction: 'Viết email khiếu nại vì sản phẩm bị hỏng hoặc giao sai. Yêu cầu đổi/trả hoặc hoàn tiền.',
      requirements: ['Mô tả đơn hàng', 'Vấn đề', 'Yêu cầu cụ thể', 'Đính kèm hóa đơn (đề cập)'],
      suggestedLength: '70–100 từ',
    },
    Meinung: {
      title: 'Meinung: Homeoffice',
      instruction: 'Bày tỏ ý kiến: làm việc tại nhà có lợi hay có hại? Nêu 2–3 lý do.',
      requirements: ['Quan điểm rõ', '2–3 lý do', 'Câu mở và kết'],
      suggestedLength: '70–100 từ',
    },
  },
  B1: {
    Email: {
      title: 'E-Mail: Bewerbung Nachfrage',
      instruction:
        'Viết email hỏi lại sau khi nộp đơn ứng tuyển: hỏi tiến độ, thể hiện sự quan tâm, cảm ơn.',
      requirements: ['Nhắc vị trí ứng tuyển', 'Hỏi tiến độ', 'Thể hiện động lực', 'Kết thúc chuyên nghiệp'],
      suggestedLength: '110–150 từ',
    },
    Beschwerde: {
      title: 'Beschwerde: Lärm in der Wohnung',
      instruction: 'Viết thư phàn nàn cho chủ nhà hoặc hàng xóm về tiếng ồn. Nêu thời gian, ảnh hưởng, đề xuất giải pháp.',
      requirements: ['Mô tả vấn đề', 'Ảnh hưởng', 'Đề xuất', 'Tone lịch sự nhưng rõ ràng'],
      suggestedLength: '110–150 từ',
    },
    Meinung: {
      title: 'Meinung: Soziale Medien',
      instruction: 'Viết bài luận ngắn: mạng xã hội có nhiều lợi ích hay hại hơn cho thanh thiếu niên?',
      requirements: ['Thesis rõ', 'Ưu và nhược', 'Ví dụ', 'Kết luận'],
      suggestedLength: '110–150 từ',
    },
  },
  B2: {
    Email: {
      title: 'E-Mail: Formelle Beschwerde',
      instruction:
        'Viết email trang trọng phàn nán dịch vụ (ngân hàng/nhà mạng): mô tả sự cố, trích dẫn hợp đồng hoặc quyền lợi, yêu cầu xử lý trong thời hạn.',
      requirements: ['Bối cảnh', 'Chi tiết sự cố', 'Yêu cầu pháp lý/ hợp đồng', 'Deadline và hậu quả'],
      suggestedLength: '150–200 từ',
    },
    Beschwerde: {
      title: 'Beschwerde: Diskriminierung am Arbeitsplatz',
      instruction: 'Viết đơn khiếu nại nội bộ hoặc thư cho HR về hành vi không công bằng. Giữ giọng văn khách quan.',
      requirements: ['Sự kiện cụ thể', 'Bằng chứng', 'Tác động', 'Đề xuất biện pháp'],
      suggestedLength: '150–200 từ',
    },
    Meinung: {
      title: 'Meinung: Klimapolitik',
      instruction: 'Viết bài argumentativ: liệu các biện pháp khí hậu hiện tại có đủ mạnh? Dùng cấu trúc B2 (Konjunktiv II, Nominalisierung).',
      requirements: ['Luận điểm', 'Phản biện', 'Ví dụ thực tế', 'Kết luận có chiều sâu'],
      suggestedLength: '150–200 từ',
    },
  },
};

export const normalizeLevel = (level) => {
  const upper = (level || 'A2').toUpperCase();
  return VOCABULARY_BY_LEVEL[upper] ? upper : 'A2';
};

export const getLevelConfig = (level) => LEVEL_CONFIG[normalizeLevel(level)];

export const getVocabularyList = (level, topic, wordType) => {
  const lvl = normalizeLevel(level);
  const items = VOCABULARY_BY_LEVEL[lvl]?.[topic]?.[wordType] || [];
  return items.map((item) => ({ ...item }));
};

export const getWritingPrompt = (level, taskType) => {
  const lvl = normalizeLevel(level);
  const prompts = WRITING_PROMPTS[lvl] || WRITING_PROMPTS.A2;
  const prompt = prompts[taskType] || prompts.Email;
  const config = LEVEL_CONFIG[lvl];
  return {
    ...prompt,
    taskType,
    level: lvl,
    targetWords: config.targetWords,
    minWords: config.minWords,
    durationSeconds: config.writingDurationSeconds,
  };
};

/** Chấm điểm mẫu local theo độ dài phù hợp level */
export const evaluateWritingLocally = (level, essay, wordCount) => {
  const config = getLevelConfig(level);
  const target = config.targetWords;
  const min = config.minWords;
  const ratio = wordCount / target;
  const lengthScore =
    wordCount < min * 0.6 ? 45 : Math.min(100, Math.round(50 + ratio * 50));
  const grammarScore = normalizeLevel(level) === 'A1' ? 72 : normalizeLevel(level) === 'B2' ? 68 : 75;
  const vocabularyScore = lengthScore > 60 ? 78 : 65;
  const taskAchievementScore = wordCount >= min ? 80 : 55;
  const overallScore = Math.round(
    (lengthScore + grammarScore + vocabularyScore + taskAchievementScore) / 4
  );

  return {
    overallScore,
    grammarScore,
    vocabularyScore,
    taskAchievementScore,
    feedback: `Bài viết ${wordCount} từ (mục tiêu ${config.label}: khoảng ${target} từ). Đây là phản hồi mẫu theo độ dài và trình độ — bạn có thể tự đối chiếu với yêu cầu đề.`,
    correctedVersion: essay,
    keyMistakes: [],
    improvementTips: [
      `Cố gắng đạt khoảng ${target} từ cho level ${normalizeLevel(level)}.`,
      'Kiểm tra lại chính tả và chia động từ ở cuối câu.',
      'Dùng từ nối (deshalb, außerdem, jedoch) phù hợp trình độ.',
    ],
  };
};

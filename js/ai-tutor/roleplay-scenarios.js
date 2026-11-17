// 8 roleplay scenarios for the AI Tutor module.
// Scenario text (roles, tasks, openings) is editorial UI content for the
// module — it is NOT lesson content and is never mixed into lesson data.
// Suggested words are hints only; the guardrail checks them against the
// official lexicon at runtime and the view only shows words that exist.

export const SCENARIOS = [
  {
    id: "restaurant",
    titleVi: "Gọi món tại nhà hàng",
    aiRoleVi: "Nhân viên phục vụ nhà hàng ở Bắc Kinh",
    aiRoleZh: "北京一家饭店的服务员",
    learnerRoleVi: "Khách tới ăn",
    opening: { hanzi: "您好，欢迎光临！请问您几位？", pinyin: "Nín hǎo, huānyíng guānglín! Qǐngwèn nín jǐ wèi?", translation_vi: "Xin chào, chào mừng quý khách! Xin hỏi ngài đi mấy người ạ?" },
    tasksVi: ["Chào và nói số người đi ăn", "Gọi ít nhất hai món và một đồ uống", "Hỏi giá và thanh toán"],
    suggestedWords: ["吃", "饭", "水", "茶", "多少", "钱", "来", "好吃"],
  },
  {
    id: "shopping",
    titleVi: "Mua sắm",
    aiRoleVi: "Người bán hàng trong cửa hàng quần áo",
    aiRoleZh: "服装店的售货员",
    learnerRoleVi: "Khách mua hàng",
    opening: { hanzi: "您好，欢迎光临！您想买什么？", pinyin: "Nín hǎo, huānyíng guānglín! Nín xiǎng mǎi shénme?", translation_vi: "Xin chào, chào mừng! Ngài muốn mua gì ạ?" },
    tasksVi: ["Nói món đồ muốn mua", "Hỏi giá và thử mặc cả nhẹ nhàng", "Hỏi màu/size khác rồi quyết định mua hay không"],
    suggestedWords: ["买", "多少", "钱", "大", "小", "贵", "便宜", "衣服"],
  },
  {
    id: "directions",
    titleVi: "Hỏi đường",
    aiRoleVi: "Người qua đường thân thiện ở Bắc Kinh",
    aiRoleZh: "北京一位热心的路人",
    learnerRoleVi: "Du khách đang tìm đường",
    opening: { hanzi: "您好，您要去哪儿？我可以帮您。", pinyin: "Nín hǎo, nín yào qù nǎr? Wǒ kěyǐ bāng nín.", translation_vi: "Chào bạn, bạn muốn đi đâu? Tôi có thể giúp bạn." },
    tasksVi: ["Nói nơi mình muốn đến", "Hỏi đi bằng gì / đi bao lâu", "Cảm ơn và xác nhận lại đường đi"],
    suggestedWords: ["去", "怎么", "走", "哪儿", "远", "车站", "谢谢", "在"],
  },
  {
    id: "bus",
    titleVi: "Đi xe buýt",
    aiRoleVi: "Tài xế xe buýt",
    aiRoleZh: "公共汽车司机",
    learnerRoleVi: "Hành khách lần đầu đi xe buýt ở Trung Quốc",
    opening: { hanzi: "请上车。您到哪一站下车？", pinyin: "Qǐng shàng chē. Nín dào nǎ yí zhàn xià chē?", translation_vi: "Mời lên xe. Bạn xuống ở trạm nào?" },
    tasksVi: ["Nói trạm mình muốn xuống", "Hỏi xe có đi qua nơi cần đến không", "Hỏi bao nhiêu trạm nữa / giá vé"],
    suggestedWords: ["车", "车站", "下", "到", "多少", "钱", "去", "坐"],
  },
  {
    id: "workplace",
    titleVi: "Giao tiếp tại nơi làm việc",
    aiRoleVi: "Trưởng phòng nơi bạn mới vào làm",
    aiRoleZh: "你新公司的经理",
    learnerRoleVi: "Nhân viên mới ngày đầu đi làm",
    opening: { hanzi: "欢迎你来我们公司！请先介绍一下你自己。", pinyin: "Huānyíng nǐ lái wǒmen gōngsī! Qǐng xiān jièshào yíxià nǐ zìjǐ.", translation_vi: "Chào mừng bạn đến công ty chúng tôi! Mời bạn giới thiệu về mình trước." },
    tasksVi: ["Giới thiệu tên, quê quán, công việc", "Hỏi giờ làm việc và việc cần làm hôm nay", "Hẹn gặp lại và chào tạm biệt lịch sự"],
    suggestedWords: ["工作", "公司", "我", "是", "今天", "明天", "时间", "做"],
  },
  {
    id: "colleague",
    titleVi: "Nói chuyện với đồng nghiệp",
    aiRoleVi: "Đồng nghiệp cùng phòng ban, thân thiện",
    aiRoleZh: "一位友好的同事",
    learnerRoleVi: "Đồng nghiệp mới",
    opening: { hanzi: "你好！你是新来的同事吧？我叫小王。", pinyin: "Nǐ hǎo! Nǐ shì xīn lái de tóngshì ba? Wǒ jiào Xiǎo Wáng.", translation_vi: "Chào bạn! Bạn là đồng nghiệp mới đúng không? Mình tên Tiểu Vương." },
    tasksVi: ["Chào lại và giới thiệu tên mình", "Hỏi đồng nghiệp làm việc ở đây lâu chưa", "Hẹn cùng đi ăn trưa"],
    suggestedWords: ["朋友", "叫", "我", "你", "吃", "饭", "一起", "好"],
  },
  {
    id: "self-intro",
    titleVi: "Giới thiệu bản thân",
    aiRoleVi: "Giáo viên chủ nhiệm lớp tiếng Trung",
    aiRoleZh: "中文班的老师",
    learnerRoleVi: "Học viên mới của lớp",
    opening: { hanzi: "同学们好！新同学，请介绍一下你自己。", pinyin: "Tóngxuémen hǎo! Xīn tóngxué, qǐng jièshào yíxià nǐ zìjǐ.", translation_vi: "Chào các em! Bạn học sinh mới, em giới thiệu về mình đi." },
    tasksVi: ["Nói tên, tuổi và quê quán", "Nói mình học tiếng Trung bao lâu và vì sao học", "Nói một sở thích của mình"],
    suggestedWords: ["我", "叫", "是", "学习", "汉语", "喜欢", "岁", "人"],
  },
  {
    id: "daily-life",
    titleVi: "Giao tiếp đời sống tại Trung Quốc",
    aiRoleVi: "Hàng xóm người Trung Quốc thân thiện",
    aiRoleZh: "一位友好的中国邻居",
    learnerRoleVi: "Người Việt mới chuyển tới sống ở Trung Quốc",
    opening: { hanzi: "你好！你刚搬来吗？住在这儿习惯吗？", pinyin: "Nǐ hǎo! Nǐ gāng bān lái ma? Zhù zài zhèr xíguàn ma?", translation_vi: "Chào bạn! Bạn mới chuyển tới à? Sống ở đây quen chưa?" },
    tasksVi: ["Trả lời về việc mới chuyển tới", "Hỏi siêu thị / bệnh viện gần nhất ở đâu", "Cảm ơn và hẹn gặp lại"],
    suggestedWords: ["住", "在", "这儿", "去", "买", "谢谢", "见", "好"],
  },
];

export function scenarioById(id) {
  return SCENARIOS.find((s) => s.id === id) || null;
}

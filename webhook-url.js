module.exports = {
  ERROR: {
    webhookUrl: process.env.SLACK_WEBHOOK_ERROR,
    username: "오류 발생!!!",
    iconEmoji: ":bangbang:",
  },
  OTHERS: {
    webhookUrl: process.env.SLACK_WEBHOOK_OTHERS,
    username: "기타",
    iconEmoji: ":guitar:",
  },
  NEWS_OVERALL: {
    webhookUrl: process.env.SLACK_WEBHOOK_NEWS_OVERALL,
    username: "뉴스종합봇",
    iconEmoji: ":newspaper:",
  },
  CULTURE: {
    webhookUrl: process.env.SLACK_WEBHOOK_CULTURE,
    username: "문화봇",
    iconEmoji: ":musical_note:",
  },
  ECONOMY: {
    webhookUrl: process.env.SLACK_WEBHOOK_ECONOMY,
    username: "경제봇",
    iconEmoji: ":chart_with_upwards_trend:",
  },
  TECH: {
    webhookUrl: process.env.SLACK_WEBHOOK_TECH,
    username: "테크봇",
    iconEmoji: ":computer:",
  },
  BUSINESS: {
    webhookUrl: process.env.SLACK_WEBHOOK_BUSINESS,
    username: "비즈봇",
    iconEmoji: ":unicorn_face:",
  },
};

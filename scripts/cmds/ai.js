const axios = require('axios');

async function fetchFromAI(url, params) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getAIResponse(input, userName, userId, messageID) {
  const services = [
    { url: 'https://ai-chat-gpt-4-lite.onrender.com/api/hercai', params: { question: input } }
  ];

  let response = `💦𝗥𝗨𝗗𝗘𝗨𝗦 𝗕𝗢𝗧💦\n●╭━─━─━─≪✠≫─━─━─━╮●\n𝘀𝗮𝗹𝘂𝘁 𝗺𝗼𝗿𝘁𝗲𝗹 𝗮 𝗾𝘂𝗼𝗶 𝗽𝘂𝗶𝘀 𝗷𝗲 𝘁'𝗮𝗶𝗱𝗲𝗿💁‍♂️`;
  let currentIndex = 0;

  for (let i = 0; i < services.length; i++) {
    const service = services[currentIndex];
    const data = await fetchFromAI(service.url, service.params);
    if (data && (data.gpt4 || data.reply || data.response)) {
      response = data.gpt4 || data.reply || data.response;
      break;
    }
    currentIndex = (currentIndex + 1) % services.length; // Passer au service suivant
  }

  return { response, messageID };
}

module.exports = {
  config: {
    name: 'ai',
    author: 'HAMED JUNIOR',
    role: 0,
    category: 'ai',
    shortDescription: 'ai to ask anything',
  },
  onStart: async function ({ api, event, args }) {
    const input = args.join(' ').trim();
    if (!input) {
      api.sendMessage("💦𝗥𝗨𝗗𝗘𝗨𝗦 𝗔𝗜💦\n ●ッ≪━─━─━─━─◈─━─━─━─━≫●\n𝘀𝗮𝗹𝘂𝘁 𝗺𝗼𝗿𝘁𝗲𝗹 𝗮 𝗾𝘂𝗼𝗶 𝗽𝘂𝗶𝘀 𝗷𝗲 𝘁'𝗮𝗶𝗱𝗲𝗿💁‍♂️", event.threadID, event.messageID);
      return;
    }

    api.getUserInfo(event.senderID, async (err, ret) => {
      if (err) {
        console.error(err);
        return;
      }
      const userName = ret[event.senderID].name;
      const { response, messageID } = await getAIResponse(input, userName, event.senderID, event.messageID);
      api.sendMessage(`✰. 𝗥𝗨𝗗𝗘𝗨𝗦 𝗔𝗥𝗖𝗞𝗘𝗥𝗠𝗔𝗡 .✰:\n●⚊⚊⚊⚊⚊⚊✬✥✬⚊⚊⚊⚊⚊⚊●\n\n${response}\n●❯────────────────❮●\n𝒉𝒊𝒈𝒉𝒍𝒊𝒈𝒉𝒕`, event.threadID, messageID);
    });
  },
  onChat: async function ({ api, event, message }) {
    const messageContent = event.body.trim().toLowerCase();
    if (messageContent.startsWith("ai")) {
      const input = messageContent.replace(/^ai\s*/, "").trim();
      api.getUserInfo(event.senderID, async (err, ret) => {
        if (err) {
          console.error(err);
          return;
        }
        const userName = ret[event.senderID].name;
        const { response, messageID } = await getAIResponse(input, userName, event.senderID, message.messageID);
        message.reply(`✰. . 💦VOICI TA REPONSE💦 . .✰ \n✧══════•❁❀❁•══════✧\n\n${response}\n\n•───────────────────•\n───※ ·❆· ※─── \n∴━━━✿━━━∴\n\n𝘀𝗲𝗻𝗱𝗲𝗿 𝗻𝗮𝗺𝗲: ${userName} 💬\n━━━━━━━━━━━━━━━━━━`, messageID);
api.setMessageReaction("🥴", event.messageID, () => {}, true);

      });
    }
  }
};￼Enter
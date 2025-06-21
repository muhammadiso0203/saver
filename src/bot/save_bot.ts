import { Telegraf } from 'telegraf';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import * as dotenv from 'dotenv';
import { setupAdminPanel } from 'src/admin_panel';
dotenv.config();


const bot = new Telegraf(process.env.BOT_TOKEN!);
setupAdminPanel(bot)

bot.start((ctx) =>
  ctx.reply('👋 Salom! Instagram yoki YouTube link yuboring.'),
);

bot.on('text', async (ctx) => {
  const url = ctx.message.text;

  if (url.includes('instagram.com')) {
    await ctx.reply('⏳');

    const scriptPath = path.join('python', 'instagram_download.py');

    exec(`python3 ${scriptPath} ${url}`, async (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return ctx.reply('❌ Instagramdan yuklab bo‘lmadi.');
      }

      const dir = path.join(__dirname, '..', '..', 'downloads', 'video');
      if (!fs.existsSync(dir)) {
        return ctx.reply('❌ Video topilmadi.');
      }

      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mp4'));
      if (files.length === 0) return ctx.reply('❌ Video topilmadi.');

      const videoPath = path.join(dir, files[0]);
      await ctx.replyWithVideo(
        { source: fs.createReadStream(videoPath) },
        { caption: '📥 @saver_uz_instabot orqali yuklab olindi \nAdmin: @MUHAMMADISO' },
      );

      // Faylni tozalash
      fs.unlinkSync(videoPath);
    });
  } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
    await ctx.reply('⏳');

    const scriptPath = path.join('python', 'youtube_download.py');

    exec(`python3 ${scriptPath} ${url}`, async (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return ctx.reply('❌ YouTubedan yuklab bo‘lmadi.');
      }

      const dir = path.join(__dirname, '..', '..', 'downloads', 'youtube');
      if (!fs.existsSync(dir)) {
        return ctx.reply('❌ YouTube videosi topilmadi.');
      }

      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mp4'));
      if (files.length === 0) return ctx.reply('❌ Video topilmadi.');

      const videoPath = path.join(dir, files[0]);
      await ctx.replyWithVideo(
        { source: fs.createReadStream(videoPath) },
        { caption: '📥 @saver_uz_instabot orqali yuklab olindi \nAdmin: @MUHAMMADISO' },
      );

      // Faylni tozalash
      fs.unlinkSync(videoPath);
    });
  } else {
    ctx.reply('❗ Iltimos, YouTube yoki Instagram video havolasini yuboring.');
  }
});


export default bot;

import { Context, Markup, Telegraf } from 'telegraf';
import * as fs from 'fs';
import * as path from 'path';

let adminHandler: any;
let textHandler: any;

const adminPath = path.resolve('data', 'admins.json');
const channelPath = path.resolve('data', 'channel.json');

console.log(adminPath);
console.log(channelPath);



function getAdmins(): string[] {
  if (!fs.existsSync(adminPath)) return [];
  return JSON.parse(fs.readFileSync(adminPath, 'utf-8'));
}

function saveAdmins(admins: string[]) {
  fs.writeFileSync(adminPath, JSON.stringify(admins, null, 2));
}

function getChannel(): string | null {
  if (!fs.existsSync(channelPath)) return null;
  return JSON.parse(fs.readFileSync(channelPath, 'utf-8'));
}

function saveChannel(channel: string | null) {
  fs.writeFileSync(channelPath, JSON.stringify(channel, null, 2));
}

export function isAdmin(ctx: Context): boolean {
  const admins = getAdmins();
  return Boolean(ctx.from?.username && admins.includes(ctx.from.username));
}

// ======== Admin Panelni sozlash ========

export function setupAdminPanel(bot: Telegraf) {
  // /admin buyrug‘i
  bot.command('admin', (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply('❌ Ruxsat yo‘q.');
    return ctx.reply(
      '🔧 Admin panel:',
      Markup.inlineKeyboard([
        [Markup.button.callback('➕ Admin qo‘shish', 'add_admin')],
        [Markup.button.callback('➖ Admin o‘chirish', 'remove_admin')],
        [Markup.button.callback('📢 Kanal qo‘shish', 'add_channel')],
        [Markup.button.callback('❌ Kanalni o‘chirish', 'remove_channel')],
        [Markup.button.callback('📊 Statistika', 'show_stats')],
      ]),
    );
  });

  // 📊 Statistika
  bot.action('show_stats', (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply('❌ Ruxsat yo‘q.');
    const admins = getAdmins();
    const kanal = getChannel();
    ctx.reply(
      `📊 Statistika:\n\n👮‍♂️ Adminlar soni: ${admins.length}\n📢 Majburiy kanal: ${kanal ?? 'Yo‘q'}\n📥 Yuklangan videolar: demo`,
    );
  });

  // ➕ Admin qo‘shish

  bot.action('add_admin', async (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply('❌ Ruxsat yo‘q.');
    await ctx.reply('➕ Admin username (faqat @siz) yuboring:');

    adminHandler = async (ctx2) => {
      const username = ctx2.message?.text?.replace('@', '').trim();
      const admins = getAdmins();

      if (!username) return;
      if (admins.includes(username)) {
        await ctx2.reply('⚠️ Bu admin allaqachon ro‘yxatda!');
      } else {
        admins.push(username);
        saveAdmins(admins);
        await ctx2.reply(`✅ @${username} adminlar ro‘yxatiga qo‘shildi.`);
      }

      (bot as any).off('text', adminHandler);
    };

    bot.on('text', adminHandler);
  });

  // ➖ Admin o‘chirish
  bot.action('remove_admin', (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply('❌ Ruxsat yo‘q.');
    const admins = getAdmins();
    if (admins.length === 0) return ctx.reply('⚠️ Hozircha admin yo‘q.');

    return ctx.reply(
      '❌ Qaysi adminni o‘chirmoqchisiz?',
      Markup.inlineKeyboard(
        admins.map((u) => [
          Markup.button.callback(`❌ @${u}`, `delete_admin_${u}`),
        ]),
      ),
    );
  });

  // Har bir adminni o‘chirish actioni
  bot.action(/^delete_admin_(.+)/, (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply('❌ Ruxsat yo‘q.');
    const username = ctx.match[1];
    const admins = getAdmins().filter((u) => u !== username);
    saveAdmins(admins);
    ctx.reply(`✅ @${username} adminlikdan olib tashlandi.`);
  });

  // 📢 Kanal qo‘shish

  bot.action('add_channel', async (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply('❌ Ruxsat yo‘q.');
    await ctx.reply(`📢 Kanal username'ni kiriting (masalan: @mychannel):`);

    textHandler = async (ctx2) => {
      const kanal = ctx2.message?.text?.trim();
      if (!kanal?.startsWith('@')) {
        await ctx2.reply('❌ Noto‘g‘ri format. @ bilan boshlanishi kerak.');
      } else {
        saveChannel(kanal);
        await ctx2.reply(`✅ Majburiy kanal o‘rnatildi: ${kanal}`);
      }

      // ❗ Telegraf `off` metodini `as any` deb chaqiramiz
      (bot as any).off('text', textHandler);
    };

    bot.on('text', textHandler);
  });

  // ❌ Kanalni o‘chirish
  bot.action('remove_channel', (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply('❌ Ruxsat yo‘q.');
    saveChannel(null);
    ctx.reply('✅ Majburiy kanal o‘chirildi.');
  });
}

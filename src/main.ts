import bot from './bot/save_bot';

async function bootstrap() {
  await bot.launch();
  console.log('🤖 Bot ishga tushdi');
}
bootstrap();

/**
 *
 * @param discordURL The URL of the Discord webhook to execute
 * @param content The messagecontent to send to the Discord webhook
 */
export async function executeDiscordWebhook(discordURL: string, content: string) {
  await fetch(discordURL, {
    method: "POST",
    body: JSON.stringify({
      content:
        content,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

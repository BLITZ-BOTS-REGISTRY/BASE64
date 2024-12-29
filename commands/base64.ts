import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';

async function base64Operation(text: string, action: 'encode' | 'decode'): Promise<string> {
  try {
    const encodedText = encodeURIComponent(text);
    const response = await axios.get(
      `https://devmatei.is-a.dev/api/base64`, {
        params: {
          action,
          text: encodedText
        }
      });

    return action === 'encode' ? response.data.encoded : response.data.decoded;
  } catch (error) {
    console.error('Error:', error);
    throw new Error(error.response ? error.response.data.error : error.message);
  }
}

export default {
  data: new SlashCommandBuilder()
    .setName('base64')
    .setDescription('Encode or decode text using Base64')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('Choose to encode or decode')
        .setRequired(true)
        .addChoices(
          { name: 'Encode', value: 'encode' },
          { name: 'Decode', value: 'decode' }
        )
    )
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Text to encode or decode')
        .setRequired(true)
    ),

  async execute(interaction: any): Promise<void> {
    const action = interaction.options.getString('action') as 'encode' | 'decode';
    const text = interaction.options.getString('text') as string;

    try {
      const result = await base64Operation(text, action);
      await interaction.reply(`Here is the ${action}d result: \n\`\`\`${result}\`\`\``);
    } catch (error) {
      await interaction.reply(`Error: ${error.message}`);
    }
  },
};

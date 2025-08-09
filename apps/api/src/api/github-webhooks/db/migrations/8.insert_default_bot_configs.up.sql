-- Insert default bot response configurations
INSERT INTO bot_response_configs (
    repository_pattern,
    mention_keywords,
    response_template,
    enabled,
    priority,
    created_at,
    updated_at
) VALUES
(
    '1001Josias/*',
    '["help", "ajuda", "assist", "assistir"]',
    'Olá @{user}! 👋 Obrigado por me mencionar na issue "{issue_title}". 

Sou o BotMaster e estou aqui para ajudar! Como posso te assistir hoje?

💡 **O que posso fazer:**
- Responder a perguntas sobre o BotMaster
- Ajudar com configurações e troubleshooting
- Fornecer documentação e exemplos
- Encaminhar para a equipe de desenvolvimento quando necessário

📋 **Para me ajudar a te ajudar melhor:**
- Descreva o problema ou dúvida específica
- Inclua informações sobre sua configuração
- Compartilhe logs de erro se houver

🔗 **Links úteis:**
- [Documentação](https://docs.botmaster.dev)
- [Repositório](https://github.com/1001Josias/botmaster)

Vou analisar sua questão e responder o mais breve possível! 🚀',
    true,
    9
),
(
    '1001Josias/botmaster',
    '["bug", "error", "erro", "problema", "issue"]',
    'Obrigado por reportar este problema, @{user}! 🐛

Registrei sua issue "{issue_title}" e nossa equipe irá investigar.

📝 **Próximos passos:**
1. Nossa equipe irá revisar o problema reportado
2. Solicitaremos informações adicionais se necessário
3. Trabalharemos em uma solução
4. Atualizaremos esta issue com o progresso

🔍 **Para acelerar a resolução:**
- Inclua steps to reproduce
- Versão do BotMaster utilizada
- Logs relevantes
- Screenshots se aplicável

Agradecemos sua contribuição para melhorar o BotMaster! 💪',
    true,
    8
),
(
    '*',
    '["docs", "documentation", "documentação", "how to", "como"]',
    'Olá @{user}! 📚

Vejo que você está procurando por documentação. Aqui estão alguns recursos úteis:

🌐 **Documentação oficial:** https://docs.botmaster.dev
📖 **Wiki do projeto:** https://github.com/1001Josias/botmaster/wiki
💡 **Exemplos:** https://github.com/1001Josias/botmaster/tree/main/examples
❓ **FAQ:** https://github.com/1001Josias/botmaster/blob/main/FAQ.md

Se não encontrar o que procura, descreva sua dúvida específica que tentarei ajudar!',
    true,
    5
),
(
    '*',
    '[]',
    'Olá @{user}! 👋

Obrigado por me mencionar! Sou o BotMaster, seu assistente para automação e orquestração de bots.

💬 **Como posso ajudar:**
- Dúvidas sobre funcionalidades
- Suporte técnico
- Documentação e exemplos
- Configuração e troubleshooting

🏷️ **Dicas para melhor atendimento:**
- Use palavras-chave como "help", "docs", "bug" para respostas mais específicas
- Seja específico sobre sua dúvida ou problema
- Inclua detalhes técnicos relevantes

Estou aqui para ajudar! 🚀',
    true,
    1
);

-- Create an index for better performance on JSON queries
CREATE INDEX IF NOT EXISTS idx_bot_response_configs_keywords 
ON bot_response_configs USING gin(mention_keywords);
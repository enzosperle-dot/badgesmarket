// Seção de Dúvidas Frequentes (acordeão). Usa <details>/<summary>,
// então funciona sem JavaScript. EDITAR AQUI as perguntas/respostas.
const ITEMS = [
  {
    q: "Como recebo os dados da conta?",
    a: "Cada anúncio mostra o contato do vendedor. Você combina diretamente com ele pelo Discord e, após o acerto, recebe os dados de acesso (e-mail e senha).",
  },
  {
    q: "Posso trocar o e-mail da conta?",
    a: "Sim! As contas normalmente permitem a troca de e-mail. Basta acessar as configurações do Discord e alterar para o seu e-mail pessoal.",
  },
  {
    q: "As badges são permanentes?",
    a: "Depende da badge. Early Supporter, Active Developer e Bot Developer são permanentes. Já Nitro e Server Boost dependem de assinatura ativa.",
  },
  {
    q: "E se eu tiver algum problema com a conta?",
    a: "Combine todos os detalhes com o vendedor antes de fechar negócio. Recomendamos sempre conversar pelo Discord do anunciante.",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "Por enquanto o pagamento é combinado diretamente com o vendedor (ex: Pix). Em breve teremos pagamento integrado no site.",
  },
];

export default function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-widest text-brand-blurple">
          Dúvidas frequentes
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white">Perguntas comuns</h2>
      </div>

      <div className="space-y-3">
        {ITEMS.map((item) => (
          <details
            key={item.q}
            className="card group p-5 transition hover:border-brand-blurple/50"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-white">
              {item.q}
              <span className="text-brand-blurple transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollText, X } from "lucide-react";
import { BRAND } from "../data/site";
import { EASE } from "./Reveal";

const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "Critérios de participação",
    items: [
      `Para participar do PROGRAMA DE FIDELIDADE — ${BRAND.legal} — o cliente deve estar cadastrado no sistema SIMSOFT, ciente e concordando com seus termos de uso e responsável pelas informações cadastrais. É crucial que essas informações, especialmente o e-mail, estejam corretas e atualizadas para receber detalhes sobre a pontuação. O programa é restrito a pessoas físicas.`,
      "Ao participar do programa, o cliente declara-se conhecedor deste regulamento e concorda com todas as regras e condições estabelecidas para aproveitar seus benefícios.",
      "Todos os indivíduos com CPF válido ou número de telefone (celular) ativo podem participar. A pontuação e os benefícios serão concedidos apenas aos clientes que se identificarem como membros, fornecendo CPF ou telefone no momento da compra.",
      "Os pontos serão concedidos somente após verificação presencial ou online do titular do CPF, via telefone ou e-mail. A empresa reserva-se o direito de solicitar documento para confirmar a identidade. Se detectada tentativa de pontuação inapropriada, os pontos da compra podem ser removidos e o cadastro excluído do programa.",
    ],
  },
  {
    title: "Regras de pontuação",
    items: [
      "A cada R$ 1,00 o cliente ganha 1 ponto e poderá trocar seus pontos por prêmios de acordo com a quantidade acumulada. Os prêmios disponíveis estão listados nesta página.",
      "Em compras realizadas localmente, o cliente deve solicitar os pontos ao atendente no momento da compra, fornecendo obrigatoriamente CPF ou telefone, sob pena de perda do direito à pontuação.",
      "Em compras realizadas online, a pontuação é cadastrada automaticamente no cadastro informado para realizar a compra.",
      "É expressamente proibido vender ou transferir pontos obtidos no programa. Constatada essa atividade, o cliente será imediatamente removido do programa e sua pontuação confiscada e zerada, independentemente de medidas judiciais cabíveis.",
      "O prêmio resgatado não acumula pontuação. Caso o cliente efetue compra de outros produtos no momento do resgate, estes produtos serão pontuados normalmente.",
    ],
  },
  {
    title: "Resgate de prêmios",
    items: [
      "Ao somar pontos suficientes, o cliente terá direito a resgatar o(s) prêmio(s) listados nesta página.",
      "O resgate só pode ser realizado pelo próprio cliente participante, sendo proibido o resgate por terceiros, independentemente do grau de parentesco. O resgate também pode ser feito pelo site de delivery.",
      "A SIMSOFT não se responsabiliza pelos produtos e serviços oferecidos por terceiros através de eventuais brindes concedidos nos prêmios.",
    ],
  },
  {
    title: "Validade dos pontos",
    items: [
      `Este regulamento e o PROGRAMA DE FIDELIDADE entraram em vigor em 25/07/2025 e são válidos por tempo indeterminado, a critério da ${BRAND.legal}.`,
      `A ${BRAND.legal} poderá cancelar ou alterar o PROGRAMA DE FIDELIDADE, bem como efetuar qualquer alteração neste regulamento.`,
    ],
  },
];

export default function RulesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-end justify-center bg-coal/85 backdrop-blur-md p-0 sm:items-center sm:p-6"
        >
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            className="relative flex max-h-[88svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-cream/12 bg-soot sm:rounded-3xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-cream/10 px-6 py-5 md:px-8">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-ember/30 bg-ember/10 text-ember">
                  <ScrollText className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <h3 className="font-display text-xl uppercase tracking-wide text-cream">Regulamento do programa</h3>
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-smoke">
                    {BRAND.legal} — CNPJ {BRAND.cnpj}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar regulamento"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream transition-colors hover:border-ember hover:text-ember"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 [scrollbar-width:thin]">
              <div className="space-y-8">
                {SECTIONS.map((sec, si) => (
                  <div key={sec.title}>
                    <h4 className="flex items-center gap-2 font-display text-lg uppercase tracking-wide text-ember">
                      <span className="font-mono text-xs text-smoke">0{si + 1}</span> {sec.title}
                    </h4>
                    <ol className="mt-3 space-y-2.5">
                      {sec.items.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm leading-relaxed text-cream/75">
                          <span className="mt-0.5 shrink-0 font-mono text-[10px] font-bold text-gold">
                            {si + 1}.{i + 1}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
                <p className="rounded-2xl border border-cream/10 bg-coal/60 p-4 text-xs leading-relaxed text-smoke">
                  A {BRAND.legal} utiliza o sistema SIMSOFT para o programa de fidelidade; ao se cadastrar, o
                  cliente concorda com os termos de uso da plataforma. Em caso de impossibilidade de cumprimento
                  deste regulamento, a SIMSOFT isenta-se de responsabilidade, por ser fornecedora da tecnologia.
                </p>
              </div>
            </div>

            <div className="border-t border-cream/10 px-6 py-4 md:px-8">
              <button
                onClick={onClose}
                className="w-full rounded-full bg-ember py-3.5 font-display text-lg tracking-wide text-coal transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                OK, ENTENDI!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const BRAND = {
  name: "Guadalupe Rango & Rolê",
  legal: "Guadalupe Rango e Rolê",
  cnpj: "60.481.382/0001-44",
  city: "Brodowski/SP",
  hood: "Jardim Maria Candida (Imaculada II)",
  logoSquare80:
    "https://d3u4c91adn9tbl.cloudfront.net/preset=logo_square_80/empresa_images/16150/689ba8487bf727uu5y.webp",
  logoSquare512:
    "https://d3u4c91adn9tbl.cloudfront.net/preset=logo_square_512/empresa_images/16150/689ba8487bf727uu5y.webp",
  links: {
    loja: "https://guadalupeburger.simsoft.app/loja",
    entrar:
      "https://guadalupeburger.simsoft.app/parceiroCadastro?parceiro=15158&loja=16589&source=fidelidade",
    fidelidade: "https://guadalupeburger.simsoft.app/loja/fidelidade",
  },
};

export const IMG = {
  pyramid:
    "https://images.pexels.com/photos/18987002/pexels-photo-18987002.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  plate:
    "https://images.pexels.com/photos/11022623/pexels-photo-11022623.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  friesSide:
    "https://images.pexels.com/photos/10914838/pexels-photo-10914838.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  doublePickles:
    "https://images.pexels.com/photos/6896381/pexels-photo-6896381.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cozyBeer:
    "https://images.pexels.com/photos/24554391/pexels-photo-24554391.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  cola:
    "https://images.pexels.com/photos/31300961/pexels-photo-31300961.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  woodTable:
    "https://images.pexels.com/photos/6111947/pexels-photo-6111947.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  loadedFries:
    "https://images.pexels.com/photos/29285463/pexels-photo-29285463.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  friesBurgers:
    "https://images.pexels.com/photos/17035149/pexels-photo-17035149.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  cheeseBaconFries:
    "https://images.pexels.com/photos/17035142/pexels-photo-17035142.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  glowFries:
    "https://images.pexels.com/photos/37121076/pexels-photo-37121076.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
};

export type MenuItem = {
  name: string;
  desc: string;
  price: string;
  img: string;
  tag?: string;
};

export const MENU: MenuItem[] = [
  {
    name: "Rolê Smash",
    desc: "Smash duplo na chapa, cheddar derretido, picles e o molho da casa.",
    price: "R$ 21,90",
    img: IMG.doublePickles,
    tag: "Mais pedido",
  },
  {
    name: "X-Guadalupe",
    desc: "Blend 160g, queijo prato, alface crocante, tomate e maionese caseira.",
    price: "R$ 24,90",
    img: IMG.plate,
  },
  {
    name: "Rango Bacon Duplo",
    desc: "2 carnes, dobro de bacon crocante, cheddar cremoso e cebola crispy.",
    price: "R$ 32,90",
    img: IMG.friesSide,
    tag: "Brabo",
  },
  {
    name: "Batata Loaded",
    desc: "Batata rústica afogada no cheddar, bacon crocante e cebolinha.",
    price: "R$ 18,90",
    img: IMG.glowFries,
  },
  {
    name: "Combo Imaculada",
    desc: "Burger da casa + batata loaded + refri gelado. O rolê completo.",
    price: "R$ 39,90",
    img: IMG.cola,
    tag: "Combo",
  },
  {
    name: "Pirâmide da Casa",
    desc: "Três burgers empilhados pra dividir (ou não). Só pros corajosos.",
    price: "R$ 69,90",
    img: IMG.pyramid,
    tag: "Pra dividir",
  },
];

export type Reward = {
  name: string;
  points: number;
  desc: string;
  img: string;
};

export const REWARDS: Reward[] = [
  {
    name: "Refri Lata Gelado",
    points: 150,
    desc: "Pra acompanhar o rango, na faixa.",
    img: IMG.cola,
  },
  {
    name: "Batata Loaded",
    points: 300,
    desc: "Cheddar, bacon e cebolinha — completa.",
    img: IMG.loadedFries,
  },
  {
    name: "Rolê Smash",
    points: 600,
    desc: "O queridinho da casa de graça.",
    img: IMG.doublePickles,
  },
  {
    name: "Combo Casal Rango & Rolê",
    points: 1200,
    desc: "Dois burgers + batata + 2 refris.",
    img: IMG.cozyBeer,
  },
];

export const MARQUEE_ITEMS = [
  "Guadalupe Rango & Rolê",
  "1 ponto a cada R$ 1",
  "Resgate prêmios",
  "Ofertas exclusivas",
  "Brodowski • SP",
  "Brasa de verdade",
];

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: -70, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

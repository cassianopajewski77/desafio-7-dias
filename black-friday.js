/* Black Friday Casa Intencional
   ---------------------------------------------------------------
   TUDO O QUE PRECISA SER EDITADO FICA NESTE BLOCO "CONFIG".
   - inicio / fim: quando a faixa aparece e some sozinha (horário de Brasília, -03:00).
   - desconto: porcentagem aplicada aos preços do checkout.
   - precos: deixe vazio ("") para calcular pelo desconto, ou escreva o preço final (ex.: "19").
   - link: para onde a faixa leva.
   Depois do "fim", a faixa some e os preços voltam ao normal sem precisar mexer em nada.
*/
(function () {
  var CONFIG = {
    inicio: "2026-11-24T00:00:00-03:00",
    fim: "2026-11-30T23:59:59-03:00",
    desconto: 50,
    precos: { gravada: "", acompanhamento: "" },
    link: "checkout.html#planos",
    chamada: "Desafio 7 Dias com",
    botao: "Garantir minha vaga"
  };

  var inicio = new Date(CONFIG.inicio).getTime();
  var fim = new Date(CONFIG.fim).getTime();
  function ativa() { var t = Date.now(); return t >= inicio && t <= fim; }
  if (!ativa()) return;

  var css = [
    ".bf{background:#3F4032;color:#F2EFEA;font-family:'Jost','Helvetica Neue',Arial,sans-serif;position:relative;z-index:50}",
    ".bf a{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px 18px;max-width:1200px;margin:auto;padding:10px 20px;color:inherit;text-decoration:none;font-size:.86rem;line-height:1.35;text-align:center}",
    ".bf-tag{font-family:'Crimson Pro',Georgia,serif;font-style:italic;font-size:1.25rem;letter-spacing:.01em;color:#F2EFEA}",
    ".bf-tag::after{content:'';display:inline-block;width:5px;height:5px;border-radius:50%;background:#AEB09A;margin-left:16px;vertical-align:middle}",
    ".bf-txt b{font-weight:500;color:#D9DBC4}",
    ".bf-tempo{font-size:.74rem;letter-spacing:.16em;text-transform:uppercase;color:#D6CEC1}",
    ".bf-tempo b{font-weight:500;font-variant-numeric:tabular-nums;letter-spacing:.06em;color:#F2EFEA;margin-left:6px}",
    ".bf-cta{font-size:.7rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;border:1px solid rgba(242,239,234,.55);border-radius:999px;padding:7px 16px;transition:background .2s,color .2s}",
    ".bf a:hover .bf-cta{background:#F2EFEA;color:#3F4032}",
    ".bf a:focus-visible{outline:2px solid #AEB09A;outline-offset:-4px}",
    "@media(max-width:600px){.bf a{gap:4px 12px;padding:9px 14px;font-size:.8rem}.bf-tag{font-size:1.1rem}.bf-tag::after{display:none}.bf-cta{display:none}}",
    /* preços do checkout */
    ".bf-de{display:block;width:100%;font-family:'Jost',Arial,sans-serif;font-size:.85rem;color:#898278}",
    ".bf-de s{text-decoration-thickness:1px}",
    ".bf-selo{display:inline-block;margin-left:10px;align-self:center;background:#3F4032;color:#F2EFEA;font-family:'Jost',Arial,sans-serif;font-size:.62rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;padding:5px 10px;border-radius:999px}"
  ].join("");
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  function brl(v) {
    var n = Math.round(v * 100) / 100;
    return n % 1 === 0 ? String(n) : n.toFixed(2).replace(".", ",");
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function montar() {
    var bf = document.createElement("div");
    bf.className = "bf";
    bf.setAttribute("role", "region");
    bf.setAttribute("aria-label", "Oferta de Black Friday");
    bf.innerHTML =
      '<a href="' + CONFIG.link + '">' +
      '<span class="bf-tag">Black Friday</span>' +
      '<span class="bf-txt">' + CONFIG.chamada + ' <b>' + CONFIG.desconto + '% de desconto</b></span>' +
      '<span class="bf-tempo">termina em<b data-bf-tempo>--</b></span>' +
      '<span class="bf-cta">' + CONFIG.botao + ' →</span></a>';
    document.body.insertBefore(bf, document.body.firstChild);

    /* Preços com desconto (só nas páginas que têm <b data-preco="...">) */
    var precos = document.querySelectorAll("[data-preco]");
    for (var i = 0; i < precos.length; i++) {
      var b = precos[i];
      var plano = b.getAttribute("data-plano");
      var cheio = parseFloat(b.getAttribute("data-preco"));
      var fixo = CONFIG.precos[plano];
      var novo = fixo ? fixo : brl(cheio * (1 - CONFIG.desconto / 100));
      var caixa = b.parentNode;
      var de = document.createElement("span");
      de.className = "bf-de";
      de.innerHTML = "de <s>R$ " + brl(cheio) + "</s> por";
      caixa.insertBefore(de, caixa.firstChild);
      caixa.style.flexWrap = "wrap";
      b.textContent = novo;
      var selo = document.createElement("span");
      selo.className = "bf-selo";
      selo.textContent = "Black Friday";
      caixa.appendChild(selo);
    }

    var alvo = bf.querySelector("[data-bf-tempo]");
    function tick() {
      var resta = fim - Date.now();
      if (resta <= 0) { location.reload(); return; }
      var s = Math.floor(resta / 1000);
      var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), seg = s % 60;
      alvo.textContent = (d > 0 ? d + (d === 1 ? " dia " : " dias ") : "") + pad(h) + ":" + pad(m) + ":" + pad(seg);
    }
    tick();
    setInterval(tick, 1000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montar);
  else montar();
})();

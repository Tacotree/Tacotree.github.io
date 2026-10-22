document.querySelectorAll('.karuselli').forEach((karuselli) => {
  const sisalto = karuselli.querySelector('.karuselli-sisalto');
  const kuvat = karuselli.querySelectorAll('.karuselli-sisalto img');
  const vasen = karuselli.querySelector('.vasen');
  const oikea = karuselli.querySelector('.oikea');
  const laskuri = karuselli.querySelector('.karuselli-laskuri');
  let indeksi = 0;

  function paivita() {
    sisalto.style.transform = `translateX(-${indeksi * 100}%)`;
    if (laskuri) {
      laskuri.textContent = `${indeksi + 1} / ${kuvat.length}`;
    }
  }

  vasen.addEventListener('click', () => {
    indeksi = indeksi > 0 ? indeksi - 1 : kuvat.length - 1;
    paivita();
  });

  oikea.addEventListener('click', () => {
    indeksi = indeksi < kuvat.length - 1 ? indeksi + 1 : 0;
    paivita();
  });

  paivita();
});
const karuselli = document.querySelector('#karuselli');
if (karuselli) {
  const sisalto = karuselli.querySelector('.karuselli-sisalto');
  const kuvat = karuselli.querySelectorAll('img');
  const vasen = karuselli.querySelector('.vasen');
  const oikea = karuselli.querySelector('.oikea');
  let indeksi = 0;

  function paivita() {
    sisalto.style.transform = `translateX(-${indeksi * 100}%)`;
  }

  vasen.addEventListener('click', () => {
    indeksi = indeksi > 0 ? indeksi - 1 : kuvat.length - 1;
    paivita();
  });

  oikea.addEventListener('click', () => {
    indeksi = indeksi < kuvat.length - 1 ? indeksi + 1 : 0;
    paivita();
  });
}

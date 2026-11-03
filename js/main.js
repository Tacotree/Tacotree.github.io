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

// ===== Evästesuostumus ja Google Tag Manager =====

const SUOSTUMUS_AVAIN = 'evastesuostumus';

function lueSuostumus() {
  try {
    return localStorage.getItem(SUOSTUMUS_AVAIN);
  } catch (virhe) {
    return null;
  }
}

function tallennaSuostumus(arvo) {
  try {
    localStorage.setItem(SUOSTUMUS_AVAIN, arvo);
  } catch (virhe) {
    // Jos selain estää tallennuksen, banneri näytetään seuraavalla kerralla uudelleen.
  }
}

// Googlen antama GTM-koodi, ajetaan vain suostumuksen jälkeen
function lataaGTM() {
  if (window.gtmLadattu) return;
  window.gtmLadattu = true;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());

  const skripti = document.createElement('script');
  skripti.async = true;
  skripti.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MK4QG2S4';
  document.head.appendChild(skripti);
}

// Poistaa Google Analyticsin evästeet, jos kävijä peruu suostumuksensa
function poistaAnalytiikkaevasteet() {
  document.cookie.split(';').forEach((evaste) => {
    const nimi = evaste.split('=')[0].trim();
    if (nimi.startsWith('_ga')) {
      ['', location.hostname, '.' + location.hostname].forEach((domain) => {
        document.cookie =
          `${nimi}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` +
          (domain ? `; domain=${domain}` : '');
      });
    }
  });
}

function kasitteleValinta(valinta) {
  tallennaSuostumus(valinta);
  const banneri = document.querySelector('.evastebanneri');
  if (banneri) banneri.remove();

  if (valinta === 'hyvaksytty') {
    lataaGTM();
  } else {
    poistaAnalytiikkaevasteet();
    // Jos GTM ehti jo latautua tällä sivulla, ladataan sivu uudelleen ilman sitä
    if (window.gtmLadattu) location.reload();
  }
}

function naytaBanneri() {
  if (document.querySelector('.evastebanneri')) return;

  const banneri = document.createElement('div');
  banneri.className = 'evastebanneri';
  banneri.setAttribute('role', 'dialog');
  banneri.setAttribute('aria-label', 'Evästeasetukset');
  banneri.innerHTML = `
    <p>
      Haluaisin käyttää Google Analyticsia nähdäkseni, kuinka moni sivua
      lukee. Analytiikka käyttää evästeitä, ja se otetaan käyttöön vain,
      jos hyväksyt sen. <a href="tietosuoja.html">Lue lisää tietosuojasta</a>.
    </p>
    <div class="evastebanneri-napit">
      <button type="button" class="evastenappi" data-valinta="hylatty">Hylkää</button>
      <button type="button" class="evastenappi" data-valinta="hyvaksytty">Hyväksy</button>
    </div>
  `;

  banneri.querySelectorAll('.evastenappi').forEach((nappi) => {
    nappi.addEventListener('click', () =>
      kasitteleValinta(nappi.dataset.valinta),
    );
  });

  document.body.appendChild(banneri);
}

// "Evästeasetukset"-linkki footerissa (lisätään vaiheessa 4)
document.querySelectorAll('.evasteasetukset-linkki').forEach((linkki) => {
  linkki.addEventListener('click', (tapahtuma) => {
    tapahtuma.preventDefault();
    naytaBanneri();
  });
});

// Käynnistys
const suostumus = lueSuostumus();
if (suostumus === 'hyvaksytty') {
  lataaGTM();
} else {
  // Siivotaan mahdolliset jäänteet, jos suostumusta ei ole
  poistaAnalytiikkaevasteet();
  if (suostumus !== 'hylatty') {
    naytaBanneri();
  }
}

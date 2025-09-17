// ===== Contador de amor =====
const startDate = new Date("2023-04-23T00:00:00");
function atualizarContador(){
  const now = new Date();
  let diff = now - startDate;

  let years = Math.floor(diff / (1000*60*60*24*365));
  diff -= years*(1000*60*60*24*365);
  let months = Math.floor(diff / (1000*60*60*24*30));
  diff -= months*(1000*60*60*24*30);
  let days = Math.floor(diff / (1000*60*60*24));
  diff -= days*(1000*60*60*24);
  let hours = Math.floor(diff / (1000*60*60));
  diff -= hours*(1000*60*60);
  let minutes = Math.floor(diff / (1000*60));
  diff -= minutes*(1000*60);
  let seconds = Math.floor(diff/1000);

  document.getElementById("contador").innerText=
    `${years} anos, ${months} meses, ${days} dias, ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(atualizarContador,1000);
atualizarContador();

// ===== Locais =====
const locais = [
  {
    id: "local1",
    nome: "Theatro José de Alencar",
    lat: -3.7273865549299945,
    lng: -38.53105755034245,
    fotos: ["img/theatro1.jpg","img/theatro2.jpg","img/theatro3.jpg"],
    texto: "Foi neste local que nos encontramos pela primeira vez, em um Show do Rodrigo Amarante, e desde aquele momento eu me apaixonei pelo seu sorriso, pelo seu jeito e pela sua companhia 💜"
  },
  {
    id: "local2",
    nome: "IJF",
    lat: -3.7346081540816245,
    lng: -38.53090624901294,
    fotos: ["img/ijf1.jpg","img/ijf2.jpg","img/ijf3.jpg"],
    texto: "Local onde nos vimos pela primeira vez após o Show. Precisei te encontrar novamente, pois somente uma não era suficiente. Cada vez que eu via você e permanecia ao seu lado, ficava mais feliz e, de algum jeito, após alguns encontros, já sabia que queria te amar e cuidar de você 💖"
  },
  {
    id: "local3",
    nome: "Praia de Iracema",
    lat: -3.7236600583466326,
    lng: -38.50541905373625,
    fotos: ["img/praia1.jpg","img/praia2.jpg","img/praia3.jpg","img/praia4.jpg","img/praia5.jpg","img/praia6.jpg","img/praia7.jpg","img/praia8.jpg","img/praia9.jpg","img/praia10.jpg","img/praia11.jpg","img/praia12.jpg","img/praia13.jpg","img/praia14.jpg","img/praia15.jpg"],
    texto: "Local de vários pores do sol, passeios, declarações, noites de luar, além do nosso pedido de namoro e muito amor 💕"
  },
  {
    id: "local4",
    nome: "Moranga Bistrô",
    lat: -3.721943260342315,
    lng: -38.51256693309049,
    fotos: ["img/moranga1.jpg","img/moranga2.jpg","img/moranga3.jpg","img/moranga4.jpg"],
    texto: "Enfim, chegamos em um Local muito especial e escolhido para um dos momentos mais especiais da nossa vida ... Saiba que te amarei para sempre ❤️💜"
  }
];

const raioDesbloqueio = 50; // metros para desbloquear o local
const avisoProximo = 150;    // metros para mostrar aviso de proximidade
const container = document.getElementById("locaisContainer");

// ===== Criar seção do local =====
function criarLocal(local){
  const section = document.createElement("section");
  section.id = local.id; 
  section.classList.add("local","section");

  const h2 = document.createElement("h2"); 
  h2.innerText = local.nome; 
  section.appendChild(h2);

  const p = document.createElement("p"); 
  p.innerText = local.texto; 
  section.appendChild(p);

  const carousel = document.createElement("div"); 
  carousel.classList.add("carousel"); 
  carousel.id = `${local.id}-carousel`;

  const track = document.createElement("div"); 
  track.classList.add("carousel-track");

  local.fotos.forEach(foto => { 
    const img = document.createElement("img"); 
    img.src = foto; 
    track.appendChild(img); 
  });

  carousel.appendChild(track); 
  section.appendChild(carousel);

  container.appendChild(section);

  setTimeout(() => section.classList.add("visible"), 100); // fade-in suave
  iniciarCarrossel(`${local.id}-carousel`);
  section.scrollIntoView({behavior:"smooth"});
}

// ===== Distância =====
function calcularDistancia(lat1, lon1, lat2, lon2){
  const R = 6371e3, toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ===== Checagem de locais =====
function checkLocais(lat, lng){
  locais.forEach(local => {
    const distancia = calcularDistancia(lat, lng, local.lat, local.lng);
    const secao = document.getElementById(local.id);

    // Aviso próximo
    if(distancia <= avisoProximo && !secao){
      if(!document.getElementById(`${local.id}-aviso`)){
        const aviso = document.createElement("div");
        aviso.id = `${local.id}-aviso`; 
        aviso.classList.add("aviso");
        aviso.innerText = `💫 O próximo local está próximo!`;
        container.appendChild(aviso);
        setTimeout(() => aviso.remove(), 5000);
      }
    }

    // Desbloqueio
    if(distancia <= raioDesbloqueio && !secao){
      criarLocal(local);
      alert(`✨ Você chegou em ${local.nome}! Novo local desbloqueado 💖`);
    }
  });
}

// ===== Iniciar passeio =====
function iniciarPasseio(){
  if("geolocation" in navigator){
    navigator.geolocation.watchPosition(
      pos => { checkLocais(pos.coords.latitude, pos.coords.longitude); },
      err => { console.error(err); alert("Não foi possível obter sua localização. Ative o GPS ou use o modo de teste."); },
      { enableHighAccuracy:true, maximumAge:1000, timeout:10000 }
    );
  }else{
    // Modo teste sem GPS/HTTPS
    const testeLat = -3.74046829401944;
    const testeLng = -38.53463914231671;
    setInterval(() => checkLocais(testeLat, testeLng), 2000);
  }
}

document.getElementById("startBtn").addEventListener("click", () => {
  alert("O passeio romântico começou! 💜💖");
  iniciarPasseio();
});

// ===== Carrossel automático =====
function iniciarCarrossel(id){
  const track = document.querySelector(`#${id} .carousel-track`);
  const slides = track.children; 
  let index = 0;
  setInterval(() => { 
    index = (index + 1) % slides.length; 
    track.style.transform = `translateX(-${index*100}%)`; 
  }, 3000);
}

// ===== Aparecer seções ao scroll (fade in) =====
window.addEventListener("scroll", () => {
  document.querySelectorAll(".section").forEach(section => {
    const rect = section.getBoundingClientRect();
    if(rect.top < window.innerHeight * 0.85){ 
      section.classList.add("visible"); 
    }
  });
});

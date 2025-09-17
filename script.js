// ===== Contador de amor =====
const startDate = new Date("2023-04-23T00:00:00");
function atualizarContador() {
  const now = new Date();
  let diff = now - startDate;

  let years = Math.floor(diff / (1000*60*60*24*365));
  diff -= years * (1000*60*60*24*365);
  let months = Math.floor(diff / (1000*60*60*24*30));
  diff -= months * (1000*60*60*24*30);
  let days = Math.floor(diff / (1000*60*60*24));
  diff -= days * (1000*60*60*24);
  let hours = Math.floor(diff / (1000*60*60));
  diff -= hours * (1000*60*60);
  let minutes = Math.floor(diff / (1000*60));
  diff -= minutes * (1000*60);
  let seconds = Math.floor(diff / 1000);

  document.getElementById("contador").innerText =
    `${years} anos, ${months} meses, ${days} dias, ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(atualizarContador, 1000);
atualizarContador();

// ===== Locais e fotos =====
const locais = [
  {
    id:"local1",
    nome:"Theatro José de Alencar",
    lat:-3.74046829401944, lng:-38.53463914231671, 
    fotos:["img/theatro1.jpg","img/theatro2.jpg","img/theatro3.jpg"],
    texto:"Foi a primeira vez que nos encontramos, no Show do Rodrigo Amarante, e desde aquele momento eu me apaixonei pelo sorriso, presença e jeito dela. 💘"
  },
  {
    id:"local2",
    nome:"IJF",
    lat:-3.7346081540816245, lng:-38.53090624901294,
    fotos:["img/ijf1.jpg","img/ijf2.jpg"],
    texto:"Local onde nos vimos pela primeira vez após o Show. Cada vez que eu a via, ficava mais feliz e já sabia que queria amá-la e cuidar dela. 💖"
  },
  {
    id:"local3",
    nome:"Praia de Iracema",
    lat:-3.7236600583466326, lng:-38.50541905373625, 
    fotos:["img/praia1.jpg","img/praia2.jpg"],
    texto:"Local do nosso pedido de namoro, além de vários pores do sol, passeios e declarações, noites de luar e muito amor. 💕"
  },
  {
    id:"local4",
    nome:"Moranga Bistrô",
    lat:-3.721943260342315, lng:-38.51256693309049,
    fotos:["img/moranga1.jpg","img/moranga2.jpg"],
    texto:"Local muito especial e escolhido para um dos momentos mais especiais da nossa vida. 💍"
  }
];

const raioDesbloqueio = 50; // metros
const avisoProximo = 200;   // metros
const container = document.getElementById("locaisContainer");

// ===== Criar seção do local =====
function criarLocal(local){
  const section = document.createElement("section");
  section.id = local.id;
  section.classList.add("local");

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
  local.fotos.forEach(foto=>{
    const img = document.createElement("img");
    img.src = foto;
    track.appendChild(img);
  });
  carousel.appendChild(track);
  section.appendChild(carousel);

  container.appendChild(section);
  iniciarCarrossel(`${local.id}-carousel`);
  section.classList.add("desbloqueado");
}

// ===== Distância =====
function calcularDistancia(lat1, lon1, lat2, lon2){
  const R = 6371e3;
  const toRad = x => x*Math.PI/180;
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  return R*c;
}

// ===== Checagem de locais =====
function checkLocais(lat, lng){
  locais.forEach(local=>{
    const distancia = calcularDistancia(lat, lng, local.lat, local.lng);
    const secao = document.getElementById(local.id);

    // Aviso próximo
    if(distancia <= avisoProximo && !secao){
      if(!document.getElementById(`${local.id}-aviso`)){
        const aviso = document.createElement("div");
        aviso.id = `${local.id}-aviso`;
        aviso.classList.add("aviso");
        aviso.innerText = `💫 O próximo local "${local.nome}" está próximo!`;
        container.appendChild(aviso);
        setTimeout(()=>aviso.remove(), 5000);
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
      (pos) => {
        checkLocais(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.error(err);
        alert("Não foi possível obter sua localização. Ative o GPS ou use o modo de teste.");
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
    );
  }else{
    // Modo de teste sem HTTPS
    const testeLat = -3.7277;
    const testeLng = -38.5289;
    setInterval(()=>checkLocais(testeLat, testeLng), 2000);
  }
}

document.getElementById("startBtn").addEventListener("click", ()=>{
  alert("O passeio romântico começou! 💖");
  iniciarPasseio();
});

// ===== Carrossel automático =====
function iniciarCarrossel(id){
  const track = document.querySelector(`#${id} .carousel-track`);
  const slides = track.children;
  let index = 0;
  setInterval(()=>{
    index = (index+1)%slides.length;
    track.style.transform = `translateX(-${index*100}%)`;
  },3000);
}

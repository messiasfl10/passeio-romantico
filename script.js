// Contador detalhado desde 23/04/2023
const startDate = new Date('2023-04-23T00:00:00');

function updateCountdown() {
    const now = new Date();
    let diff = now - startDate;

    const second = 1000;
    const minute = second * 60;
    const hour   = minute * 60;
    const day    = hour * 24;

    let years = Math.floor(diff / (day * 365));
    diff -= years * day * 365;

    let months = Math.floor(diff / (day * 30));
    diff -= months * day * 30;

    let days = Math.floor(diff / day);
    diff -= days * day;

    let hours = Math.floor(diff / hour);
    diff -= hours * hour;

    let minutes = Math.floor(diff / minute);
    diff -= minutes * minute;

    let seconds = Math.floor(diff / second);

    document.getElementById('daysCount').innerHTML = `
        <span>${years}<span class="unit">anos</span></span>
        <span>${months}<span class="unit">meses</span></span>
        <span>${days}<span class="unit">dias</span></span>
        <span>${hours}<span class="unit">h</span></span>
        <span>${minutes}<span class="unit">m</span></span>
        <span>${seconds}<span class="unit">s</span></span>
    `;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Coordenadas dos locais (substitua com as corretas)
const locations = [
    {id: 'location1', lat: -3.740537, lon: -38.534670},
    {id: 'location2', lat: -3.740537, lon: -38.534670},
    {id: 'location3', lat: -3.740537, lon: -38.534670},
    {id: 'location4', lat: -3.740537, lon: -38.534670}
];

// Distância entre coordenadas
function getDistanceFromLatLonInM(lat1,lon1,lat2,lon2){
    const R=6371e3;
    const φ1=lat1*Math.PI/180;
    const φ2=lat2*Math.PI/180;
    const Δφ=(lat2-lat1)*Math.PI/180;
    const Δλ=(lon2-lon1)*Math.PI/180;
    const a=Math.sin(Δφ/2)**2+Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
    const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    return R*c;
}

let nextLocationIndex = 0;

function checkLocation(position){
    const { latitude, longitude } = position.coords;
    if(nextLocationIndex<locations.length){
        const nextLoc = locations[nextLocationIndex];
        const distance = getDistanceFromLatLonInM(latitude, longitude, nextLoc.lat, nextLoc.lon);

        if(distance < 100 && distance >= 50){ showNearbyMessage(nextLoc.id); }
        if(distance < 100){
            const section = document.getElementById(nextLoc.id);
            section.style.display='flex';
            revealSection(section);
            nextLocationIndex++;
        }
    }
}

function showNearbyMessage(locationId){
    let msg = document.getElementById('nearbyMessage');
    msg.style.opacity='1';
    setTimeout(()=>{ msg.style.opacity='0'; },4000);

    const heart = document.getElementById('giantHeart');
    heart.classList.remove('show'); 
    void heart.offsetWidth; 
    heart.classList.add('show');
    setTimeout(()=>{ heart.classList.remove('show'); },2100);
}

document.getElementById('startTour').addEventListener('click',()=>{
    if(navigator.geolocation){
        navigator.geolocation.watchPosition(checkLocation,(err)=>{
            alert('Não foi possível acessar sua localização.'); 
            console.error(err);
        },{ enableHighAccuracy:true });
        alert('Passeio iniciado! Dirija-se ao primeiro local.');
    } else { alert('Geolocalização não suportada neste dispositivo.'); }
});

function revealSection(section){ section.classList.add('visible'); }

function createHeart(){
    const heart=document.createElement('div');
    heart.className='heart';
    heart.style.left=Math.random()*window.innerWidth+'px';
    heart.innerText='❤️';
    document.getElementById('hearts-container').appendChild(heart);
    setTimeout(()=>heart.remove(),4000);
}
setInterval(createHeart,500);

window.addEventListener('scroll',()=>{
    document.querySelectorAll('section').forEach(section=>{
        const rect=section.getBoundingClientRect();
        if(rect.top<window.innerHeight-100) revealSection(section);
    });
});

// Carrosséis
const carousel1=document.querySelectorAll('#location1 .carousel img');
let current1=0;
function nextSlide1(){ carousel1[current1].classList.remove('active'); current1=(current1+1)%carousel1.length; carousel1[current1].classList.add('active'); }
setInterval(nextSlide1,3000);

const carousel2=document.querySelectorAll('#location2 .carousel-zoom img');
let current2=0;
function nextSlide2(){ carousel2[current2].classList.remove('active'); current2=(current2+1)%carousel2.length; carousel2[current2].classList.add('active'); }
setInterval(nextSlide2,3000);



